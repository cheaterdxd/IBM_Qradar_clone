"""
Rules API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
import uuid

from app.models.schemas import RuleCreate, RuleUpdate, RuleResponse, RuleMetadata
from app.models.db_models import User
from app.storage.file_storage import rules_storage
from app.api.routes.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=RuleResponse, status_code=status.HTTP_201_CREATED)
async def create_rule(rule_data: RuleCreate, current_user: User = Depends(get_current_user)):
    """Create a new rule"""
    rule_id = f"rule_{uuid.uuid4().hex[:8]}"
    
    now = datetime.utcnow()
    metadata = RuleMetadata(
        created_by=current_user.username,
        created_at=now,
        modified_by=current_user.username,
        modified_at=now,
        version="1.0",
        tags=[]
    )
    
    rule_dict = {
        "id": rule_id,
        **rule_data.dict(),
        "metadata": metadata.dict()
    }
    
    if not rules_storage.save(rule_id, rule_dict):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save rule"
        )
    
    return rule_dict


@router.get("/", response_model=List[RuleResponse])
async def list_rules(current_user: User = Depends(get_current_user)):
    """List all rules"""
    rules = rules_storage.load_all()
    return rules


@router.get("/{rule_id}", response_model=RuleResponse)
async def get_rule(rule_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific rule"""
    rule = rules_storage.load(rule_id)
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rule {rule_id} not found"
        )
    return rule


@router.put("/{rule_id}", response_model=RuleResponse)
async def update_rule(
    rule_id: str,
    rule_data: RuleUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a rule"""
    existing_rule = rules_storage.load(rule_id)
    if not existing_rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rule {rule_id} not found"
        )
    
    # Update fields
    update_data = rule_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        existing_rule[field] = value
    
    # Update metadata
    existing_rule["metadata"]["modified_by"] = current_user.username
    existing_rule["metadata"]["modified_at"] = datetime.utcnow().isoformat()
    
    if not rules_storage.save(rule_id, existing_rule):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update rule"
        )
    
    return existing_rule


@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rule(rule_id: str, current_user: User = Depends(get_current_user)):
    """Delete a rule"""
    existing_rule = rules_storage.load(rule_id)
    if not existing_rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rule {rule_id} not found"
        )
    
    if not rules_storage.delete(rule_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete rule"
        )
    
    return None
