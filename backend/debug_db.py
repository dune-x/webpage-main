from backend.database import SessionLocal
from backend.models import Match

def check_matches():
    db = SessionLocal()
    matches = db.query(Match).all()
    print(f"Total Matches: {len(matches)}")
    for m in matches:
        print(f"Match {m.id}: Time='{m.time_slot}' Court='{m.court}'")
    db.close()

if __name__ == "__main__":
    check_matches()
