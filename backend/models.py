from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from .database import Base
import enum

class MatchStatus(str, enum.Enum):
    PENDING = "pending"
    PLAYED = "played"

class Participant(Base):
    __tablename__ = "participants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    group = Column(String, index=True)
    
class Match(Base):
    __tablename__ = "matches"
    id = Column(String, primary_key=True, index=True) # group-id1-id2
    group = Column(String, index=True)
    
    player1_id = Column(Integer, ForeignKey("participants.id"))
    player2_id = Column(Integer, ForeignKey("participants.id"))
    
    score_p1 = Column(Integer, default=0)
    score_p2 = Column(Integer, default=0)
    
    status = Column(String, default="pending") # pending, played
    
    time_slot = Column(String, nullable=True) # "10:00"
    court = Column(String, nullable=True) # "A"
    
    player1 = relationship("Participant", foreign_keys=[player1_id])
    player2 = relationship("Participant", foreign_keys=[player2_id])

class Config(Base):
    __tablename__ = "config"
    key = Column(String, primary_key=True)
    value = Column(String) 

# For brackets we might need a simpler structure or just JSON blob if it's dynamic
class BracketNode(Base):
    __tablename__ = "bracket_nodes"
    id = Column(String, primary_key=True) # oro-qf-0
    stage = Column(String) # qf, sf, f
    bracket_type = Column(String) # oro, plata
    match_index = Column(Integer)
    
    player1_name = Column(String, nullable=True) # Can be a placeholder or real name
    player2_name = Column(String, nullable=True)
    
    player1_id = Column(Integer, nullable=True)
    player2_id = Column(Integer, nullable=True)
    
    score_p1 = Column(Integer, default=0)
    score_p2 = Column(Integer, default=0)
    winner_id = Column(Integer, nullable=True)

