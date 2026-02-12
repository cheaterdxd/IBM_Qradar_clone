"""
Time-based event correlation engine
"""
from typing import List, Dict, Any
from datetime import datetime, timedelta
from collections import defaultdict


class Correlator:
    """Handle time-based event correlation"""
    
    @staticmethod
    def parse_timestamp(timestamp_str: str) -> datetime:
        """
        Parse timestamp string to datetime
        
        Args:
            timestamp_str: ISO format timestamp string
            
        Returns:
            datetime object
        """
        # Support multiple timestamp formats
        formats = [
            "%Y-%m-%dT%H:%M:%SZ",
            "%Y-%m-%dT%H:%M:%S.%fZ",
            "%Y-%m-%d %H:%M:%S",
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(timestamp_str, fmt)
            except ValueError:
                continue
        
        raise ValueError(f"Unable to parse timestamp: {timestamp_str}")
    
    @staticmethod
    def parse_time_window(time_window: Dict[str, Any]) -> timedelta:
        """
        Parse time window to timedelta
        
        Args:
            time_window: Dict with 'value' and 'unit' keys
            
        Returns:
            timedelta object
        """
        value = time_window['value']
        unit = time_window['unit'].lower()
        
        if unit in ['second', 'seconds']:
            return timedelta(seconds=value)
        elif unit in ['minute', 'minutes']:
            return timedelta(minutes=value)
        elif unit in ['hour', 'hours']:
            return timedelta(hours=value)
        elif unit in ['day', 'days']:
            return timedelta(days=value)
        else:
            raise ValueError(f"Unknown time unit: {unit}")
    
    @staticmethod
    def sort_events_by_timestamp(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Sort events by timestamp
        
        Args:
            events: List of event dictionaries
            
        Returns:
            Sorted list of events
        """
        def get_timestamp(event):
            try:
                return Correlator.parse_timestamp(event.get('timestamp', ''))
            except:
                return datetime.min
        
        return sorted(events, key=get_timestamp)
    
    @staticmethod
    def group_events_by_time_window(
        events: List[Dict[str, Any]],
        time_window: Dict[str, Any],
        group_by: str = None
    ) -> List[List[Dict[str, Any]]]:
        """
        Group events within time windows
        
        Args:
            events: List of event dictionaries
            time_window: Time window specification
            group_by: Optional field to group by (e.g., sourceIP)
            
        Returns:
            List of event groups
        """
        if not events:
            return []
        
        # Sort events by timestamp
        sorted_events = Correlator.sort_events_by_timestamp(events)
        
        # Parse time window
        window_delta = Correlator.parse_time_window(time_window)
        
        # Group events
        if group_by:
            # Group by field value (e.g., sourceIP)
            grouped = defaultdict(list)
            for event in sorted_events:
                key = event.get(group_by, '__none__')
                grouped[key].append(event)
            
            # Apply time window to each group
            result = []
            for key, group_events in grouped.items():
                result.extend(Correlator._apply_time_window(group_events, window_delta))
            
            return result
        else:
            # Apply time window to all events
            return Correlator._apply_time_window(sorted_events, window_delta)
    
    @staticmethod
    def _apply_time_window(
        events: List[Dict[str, Any]],
        window_delta: timedelta
    ) -> List[List[Dict[str, Any]]]:
        """
        Apply sliding time window to events
        
        Args:
            events: Sorted list of events
            window_delta: Time window duration
            
        Returns:
            List of event groups within time windows
        """
        if not events:
            return []
        
        groups = []
        
        for i, event in enumerate(events):
            try:
                event_time = Correlator.parse_timestamp(event.get('timestamp', ''))
            except:
                continue
            
            # Collect events within window starting from this event
            window_events = [event]
            window_end = event_time + window_delta
            
            for j in range(i + 1, len(events)):
                try:
                    next_time = Correlator.parse_timestamp(events[j].get('timestamp', ''))
                    if next_time <= window_end:
                        window_events.append(events[j])
                    else:
                        break
                except:
                    continue
            
            groups.append(window_events)
        
        return groups
    
    @staticmethod
    def find_matching_window(
        events: List[Dict[str, Any]],
        time_window: Dict[str, Any],
        min_count: int,
        group_by: str = None
    ) -> tuple[bool, List[Dict[str, Any]]]:
        """
        Find if there's a time window with minimum event count
        
        Args:
            events: List of event dictionaries
            time_window: Time window specification
            min_count: Minimum number of events required
            group_by: Optional field to group by
            
        Returns:
            Tuple of (found, matching_events)
        """
        groups = Correlator.group_events_by_time_window(events, time_window, group_by)
        
        for group in groups:
            if len(group) >= min_count:
                return True, group
        
        return False, []
