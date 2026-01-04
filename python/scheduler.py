import json
import math
from datetime import datetime, timedelta

class TournamentScheduler:
    def __init__(self):
        self.participants = []
        self.group_config = {}
        self.court_map = {}
        self.results = {}

    def load_data(self, data):
        self.participants = data.get("participants", [])
        if not self.participants:
            self.load_mock_data()
        else:
            self.group_config = data.get("group_config", {})
            self.court_map = data.get("court_map", {})
            self.results = data.get("results", {})

    def load_mock_data(self):
        # Mocking 4 groups of 4 teams
        self.participants = []
        for g in ["A", "B", "C", "D"]:
            for i in range(1, 5):
                self.participants.append({
                    "id": len(self.participants) + 1,
                    "group": g,
                    "player1": f"Jugador {g}{i}-1",
                    "player2": f"Jugador {g}{i}-2"
                })
        
        self.group_config = {
            "A": {"startTime": "10:00", "slotMinutes": 30, "court1": "1", "court2": "2"},
            "B": {"startTime": "10:00", "slotMinutes": 30, "court1": "3", "court2": "4"},
            "C": {"startTime": "12:00", "slotMinutes": 30, "court1": "1", "court2": "2"},
            "D": {"startTime": "12:00", "slotMinutes": 30, "court1": "3", "court2": "4"}
        }

        # Generate some random results for demo
        self.results = {}
        # Mock some results for Group A and B to show leaderboard
        # We need to run generate_schedule first to know match IDs, but here we can just predict them
        # Match ID format: GROUP-ID1-ID2
        # Let's say we played the first round
        self.results["A-1-2"] = {"scoreA": 9, "scoreB": 4}
        self.results["A-3-4"] = {"scoreA": 2, "scoreB": 9}
        self.results["B-5-6"] = {"scoreA": 6, "scoreB": 7}
        self.results["B-7-8"] = {"scoreA": 9, "scoreB": 8}

    def parse_time(self, time_str):
        return datetime.strptime(time_str, "%H:%M")

    def format_time(self, dt):
        return dt.strftime("%H:%M")

    def generate_schedule(self):
        """
        Generates a round-robin schedule for each group.
        """
        groups = {}
        for p in self.participants:
            group_id = p.get("group", "A")
            if group_id not in groups:
                groups[group_id] = []
            groups[group_id].append(p)

        schedule = []
        
        for group_id, members in sorted(groups.items()):
            members.sort(key=lambda x: int(x.get("id", 0)))
            config = self.group_config.get(group_id, {
                "startTime": "10:00",
                "slotMinutes": 30,
                "court1": "A",
                "court2": "B"
            })
            
            start_time = self.parse_time(config.get("startTime", "10:00"))
            slot_delta = timedelta(minutes=int(config.get("slotMinutes", 30)))
            court1 = config.get("court1", "A")
            court2 = config.get("court2", "B")

            # Round Robin logic
            n = len(members)
            matches = []
            for i in range(n):
                for j in range(i + 1, n):
                    matches.append((members[i], members[j]))

            # Simplified scheduling: 2 matches per slot if possible
            for idx, match in enumerate(matches):
                slot_idx = idx // 2
                match_time = start_time + (slot_idx * slot_delta)
                court = court1 if idx % 2 == 0 else court2
                
                match_id = f"{group_id}-{match[0]['id']}-{match[1]['id']}"
                schedule.append({
                    "id": match_id,
                    "group": group_id,
                    "teamA": f"{match[0]['player1']} & {match[0]['player2']}",
                    "teamB": f"{match[1]['player1']} & {match[1]['player2']}",
                    "time": self.format_time(match_time),
                    "court": court
                })
        
        return schedule

    def calculate_leaderboard(self):
        stats = {}
        for p in self.participants:
            p_id = str(p['id'])
            stats[p_id] = {
                "id": p_id,
                "name": f"{p['player1']} & {p['player2']}",
                "group": p['group'],
                "wins": 0, "draws": 0, "losses": 0,
                "points_scored": 0, "points_conceded": 0,
                "score": 0
            }

        for match_id, res in self.results.items():
            # Match ID format: GROUP-ID1-ID2
            parts = match_id.split("-")
            if len(parts) < 3: continue
            group, idA, idB = parts[0], parts[1], parts[2]
            
            sa = int(res.get("scoreA", 0))
            sb = int(res.get("scoreB", 0))
            
            if sa == 0 and sb == 0: continue

            a, b = stats.get(idA), stats.get(idB)
            if not a or not b: continue

            a["points_scored"] += sa
            a["points_conceded"] += sb
            b["points_scored"] += sb
            b["points_conceded"] += sa

            if sa > sb:
                a["wins"] += 1
                a["score"] += 3
                b["losses"] += 1
            elif sb > sa:
                b["wins"] += 1
                b["score"] += 3
                a["losses"] += 1
            else:
                a["draws"] += 1
                b["draws"] += 1
                a["score"] += 1
                b["score"] += 1

        # Sort by score, then point difference
        leaderboard = list(stats.values())
        leaderboard.sort(key=lambda x: (x["score"], x["points_scored"] - x["points_conceded"]), reverse=True)
        
        # Re-group
        grouped_leaderboard = {}
        for entry in leaderboard:
            g = entry["group"]
            if g not in grouped_leaderboard:
                grouped_leaderboard[g] = []
            grouped_leaderboard[g].append(entry)
            
        return grouped_leaderboard

    def generate_brackets(self, grouped_leaderboard):
        """
        Generates Oro and Plata brackets.
        Oro: Group winners + best seconds.
        Plata: Remaining seconds + best thirds.
        """
        oro_seeds = []
        plata_seeds = []
        
        # Sort groups to be consistent
        sorted_groups = sorted(grouped_leaderboard.keys())
        
        all_seconds = []
        all_thirds = []

        for g in sorted_groups:
            members = grouped_leaderboard[g]
            if len(members) >= 1: oro_seeds.append(members[0])
            if len(members) >= 2: all_seconds.append(members[1])
            if len(members) >= 3: all_thirds.append(members[2])

        # Fill Oro to 8 if possible
        all_seconds.sort(key=lambda x: (x["score"], x["points_scored"] - x["points_conceded"]), reverse=True)
        while len(oro_seeds) < 8 and all_seconds:
            oro_seeds.append(all_seconds.pop(0))
            
        # Fill Plata with remaining seconds and best thirds
        plata_seeds.extend(all_seconds)
        all_thirds.sort(key=lambda x: (x["score"], x["points_scored"] - x["points_conceded"]), reverse=True)
        while len(plata_seeds) < 8 and all_thirds:
            plata_seeds.append(all_thirds.pop(0))

        return {
            "oro": oro_seeds[:8],
            "plata": plata_seeds[:8]
        }

if __name__ == "__main__":
    # Example usage for testing
    import sys
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            data = json.load(f)
        sched = TournamentScheduler()
        sched.load_data(data)
        
        output = {
            "schedule": sched.generate_schedule(),
            "leaderboard": sched.calculate_leaderboard()
        }
        output["brackets"] = sched.generate_brackets(output["leaderboard"])
        
        print(json.dumps(output, indent=2))
