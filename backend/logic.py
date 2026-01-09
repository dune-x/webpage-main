from .models import Participant, Match
from sqlalchemy.orm import Session
import datetime

def generate_matches_for_group(group_name: str, participants: list[Participant], db: Session):
    # participants is a list of Participant objects
    # Round Robin for 4 players: (0,1 vs 2,3 is not how padel works, it's pairs vs pairs)
    # 4 pairs = 6 matches. 
    # Logic from index.html:
    # 0 vs 1, 2 vs 3
    # 0 vs 2, 1 vs 3
    # 0 vs 3, 1 vs 2
    
    ids = [p.id for p in participants]
    existing = db.query(Match).filter(Match.group == group_name).all()
    if existing:
        return # Already generated
        
    matches = []
    
    # Simple algorithm for exactly 4 pairs
    if len(ids) == 4:
        # Standard Padel Americano / Round Robin order
        # Round 1: 0v1, 2v3
        # Round 2: 0v2, 1v3
        # Round 3: 0v3, 1v2
        rounds = [
            [(ids[0], ids[1]), (ids[2], ids[3])],
            [(ids[0], ids[2]), (ids[1], ids[3])],
            [(ids[0], ids[3]), (ids[1], ids[2])]
        ]
        
        # Default config per group (could be passed in or fetched from DB)
        start_hour = 10
        start_minute = 0
        slot_minutes = 30
        
        # Assign courts based on group name to distribute them
        # Logic: Group A -> Courts 1,2; Group B -> Courts 3,4...
        # Simple hash or mapping for now.
        # Let's say we have 16 courts.
        g_idx = 0
        if len(group_name) == 1:
            g_idx = ord(group_name) - ord('A')
        
        # Each group gets 2 distinct courts if possible, or rotates.
        # Let's assign strict courts per group for simplicity as requested "lo ideal es que un mismo grupo juegue siempre en una misma pista"
        # We need 2 matches parallel per round, so we need 2 courts or 1 court with more time.
        # "4 parejas por grupos... partidos de 25+5... cada pareja juega 3 partidos"
        # 4 pairs = 2 simultaneous matches. So we need 2 courts per group if we want them to play at same time.
        
        base_court_idx = (g_idx * 2) + 1 
        court_1 = f"Pista {base_court_idx}"
        court_2 = f"Pista {base_court_idx + 1}"

        for r_idx, round_matches in enumerate(rounds):
            # Calculate time
            total_minutes = (start_hour * 60 + start_minute) + (r_idx * slot_minutes)
            h = total_minutes // 60
            m = total_minutes % 60
            time_str = f"{h:02d}:{m:02d}"
            
            # Match 1
            p1, p2 = round_matches[0]
            matches.append(Match(
                id=f"{group_name}-{p1}-{p2}",
                group=group_name,
                player1_id=p1,
                player2_id=p2,
                status="pending",
                time_slot=time_str,
                court=court_1
            ))
            
            # Match 2
            p1, p2 = round_matches[1]
            matches.append(Match(
                id=f"{group_name}-{p1}-{p2}",
                group=group_name,
                player1_id=p1,
                player2_id=p2,
                status="pending",
                time_slot=time_str,
                court=court_2
            ))
    else:
        # Generic round robin for non-4 groups
        # We need to schedule them. 
        # Simple approach: Linear scheduling.
        start_hour = 10
        start_minute = 0
        slot_minutes = 30
        
        g_idx = 0
        if len(group_name) == 1:
            g_idx = ord(group_name) - ord('A')
        
        base_court_idx = (g_idx * 2) + 1 
        court_1 = f"Pista {base_court_idx}"

        match_count = 0
        for i in range(len(ids)):
            for j in range(i + 1, len(ids)):
                 p1, p2 = ids[i], ids[j]
                 match_id = f"{group_name}-{p1}-{p2}"
                 
                 # Calculate time based on match sequence for this group
                 # Assume 1 match per slot per court for this generic case
                 total_minutes = (start_hour * 60 + start_minute) + (match_count * slot_minutes)
                 h = total_minutes // 60
                 m = total_minutes % 60
                 time_str = f"{h:02d}:{m:02d}"

                 matches.append(Match(
                    id=match_id,
                    group=group_name,
                    player1_id=p1,
                    player2_id=p2,
                    status="pending",
                    time_slot=time_str,
                    court=court_1
                ))
                 match_count += 1
    
    db.add_all(matches)
    db.commit()

def calculate_leaderboard(matches: list[Match], participants: list[Participant]):
    # Returns a list of dicts with stats
    stats = {p.id: {
        "id": p.id, "name": p.name, "group": p.group,
        "pg": 0, "pe": 0, "pp": 0, "jg": 0, "jp": 0, "points": 0
    } for p in participants}
    
    for m in matches:
        if m.status != "played": # In the legacy code it checks if scores are 0-0, but explicit status is better
             # However, legacy allows partial updates. Let's assume content if scores > 0
             if m.score_p1 == 0 and m.score_p2 == 0:
                 continue

        s1 = stats[m.player1_id]
        s2 = stats[m.player2_id]
        
        s1["jg"] += m.score_p1
        s1["jp"] += m.score_p2
        s2["jg"] += m.score_p2
        s2["jp"] += m.score_p1
        
        if m.score_p1 > m.score_p2:
            s1["pg"] += 1
            s1["points"] += 3
            s2["pp"] += 1
        elif m.score_p2 > m.score_p1:
            s2["pg"] += 1
            s2["points"] += 3
            s1["pp"] += 1
        else:
            s1["pe"] += 1
            s2["pe"] += 1
            s1["points"] += 1
            s2["points"] += 1
            
    # Convert to list and calculate diff
    leaderboard = []
    for pid, s in stats.items():
        s["diff"] = s["jg"] - s["jp"]
        leaderboard.append(s)
        
    # Sort
    leaderboard.sort(key=lambda x: (x["points"], x["diff"], x["jg"]), reverse=True)
    return leaderboard

