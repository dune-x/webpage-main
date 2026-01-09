from backend.database import engine, SessionLocal, Base
from backend.models import Participant, Match
from backend.logic import generate_matches_for_group, calculate_leaderboard

def test_backend():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Clean
    db.query(Match).delete()
    db.query(Participant).delete()
    
    # Create dummy participants
    parts = []
    for i in range(1, 5):
        p = Participant(id=i, name=f"P{i}", group="A")
        parts.append(p)
    db.add_all(parts)
    db.commit()
    
    # Generate matches
    generate_matches_for_group("A", parts, db)
    
    matches = db.query(Match).all()
    print(f"Generated {len(matches)} matches (expected 6)")
    
    # Simulate a result
    m = matches[0]
    m.score_p1 = 6
    m.score_p2 = 2
    m.status = "played"
    db.commit()
    
    # Leaderboard
    lb = calculate_leaderboard(matches, parts)
    print("Leaderboard top:", lb[0])
    
    db.close()

if __name__ == "__main__":
    test_backend()
