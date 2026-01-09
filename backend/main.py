from fastapi import FastAPI, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from .models import Participant, Match, BracketNode, MatchStatus, Config
from .logic import generate_matches_for_group, calculate_leaderboard
from fastapi.middleware.cors import CORSMiddleware
import requests

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is running. Go to http://localhost:3000/torneo"}

# Legacy API to fetch participants
LEGACY_API_URL = "https://script.google.com/macros/s/AKfycbwn6FevKGZhNK5hY3TwVwOk_y4XflQFJ1kmNCIFGzRWa8GglmTihWl63h3ZE_TjeRJFzg/exec"

@app.get("/api/state")
def get_state(db: Session = Depends(get_db)):
    participants = db.query(Participant).all()
    matches = db.query(Match).all()
    
    # Calculate live leaderboard
    leaderboard = calculate_leaderboard(matches, participants)
    
    # Brackets
    brackets = db.query(BracketNode).all()
    
    return {
        "participants": participants,
        "matches": matches,
        "leaderboard": leaderboard,
        "brackets": brackets
    }

@app.post("/api/init")
def init_tournament(db: Session = Depends(get_db)):
    # Clear DB (optional, maybe flag protected)
    db.query(Match).delete()
    db.query(Participant).delete()
    db.query(BracketNode).delete()
    
    # Fetch from Google Sheets
    try:
        res = requests.get(LEGACY_API_URL).json()
        parts = res.get("participants", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch from Google Sheets: {str(e)}")
        
    db_parts = []
    groups = set()
    for p in parts:
        if not p.get("id"): continue
        part = Participant(
            id=int(p["id"]), 
            name=f"{p['player1']} & {p['player2']}", 
            group=str(p["group"]).strip().upper()
        )
        db_parts.append(part)
        groups.add(part.group)
        
    db.add_all(db_parts)
    db.commit()
    
    # Generate Matches
    all_parts = db.query(Participant).all()
    by_group = {}
    for p in all_parts:
        by_group.setdefault(p.group, []).append(p)
        
    for g, members in by_group.items():
        generate_matches_for_group(g, members, db)
        
    return {"status": "initialized", "count": len(db_parts)}

@app.post("/api/match/update")
def update_match(match_id: str = Body(...), scoreA: int = Body(...), scoreB: int = Body(...), db: Session = Depends(get_db)):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
        
    match.score_p1 = scoreA
    match.score_p2 = scoreB
    match.status = MatchStatus.PLAYED
    db.commit()
    return {"status": "ok"}
