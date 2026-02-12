"""
Pydantic models for API request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# ============= User Models =============

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ============= Rule Models =============

class ConditionType(str, Enum):
    COMPARISON = "comparison"
    LOGICAL = "logical"
    AGGREGATION = "aggregation"
    BUILDING_BLOCK_REF = "building_block_ref"
    REGEX = "regex"


class Condition(BaseModel):
    type: ConditionType
    field: Optional[str] = None
    operator: Optional[str] = None
    value: Optional[Any] = None
    children: Optional[List['Condition']] = None
    bb_id: Optional[str] = None
    function: Optional[str] = None
    time_window: Optional[Dict[str, Any]] = None
    group_by: Optional[str] = None


class RuleMetadata(BaseModel):
    created_by: str
    created_at: datetime
    modified_by: str
    modified_at: datetime
    version: str = "1.0"
    tags: Optional[List[str]] = []


class RuleBase(BaseModel):
    name: str
    description: Optional[str] = None
    enabled: bool = True
    severity: str = "medium"
    building_blocks: Optional[List[str]] = []
    conditions: Condition
    aql: str


class RuleCreate(RuleBase):
    pass


class RuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    severity: Optional[str] = None
    building_blocks: Optional[List[str]] = None
    conditions: Optional[Condition] = None
    aql: Optional[str] = None


class RuleResponse(RuleBase):
    id: str
    metadata: RuleMetadata
    
    class Config:
        from_attributes = True


# ============= Building Block Models =============

class BuildingBlockBase(BaseModel):
    name: str
    description: Optional[str] = None
    conditions: Condition
    aql: str


class BuildingBlockCreate(BuildingBlockBase):
    pass


class BuildingBlockUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    conditions: Optional[Condition] = None
    aql: Optional[str] = None


class BuildingBlockResponse(BuildingBlockBase):
    id: str
    metadata: RuleMetadata
    
    class Config:
        from_attributes = True


# ============= Event Models =============

class Event(BaseModel):
    """Event model for testing"""
    eventId: str
    timestamp: str
    eventName: str
    eventCategory: Optional[str] = None
    sourceIP: Optional[str] = None
    destinationIP: Optional[str] = None
    username: Optional[str] = None
    protocol: Optional[str] = None
    port: Optional[int] = None
    severity: Optional[int] = None
    message: Optional[str] = None
    # Allow additional fields
    class Config:
        extra = "allow"


# ============= Test Models =============

class EvaluationPhases(BaseModel):
    building_block: str = "not_applicable"
    normal_logic: str = "not_applicable"
    regex: str = "not_applicable"
    aql: str = "not_applicable"


class TestRequest(BaseModel):
    rule: RuleBase
    events: List[Event]
    building_blocks: Optional[List[BuildingBlockResponse]] = []


class TestResult(BaseModel):
    alert: bool
    rule_id: Optional[str] = None
    rule_name: str
    matched_events: List[Event] = []
    trigger_details: Optional[str] = None
    trigger_timestamp: Optional[str] = None
    evaluation_phases: EvaluationPhases
    error: Optional[str] = None


class ValidateSyntaxRequest(BaseModel):
    aql: str


class ValidateSyntaxResponse(BaseModel):
    valid: bool
    error: Optional[str] = None
    ast: Optional[Dict[str, Any]] = None


# ============= Audit Models =============

class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    entity_type: str
    entity_id: str
    action: str
    changes: Optional[str] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True


# Update forward references
Condition.model_rebuild()
