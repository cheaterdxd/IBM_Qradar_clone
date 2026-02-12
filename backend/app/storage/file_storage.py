"""
YAML file-based storage for rules and Building Blocks
"""
import os
import yaml
import json
from typing import List, Optional, Dict, Any
from pathlib import Path
from app.config import settings


class FileStorage:
    """Handle YAML file storage for rules and Building Blocks"""
    
    def __init__(self, storage_dir: str):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_file_path(self, entity_id: str) -> Path:
        """Get file path for entity"""
        return self.storage_dir / f"{entity_id}.yaml"
    
    def save(self, entity_id: str, data: Dict[str, Any]) -> bool:
        """
        Save entity to YAML file
        
        Args:
            entity_id: Unique identifier
            data: Entity data dictionary
            
        Returns:
            True if successful
        """
        try:
            file_path = self._get_file_path(entity_id)
            with open(file_path, 'w', encoding='utf-8') as f:
                yaml.safe_dump(data, f, default_flow_style=False, allow_unicode=True)
            return True
        except Exception as e:
            print(f"Error saving {entity_id}: {e}")
            return False
    
    def load(self, entity_id: str) -> Optional[Dict[str, Any]]:
        """
        Load entity from YAML file
        
        Args:
            entity_id: Unique identifier
            
        Returns:
            Entity data or None if not found
        """
        try:
            file_path = self._get_file_path(entity_id)
            if not file_path.exists():
                return None
            
            with open(file_path, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
            return data
        except Exception as e:
            print(f"Error loading {entity_id}: {e}")
            return None
    
    def delete(self, entity_id: str) -> bool:
        """
        Delete entity file
        
        Args:
            entity_id: Unique identifier
            
        Returns:
            True if successful
        """
        try:
            file_path = self._get_file_path(entity_id)
            if file_path.exists():
                file_path.unlink()
            return True
        except Exception as e:
            print(f"Error deleting {entity_id}: {e}")
            return False
    
    def list_all(self) -> List[str]:
        """
        List all entity IDs
        
        Returns:
            List of entity IDs
        """
        try:
            return [f.stem for f in self.storage_dir.glob("*.yaml")]
        except Exception as e:
            print(f"Error listing entities: {e}")
            return []
    
    def load_all(self) -> List[Dict[str, Any]]:
        """
        Load all entities
        
        Returns:
            List of entity data dictionaries
        """
        entities = []
        for entity_id in self.list_all():
            data = self.load(entity_id)
            if data:
                entities.append(data)
        return entities
    
    def export_to_yaml(self, output_path: str) -> bool:
        """
        Export all entities to single YAML file
        
        Args:
            output_path: Output file path
            
        Returns:
            True if successful
        """
        try:
            entities = self.load_all()
            with open(output_path, 'w', encoding='utf-8') as f:
                yaml.safe_dump(entities, f, default_flow_style=False, allow_unicode=True)
            return True
        except Exception as e:
            print(f"Error exporting: {e}")
            return False
    
    def import_from_yaml(self, input_path: str) -> int:
        """
        Import entities from YAML file
        
        Args:
            input_path: Input file path
            
        Returns:
            Number of entities imported
        """
        try:
            with open(input_path, 'r', encoding='utf-8') as f:
                entities = yaml.safe_load(f)
            
            if not isinstance(entities, list):
                entities = [entities]
            
            count = 0
            for entity in entities:
                if 'id' in entity:
                    if self.save(entity['id'], entity):
                        count += 1
            
            return count
        except Exception as e:
            print(f"Error importing: {e}")
            return 0


# Initialize storage instances
rules_storage = FileStorage(settings.RULES_DIR)
building_blocks_storage = FileStorage(settings.BUILDING_BLOCKS_DIR)
