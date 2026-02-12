"""
Main Rule Engine with Priority-based Validation
Priority Order: Building Blocks → Normal Logic → Regex → AQL
"""
from typing import List, Dict, Any, Optional, Tuple
from app.core.parser.ast_nodes import (
    ASTNode, ComparisonNode, LogicalNode, AggregationNode,
    BuildingBlockRefNode, RegexNode, StringOpNode, InOpNode, NodeType
)
from app.core.engine.evaluator import Evaluator
from app.core.engine.correlator import Correlator
from app.core.engine.aggregator import Aggregator


class RuleEngine:
    """
    Rule evaluation engine with priority-based validation
    
    Validation Order (CRITICAL):
    1. Building Blocks (HIGHEST PRIORITY)
    2. Normal Logic (comparisons, AND/OR)
    3. Regex Patterns
    4. Advanced AQL (aggregations, time windows)
    """
    
    def __init__(self):
        self.evaluator = Evaluator()
        self.correlator = Correlator()
        self.aggregator = Aggregator()
    
    def evaluate_rule(
        self,
        rule_ast: ASTNode,
        events: List[Dict[str, Any]],
        building_blocks: Optional[Dict[str, ASTNode]] = None
    ) -> Dict[str, Any]:
        """
        Evaluate rule with strict priority order
        
        Args:
            rule_ast: Rule AST root node
            events: List of event dictionaries
            building_blocks: Dict of Building Block ASTs {bb_id: ast}
            
        Returns:
            Test result dictionary
        """
        building_blocks = building_blocks or {}
        
        # Initialize evaluation phases
        phases = {
            "building_block": "not_applicable",
            "normal_logic": "not_applicable",
            "regex": "not_applicable",
            "aql": "not_applicable"
        }
        
        try:
            # Phase 1: Building Blocks (MUST pass first)
            bb_result = self._evaluate_building_blocks(rule_ast, events, building_blocks)
            if bb_result['has_bb']:
                phases['building_block'] = "passed" if bb_result['passed'] else "failed"
                if not bb_result['passed']:
                    return {
                        "alert": False,
                        "matched_events": [],
                        "trigger_details": None,
                        "evaluation_phases": phases,
                        "error": f"Building Block failed: {bb_result['error']}"
                    }
            
            # Phase 2: Normal Logic
            logic_result = self._evaluate_normal_logic(rule_ast, events)
            if logic_result['has_logic']:
                phases['normal_logic'] = "passed" if logic_result['passed'] else "failed"
                if not logic_result['passed']:
                    return {
                        "alert": False,
                        "matched_events": [],
                        "trigger_details": None,
                        "evaluation_phases": phases,
                        "error": "Normal logic condition failed"
                    }
            
            # Phase 3: Regex Patterns
            regex_result = self._evaluate_regex(rule_ast, events)
            if regex_result['has_regex']:
                phases['regex'] = "passed" if regex_result['passed'] else "failed"
                if not regex_result['passed']:
                    return {
                        "alert": False,
                        "matched_events": [],
                        "trigger_details": None,
                        "evaluation_phases": phases,
                        "error": "Regex pattern failed"
                    }
            
            # Phase 4: Advanced AQL (aggregations, time windows)
            aql_result = self._evaluate_aql(rule_ast, events)
            if aql_result['has_aql']:
                phases['aql'] = "passed" if aql_result['passed'] else "failed"
                if not aql_result['passed']:
                    return {
                        "alert": False,
                        "matched_events": [],
                        "trigger_details": None,
                        "evaluation_phases": phases,
                        "error": f"AQL function failed: {aql_result['error']}"
                    }
                
                # Return AQL result with matched events
                return {
                    "alert": True,
                    "matched_events": aql_result['matched_events'],
                    "trigger_details": aql_result['trigger_details'],
                    "evaluation_phases": phases,
                    "error": None
                }
            
            # All phases passed (no AQL, just logic)
            matched_events = [e for e in events if self._evaluate_node(rule_ast, e, building_blocks)]
            
            return {
                "alert": len(matched_events) > 0,
                "matched_events": matched_events,
                "trigger_details": f"{len(matched_events)} events matched" if matched_events else None,
                "evaluation_phases": phases,
                "error": None
            }
            
        except Exception as e:
            return {
                "alert": False,
                "matched_events": [],
                "trigger_details": None,
                "evaluation_phases": phases,
                "error": f"Evaluation error: {str(e)}"
            }
    
    def _evaluate_building_blocks(
        self,
        node: ASTNode,
        events: List[Dict[str, Any]],
        building_blocks: Dict[str, ASTNode]
    ) -> Dict[str, Any]:
        """Phase 1: Evaluate Building Block references"""
        has_bb, bb_nodes = self._find_nodes_by_type(node, NodeType.BUILDING_BLOCK_REF)
        
        if not has_bb:
            return {"has_bb": False, "passed": True}
        
        # Evaluate each Building Block
        for bb_node in bb_nodes:
            bb_id = bb_node.bb_id
            if bb_id not in building_blocks:
                return {
                    "has_bb": True,
                    "passed": False,
                    "error": f"Building Block '{bb_id}' not found"
                }
            
            bb_ast = building_blocks[bb_id]
            # Check if at least one event matches the Building Block
            matched = any(self._evaluate_node(bb_ast, event, {}) for event in events)
            
            if not matched:
                return {
                    "has_bb": True,
                    "passed": False,
                    "error": f"Building Block '{bb_id}' condition not met"
                }
        
        return {"has_bb": True, "passed": True}
    
    def _evaluate_normal_logic(
        self,
        node: ASTNode,
        events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Phase 2: Evaluate normal logic (comparisons, AND/OR)"""
        has_logic, _ = self._find_nodes_by_type(node, [
            NodeType.COMPARISON,
            NodeType.STRING_OP,
            NodeType.IN_OP
        ])
        
        if not has_logic:
            return {"has_logic": False, "passed": True}
        
        # Check if at least one event matches
        matched = any(self._evaluate_node(node, event, {}) for event in events)
        
        return {"has_logic": True, "passed": matched}
    
    def _evaluate_regex(
        self,
        node: ASTNode,
        events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Phase 3: Evaluate regex patterns"""
        has_regex, _ = self._find_nodes_by_type(node, NodeType.REGEX)
        
        if not has_regex:
            return {"has_regex": False, "passed": True}
        
        # Check if at least one event matches
        matched = any(self._evaluate_node(node, event, {}) for event in events)
        
        return {"has_regex": True, "passed": matched}
    
    def _evaluate_aql(
        self,
        node: ASTNode,
        events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Phase 4: Evaluate advanced AQL (aggregations)"""
        has_aql, agg_nodes = self._find_nodes_by_type(node, NodeType.AGGREGATION)
        
        if not has_aql:
            return {"has_aql": False, "passed": True}
        
        # Evaluate aggregation
        for agg_node in agg_nodes:
            result = self._evaluate_aggregation(agg_node, events)
            if not result['passed']:
                return {
                    "has_aql": True,
                    "passed": False,
                    "error": result['error']
                }
            
            return {
                "has_aql": True,
                "passed": True,
                "matched_events": result['matched_events'],
                "trigger_details": result['trigger_details']
            }
        
        return {"has_aql": False, "passed": True}
    
    def _evaluate_aggregation(
        self,
        node: AggregationNode,
        events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Evaluate aggregation node"""
        # Handle time window if present
        if node.time_window:
            found, matched_events = self.correlator.find_matching_window(
                events,
                node.time_window,
                int(node.value) if node.function == 'COUNT' else 1,
                node.group_by
            )
            
            if not found:
                return {
                    "passed": False,
                    "error": f"No time window found with {node.function}({node.field}) {node.operator} {node.value}"
                }
            
            # Calculate aggregation on matched events
            agg_value = self.aggregator.aggregate(node.function, matched_events, node.field)
        else:
            # No time window, aggregate all events
            matched_events = events
            agg_value = self.aggregator.aggregate(node.function, events, node.field)
        
        # Compare aggregation result
        passed = self._compare_values(agg_value, node.operator, node.value)
        
        if passed:
            trigger_details = f"{node.function}({node.field}) = {agg_value} {node.operator} {node.value}"
            if node.time_window:
                trigger_details += f" within {node.time_window['value']} {node.time_window['unit']}"
            
            return {
                "passed": True,
                "matched_events": matched_events,
                "trigger_details": trigger_details
            }
        else:
            return {
                "passed": False,
                "error": f"{node.function}({node.field}) = {agg_value}, expected {node.operator} {node.value}"
            }
    
    def _evaluate_node(
        self,
        node: ASTNode,
        event: Dict[str, Any],
        building_blocks: Dict[str, ASTNode]
    ) -> bool:
        """Evaluate a single node against an event"""
        if isinstance(node, ComparisonNode):
            return self.evaluator.evaluate_comparison(node, event)
        
        elif isinstance(node, StringOpNode):
            return self.evaluator.evaluate_string_op(node, event)
        
        elif isinstance(node, RegexNode):
            return self.evaluator.evaluate_regex(node, event)
        
        elif isinstance(node, InOpNode):
            return self.evaluator.evaluate_in_op(node, event)
        
        elif isinstance(node, LogicalNode):
            if node.operator == 'AND':
                return all(self._evaluate_node(child, event, building_blocks) for child in node.children)
            elif node.operator == 'OR':
                return any(self._evaluate_node(child, event, building_blocks) for child in node.children)
            elif node.operator == 'NOT':
                return not self._evaluate_node(node.children[0], event, building_blocks)
        
        elif isinstance(node, BuildingBlockRefNode):
            if node.bb_id in building_blocks:
                return self._evaluate_node(building_blocks[node.bb_id], event, {})
            return False
        
        elif isinstance(node, AggregationNode):
            # Aggregations are handled at rule level, not event level
            return True
        
        return False
    
    def _find_nodes_by_type(
        self,
        node: ASTNode,
        node_types
    ) -> Tuple[bool, List[ASTNode]]:
        """Find all nodes of specific type(s)"""
        if not isinstance(node_types, list):
            node_types = [node_types]
        
        found_nodes = []
        
        def traverse(n):
            if n.type in node_types:
                found_nodes.append(n)
            
            if isinstance(n, LogicalNode):
                for child in n.children:
                    traverse(child)
        
        traverse(node)
        return len(found_nodes) > 0, found_nodes
    
    def _compare_values(self, value1: Any, operator: str, value2: Any) -> bool:
        """Compare two values with operator"""
        try:
            if operator == '=':
                return value1 == value2
            elif operator == '!=':
                return value1 != value2
            elif operator == '<':
                return value1 < value2
            elif operator == '<=':
                return value1 <= value2
            elif operator == '>':
                return value1 > value2
            elif operator == '>=':
                return value1 >= value2
        except:
            return False
        
        return False


# Create global rule engine instance
rule_engine = RuleEngine()


def evaluate_rule(
    rule_ast: ASTNode,
    events: List[Dict[str, Any]],
    building_blocks: Optional[Dict[str, ASTNode]] = None
) -> Dict[str, Any]:
    """
    Convenience function to evaluate rule
    
    Args:
        rule_ast: Rule AST root node
        events: List of event dictionaries
        building_blocks: Dict of Building Block ASTs
        
    Returns:
        Test result dictionary
    """
    return rule_engine.evaluate_rule(rule_ast, events, building_blocks)
