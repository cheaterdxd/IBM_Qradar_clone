"""
Aggregation functions for AQL
"""
from typing import List, Dict, Any


class Aggregator:
    """Handle aggregation functions (COUNT, SUM, AVG, MIN, MAX)"""
    
    @staticmethod
    def count(events: List[Dict[str, Any]], field: str) -> int:
        """
        Count events with non-null field value
        
        Args:
            events: List of event dictionaries
            field: Field name to count
            
        Returns:
            Count of events with field
        """
        count = 0
        for event in events:
            if event.get(field) is not None:
                count += 1
        return count
    
    @staticmethod
    def sum(events: List[Dict[str, Any]], field: str) -> float:
        """
        Sum field values across events
        
        Args:
            events: List of event dictionaries
            field: Field name to sum
            
        Returns:
            Sum of field values
        """
        total = 0
        for event in events:
            value = event.get(field)
            if value is not None:
                try:
                    total += float(value)
                except (ValueError, TypeError):
                    pass
        return total
    
    @staticmethod
    def avg(events: List[Dict[str, Any]], field: str) -> float:
        """
        Average field values across events
        
        Args:
            events: List of event dictionaries
            field: Field name to average
            
        Returns:
            Average of field values
        """
        values = []
        for event in events:
            value = event.get(field)
            if value is not None:
                try:
                    values.append(float(value))
                except (ValueError, TypeError):
                    pass
        
        if not values:
            return 0
        
        return sum(values) / len(values)
    
    @staticmethod
    def min(events: List[Dict[str, Any]], field: str) -> Any:
        """
        Minimum field value across events
        
        Args:
            events: List of event dictionaries
            field: Field name to find minimum
            
        Returns:
            Minimum field value
        """
        values = []
        for event in events:
            value = event.get(field)
            if value is not None:
                values.append(value)
        
        if not values:
            return None
        
        return min(values)
    
    @staticmethod
    def max(events: List[Dict[str, Any]], field: str) -> Any:
        """
        Maximum field value across events
        
        Args:
            events: List of event dictionaries
            field: Field name to find maximum
            
        Returns:
            Maximum field value
        """
        values = []
        for event in events:
            value = event.get(field)
            if value is not None:
                values.append(value)
        
        if not values:
            return None
        
        return max(values)
    
    @staticmethod
    def aggregate(
        function: str,
        events: List[Dict[str, Any]],
        field: str
    ) -> Any:
        """
        Execute aggregation function
        
        Args:
            function: Aggregation function name (COUNT, SUM, AVG, MIN, MAX)
            events: List of event dictionaries
            field: Field name
            
        Returns:
            Aggregation result
        """
        function = function.upper()
        
        if function == 'COUNT':
            return Aggregator.count(events, field)
        elif function == 'SUM':
            return Aggregator.sum(events, field)
        elif function == 'AVG':
            return Aggregator.avg(events, field)
        elif function == 'MIN':
            return Aggregator.min(events, field)
        elif function == 'MAX':
            return Aggregator.max(events, field)
        else:
            raise ValueError(f"Unknown aggregation function: {function}")
