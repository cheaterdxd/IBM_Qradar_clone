"""
Database models for SQLAlchemy
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    """User model for authentication"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100))
    email = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)


class AuditLog(Base):
    """Audit log for tracking rule/BB modifications"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    entity_type = Column(String(20), nullable=False)  # 'rule' or 'building_block'
    entity_id = Column(String(100), nullable=False)
    action = Column(String(20), nullable=False)  # 'created', 'updated', 'deleted'
    changes = Column(Text, nullable=True)  # JSON string of changes
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
