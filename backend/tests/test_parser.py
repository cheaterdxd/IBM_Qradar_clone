"""
Test AQL Parser
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.parser import parse_aql_to_dict


def test_simple_comparison():
    """Test simple field comparison"""
    aql = "sourceIP = '192.168.1.1'"
    ast = parse_aql_to_dict(aql)
    assert ast['type'] == 'comparison'
    assert ast['field'] == 'sourceIP'
    assert ast['operator'] == '='
    assert ast['value'] == '192.168.1.1'
    print("✓ Simple comparison test passed")


def test_logical_and():
    """Test AND operator"""
    aql = "sourceIP = '192.168.1.1' AND eventName = 'Login'"
    ast = parse_aql_to_dict(aql)
    assert ast['type'] == 'AND'
    assert len(ast['children']) == 2
    print("✓ Logical AND test passed")


def test_string_operations():
    """Test string operations"""
    aql = "eventName CONTAINS 'Failed'"
    ast = parse_aql_to_dict(aql)
    assert ast['type'] == 'string_op'
    assert ast['operator'] == 'CONTAINS'
    print("✓ String operations test passed")


def test_in_operator():
    """Test IN operator"""
    aql = "eventCategory IN ('Authentication', 'Access')"
    ast = parse_aql_to_dict(aql)
    assert ast['type'] == 'in_op'
    assert ast['operator'] == 'IN'
    assert len(ast['value']) == 2
    print("✓ IN operator test passed")


def test_building_block():
    """Test Building Block reference"""
    aql = "when BB_FailedLogin"
    ast = parse_aql_to_dict(aql)
    assert ast['type'] == 'building_block_ref'
    assert ast['bb_id'] == 'BB_FailedLogin'
    print("✓ Building Block test passed")


def test_aggregation():
    """Test aggregation function"""
    aql = "COUNT(eventId) >= 5"
    ast = parse_aql_to_dict(aql)
    assert ast['type'] == 'aggregation'
    assert ast['function'] == 'COUNT'
    assert ast['field'] == 'eventId'
    assert ast['operator'] == '>='
    assert ast['value'] == 5
    print("✓ Aggregation test passed")


def test_aggregation_with_time_window():
    """Test aggregation with time window"""
    aql = "COUNT(eventId) >= 5 within 10 minutes"
    ast = parse_aql_to_dict(aql)
    assert ast['type'] == 'aggregation'
    assert ast['time_window']['value'] == 10
    assert ast['time_window']['unit'] == 'minutes'
    print("✓ Aggregation with time window test passed")


def test_complex_query():
    """Test complex query with multiple conditions"""
    aql = "when BB_FailedLogin AND COUNT(eventId) >= 5 within 10 minutes"
    ast = parse_aql_to_dict(aql)
    assert ast['type'] == 'AND'
    assert len(ast['children']) == 2
    assert ast['children'][0]['type'] == 'building_block_ref'
    assert ast['children'][1]['type'] == 'aggregation'
    print("✓ Complex query test passed")


if __name__ == "__main__":
    print("Running AQL Parser Tests...")
    print()
    
    try:
        test_simple_comparison()
        test_logical_and()
        test_string_operations()
        test_in_operator()
        test_building_block()
        test_aggregation()
        test_aggregation_with_time_window()
        test_complex_query()
        
        print()
        print("=" * 50)
        print("All tests passed! ✓")
        print("=" * 50)
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
