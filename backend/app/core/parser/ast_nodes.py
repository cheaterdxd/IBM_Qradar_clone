"""
AST Node definitions for AQL parser
"""
from typing import Any, List, Optional, Dict
from enum import Enum


class NodeType(str, Enum):
    """AST Node types"""
    COMPARISON = "comparison"
    LOGICAL = "logical"
    AGGREGATION = "aggregation"
    BUILDING_BLOCK_REF = "building_block_ref"
    REGEX = "regex"
    STRING_OP = "string_op"
    IN_OP = "in_op"


class ASTNode:
    """Base AST Node"""
    def __init__(self, node_type: NodeType):
        self.type = node_type
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        raise NotImplementedError


class ComparisonNode(ASTNode):
    """Comparison operation: field operator value"""
    def __init__(self, field: str, operator: str, value: Any):
        super().__init__(NodeType.COMPARISON)
        self.field = field
        self.operator = operator
        self.value = value
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type.value,
            "field": self.field,
            "operator": self.operator,
            "value": self.value
        }


class LogicalNode(ASTNode):
    """Logical operation: AND, OR, NOT"""
    def __init__(self, operator: str, children: List[ASTNode]):
        super().__init__(NodeType.LOGICAL)
        self.operator = operator  # AND, OR, NOT
        self.children = children
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.operator,
            "children": [child.to_dict() for child in self.children]
        }


class AggregationNode(ASTNode):
    """Aggregation function: COUNT, SUM, AVG, etc."""
    def __init__(self, function: str, field: str, operator: str, value: Any,
                 time_window: Optional[Dict[str, Any]] = None,
                 group_by: Optional[str] = None):
        super().__init__(NodeType.AGGREGATION)
        self.function = function
        self.field = field
        self.operator = operator
        self.value = value
        self.time_window = time_window
        self.group_by = group_by
    
    def to_dict(self) -> Dict[str, Any]:
        result = {
            "type": self.type.value,
            "function": self.function,
            "field": self.field,
            "operator": self.operator,
            "value": self.value
        }
        if self.time_window:
            result["time_window"] = self.time_window
        if self.group_by:
            result["group_by"] = self.group_by
        return result


class BuildingBlockRefNode(ASTNode):
    """Building Block reference: when BB_Name"""
    def __init__(self, bb_id: str):
        super().__init__(NodeType.BUILDING_BLOCK_REF)
        self.bb_id = bb_id
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type.value,
            "bb_id": self.bb_id
        }


class RegexNode(ASTNode):
    """Regex pattern matching: field MATCHES pattern"""
    def __init__(self, field: str, pattern: str):
        super().__init__(NodeType.REGEX)
        self.field = field
        self.pattern = pattern
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type.value,
            "field": self.field,
            "operator": "MATCHES",
            "value": self.pattern
        }


class StringOpNode(ASTNode):
    """String operations: CONTAINS, STARTSWITH, ENDSWITH"""
    def __init__(self, field: str, operator: str, value: str):
        super().__init__(NodeType.STRING_OP)
        self.field = field
        self.operator = operator
        self.value = value
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type.value,
            "field": self.field,
            "operator": self.operator,
            "value": self.value
        }


class InOpNode(ASTNode):
    """IN operator: field IN (value1, value2, ...)"""
    def __init__(self, field: str, values: List[Any], negated: bool = False):
        super().__init__(NodeType.IN_OP)
        self.field = field
        self.values = values
        self.negated = negated
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type.value,
            "field": self.field,
            "operator": "NOT IN" if self.negated else "IN",
            "value": self.values
        }
