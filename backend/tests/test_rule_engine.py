"""
Test Rule Engine with Priority Validation
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.parser import parse_aql
from app.core.engine.rule_engine import evaluate_rule


def test_simple_rule():
    """Test simple rule without Building Blocks"""
    print("Test 1: Simple rule (sourceIP = '192.168.1.1')")
    
    aql = "sourceIP = '192.168.1.1'"
    ast = parse_aql(aql)
    
    events = [
        {"eventId": "1", "sourceIP": "192.168.1.1", "eventName": "Login"},
        {"eventId": "2", "sourceIP": "10.0.0.1", "eventName": "Login"},
    ]
    
    result = evaluate_rule(ast, events)
    
    assert result['alert'] == True
    assert len(result['matched_events']) == 1
    assert result['evaluation_phases']['normal_logic'] == 'passed'
    print("  ✓ Simple rule test passed\n")


def test_building_block_priority():
    """Test Building Block priority (must pass first)"""
    print("Test 2: Building Block priority")
    
    # Building Block: failed login
    bb_aql = "eventName = 'Authentication Failed'"
    bb_ast = parse_aql(bb_aql)
    
    # Rule: when BB_FailedLogin AND sourceIP = '192.168.1.1'
    rule_aql = "when BB_FailedLogin AND sourceIP = '192.168.1.1'"
    rule_ast = parse_aql(rule_aql)
    
    # Events: sourceIP matches but eventName doesn't (BB should fail)
    events = [
        {"eventId": "1", "sourceIP": "192.168.1.1", "eventName": "Login Success"},
    ]
    
    building_blocks = {"BB_FailedLogin": bb_ast}
    result = evaluate_rule(rule_ast, events, building_blocks)
    
    assert result['alert'] == False
    assert result['evaluation_phases']['building_block'] == 'failed'
    assert 'Building Block' in result['error']
    print("  ✓ Building Block priority test passed (failed as expected)\n")


def test_aggregation_with_time_window():
    """Test aggregation with time window"""
    print("Test 3: Aggregation with time window")
    
    aql = "COUNT(eventId) >= 3 within 10 minutes"
    ast = parse_aql(aql)
    
    # 5 events within 10 minutes
    events = [
        {"eventId": "1", "timestamp": "2026-02-12T10:00:00Z", "eventName": "Login"},
        {"eventId": "2", "timestamp": "2026-02-12T10:02:00Z", "eventName": "Login"},
        {"eventId": "3", "timestamp": "2026-02-12T10:05:00Z", "eventName": "Login"},
        {"eventId": "4", "timestamp": "2026-02-12T10:08:00Z", "eventName": "Login"},
        {"eventId": "5", "timestamp": "2026-02-12T10:09:00Z", "eventName": "Login"},
    ]
    
    result = evaluate_rule(ast, events)
    
    assert result['alert'] == True
    assert result['evaluation_phases']['aql'] == 'passed'
    assert 'COUNT(eventId)' in result['trigger_details']
    print(f"  ✓ Aggregation test passed: {result['trigger_details']}\n")


def test_complex_rule_all_phases():
    """Test complex rule with Building Block and aggregation"""
    print("Test 4: Complex rule with Building Block and aggregation")
    
    # Building Block
    bb_aql = "eventCategory = 'Authentication'"
    bb_ast = parse_aql(bb_aql)
    
    # Rule: when BB + aggregation
    rule_aql = "when BB_Auth AND COUNT(eventId) >= 3 within 5 minutes"
    rule_ast = parse_aql(rule_aql)
    
    events = [
        {"eventId": "1", "timestamp": "2026-02-12T10:00:00Z", "eventCategory": "Authentication"},
        {"eventId": "2", "timestamp": "2026-02-12T10:01:00Z", "eventCategory": "Authentication"},
        {"eventId": "3", "timestamp": "2026-02-12T10:02:00Z", "eventCategory": "Authentication"},
        {"eventId": "4", "timestamp": "2026-02-12T10:03:00Z", "eventCategory": "Authentication"},
    ]
    
    building_blocks = {"BB_Auth": bb_ast}
    result = evaluate_rule(rule_ast, events, building_blocks)
    
    assert result['alert'] == True
    assert result['evaluation_phases']['building_block'] == 'passed'
    assert result['evaluation_phases']['aql'] == 'passed'
    print(f"  ✓ Complex rule test passed")
    print(f"    Phases: {result['evaluation_phases']}")
    print(f"    Details: {result['trigger_details']}\n")


def test_priority_order_enforcement():
    """Test that priority order is enforced (BB fails → rule fails)"""
    print("Test 5: Priority order enforcement")
    
    # Building Block that will fail
    bb_aql = "eventCategory = 'NonExistent'"
    bb_ast = parse_aql(bb_aql)
    
    # Rule with valid aggregation (but BB should fail first)
    rule_aql = "when BB_Test AND COUNT(eventId) >= 1"
    rule_ast = parse_aql(rule_aql)
    
    events = [
        {"eventId": "1", "eventCategory": "Authentication", "eventName": "Login"},
        {"eventId": "2", "eventCategory": "Authentication", "eventName": "Login"},
    ]
    
    building_blocks = {"BB_Test": bb_ast}
    result = evaluate_rule(rule_ast, events, building_blocks)
    
    assert result['alert'] == False
    assert result['evaluation_phases']['building_block'] == 'failed'
    # AQL should not be evaluated if BB fails
    assert result['evaluation_phases']['aql'] == 'not_applicable'
    print("  ✓ Priority order enforcement test passed (BB failed, AQL not evaluated)\n")


if __name__ == "__main__":
    print("=" * 60)
    print("Running Rule Engine Tests with Priority Validation")
    print("=" * 60)
    print()
    
    try:
        test_simple_rule()
        test_building_block_priority()
        test_aggregation_with_time_window()
        test_complex_rule_all_phases()
        test_priority_order_enforcement()
        
        print("=" * 60)
        print("All Rule Engine tests passed! ✓")
        print("=" * 60)
    except AssertionError as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
