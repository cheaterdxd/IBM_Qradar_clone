"""
Expression evaluator for individual conditions
"""
import re
from typing import Any, Dict
from app.core.parser.ast_nodes import (
    ComparisonNode, StringOpNode, RegexNode, InOpNode
)


class Evaluator:
    """Evaluate individual conditions against events"""
    
    @staticmethod
    def get_field_value(event: Dict[str, Any], field: str) -> Any:
        """
        Get field value from event
        
        Args:
            event: Event dictionary
            field: Field name
            
        Returns:
            Field value or None if not found
        """
        return event.get(field)
    
    @staticmethod
    def evaluate_comparison(node: ComparisonNode, event: Dict[str, Any]) -> bool:
        """
        Evaluate comparison operation
        
        Args:
            node: ComparisonNode
            event: Event dictionary
            
        Returns:
            True if comparison matches
        """
        field_value = Evaluator.get_field_value(event, node.field)
        
        if field_value is None:
            return False
        
        # Type conversion for comparison
        try:
            if isinstance(node.value, (int, float)):
                field_value = float(field_value) if isinstance(field_value, str) else field_value
        except (ValueError, TypeError):
            pass
        
        # Perform comparison
        if node.operator == '=':
            return field_value == node.value
        elif node.operator == '!=':
            return field_value != node.value
        elif node.operator == '<':
            return field_value < node.value
        elif node.operator == '<=':
            return field_value <= node.value
        elif node.operator == '>':
            return field_value > node.value
        elif node.operator == '>=':
            return field_value >= node.value
        
        return False
    
    @staticmethod
    def evaluate_string_op(node: StringOpNode, event: Dict[str, Any]) -> bool:
        """
        Evaluate string operation
        
        Args:
            node: StringOpNode
            event: Event dictionary
            
        Returns:
            True if string operation matches
        """
        field_value = Evaluator.get_field_value(event, node.field)
        
        if field_value is None:
            return False
        
        # Convert to string
        field_value = str(field_value)
        search_value = str(node.value)
        
        if node.operator == 'CONTAINS':
            return search_value in field_value
        elif node.operator == 'STARTSWITH':
            return field_value.startswith(search_value)
        elif node.operator == 'ENDSWITH':
            return field_value.endswith(search_value)
        
        return False
    
    @staticmethod
    def evaluate_regex(node: RegexNode, event: Dict[str, Any]) -> bool:
        """
        Evaluate regex pattern matching
        
        Args:
            node: RegexNode
            event: Event dictionary
            
        Returns:
            True if regex matches
        """
        field_value = Evaluator.get_field_value(event, node.field)
        
        if field_value is None:
            return False
        
        # Convert to string
        field_value = str(field_value)
        
        try:
            pattern = re.compile(node.pattern)
            return pattern.search(field_value) is not None
        except re.error:
            return False
    
    @staticmethod
    def evaluate_in_op(node: InOpNode, event: Dict[str, Any]) -> bool:
        """
        Evaluate IN operator
        
        Args:
            node: InOpNode
            event: Event dictionary
            
        Returns:
            True if value is in list (or not in list if negated)
        """
        field_value = Evaluator.get_field_value(event, node.field)
        
        if field_value is None:
            return False
        
        result = field_value in node.values
        
        # Apply negation if needed
        if node.negated:
            result = not result
        
        return result
