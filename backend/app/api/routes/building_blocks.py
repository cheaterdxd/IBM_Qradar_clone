"""
Building Blocks API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
import uuid

from app.models.schemas import BuildingBlockCreate, BuildingBlockUpdate, BuildingBlockResponse, RuleMetadata
from app.models.db_models import User
from app.storage.file_storage import building_blocks_storage
from app.api.routes.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=BuildingBlockResponse, status_code=status.HTTP_201_CREATED)
async def create_building_block(bb_data: BuildingBlockCreate, current_user: User = Depends(get_current_user)):
    """Create a new Building Block"""
    bb_id = f"BB_{uuid.uuid4().hex[:8]}"
    
    now = datetime.utcnow()
    metadata = RuleMetadata(
        created_by=current_user.username,
        created_at=now,
        modified_by=current_user.username,
        modified_at=now,
        version="1.0",
        tags=[]
    )
    
    bb_dict = {
        "id": bb_id,
        **bb_data.dict(),
        "metadata": metadata.dict()
    }
    
    if not building_blocks_storage.save(bb_id, bb_dict):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save Building Block"
        )
    
    return bb_dict


@router.get("/", response_model=List[BuildingBlockResponse])
async def list_building_blocks(current_user: User = Depends(get_current_user)):
    """List all Building Blocks"""
    bbs = building_blocks_storage.load_all()
    return bbs


@router.get("/{bb_id}", response_model=BuildingBlockResponse)
async def get_building_block(bb_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific Building Block"""
    bb = building_blocks_storage.load(bb_id)
    if not bb:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Building Block {bb_id} not found"
        )
    return bb


@router.put("/{bb_id}", response_model=BuildingBlockResponse)
async def update_building_block(
    bb_id: str,
    bb_data: BuildingBlockUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a Building Block"""
    existing_bb = building_blocks_storage.load(bb_id)
    if not existing_bb:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Building Block {bb_id} not found"
        )
    
    # Update fields
    update_data = bb_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        existing_bb[field] = value
    
    # Update metadata
    existing_bb["metadata"]["modified_by"] = current_user.username
    existing_bb["metadata"]["modified_at"] = datetime.utcnow().isoformat()
    
    if not building_blocks_storage.save(bb_id, existing_bb):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update Building Block"
        )
    
    return existing_bb


@router.delete("/{bb_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_building_block(bb_id: str, current_user: User = Depends(get_current_user)):
    """Delete a Building Block"""
    existing_bb = building_blocks_storage.load(bb_id)
    if not existing_bb:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Building Block {bb_id} not found"
        )
    
    if not building_blocks_storage.delete(bb_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete Building Block"
        )
    
    return None
