"""
Test API routes for rule testing
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict

from app.models.schemas import TestRequest, TestResult, ValidateSyntaxRequest, ValidateSyntaxResponse
from app.models.db_models import User
from app.api.routes.auth import get_current_user
from app.core.parser import parse_aql, parse_aql_to_dict
from app.core.engine.rule_engine import evaluate_rule

router = APIRouter()


@router.post("/validate-syntax", response_model=ValidateSyntaxResponse)
async def validate_syntax(request: ValidateSyntaxRequest, current_user: User = Depends(get_current_user)):
    """Validate AQL syntax"""
    try:
        ast_dict = parse_aql_to_dict(request.aql)
        return ValidateSyntaxResponse(valid=True, ast=ast_dict)
    except SyntaxError as e:
        return ValidateSyntaxResponse(valid=False, error=str(e))
    except Exception as e:
        return ValidateSyntaxResponse(valid=False, error=f"Unexpected error: {str(e)}")


@router.post("/test-rule", response_model=TestResult)
async def test_rule(request: TestRequest, current_user: User = Depends(get_current_user)):
    """Test a rule against events"""
    try:
        # Parse rule AQL
        rule_ast = parse_aql(request.rule.aql)
        
        # Parse Building Block AQLs
        building_blocks_ast = {}
        if request.building_blocks:
            for bb in request.building_blocks:
                try:
                    bb_ast = parse_aql(bb.aql)
                    building_blocks_ast[bb.id] = bb_ast
                except SyntaxError as e:
                    return TestResult(
                        alert=False,
                        rule_name=request.rule.name,
                        matched_events=[],
                        evaluation_phases={
                            "building_block": "failed",
                            "normal_logic": "not_applicable",
                            "regex": "not_applicable",
                            "aql": "not_applicable"
                        },
                        error=f"Building Block {bb.id} syntax error: {str(e)}"
                    )
        
        # Convert events to dict
        events = [event.dict() for event in request.events]
        
        # Evaluate rule
        result = evaluate_rule(rule_ast, events, building_blocks_ast)
        
        # Add rule name
        result["rule_name"] = request.rule.name
        if request.rule.id:
            result["rule_id"] = request.rule.id
        
        return TestResult(**result)
        
    except SyntaxError as e:
        return TestResult(
            alert=False,
            rule_name=request.rule.name,
            matched_events=[],
            evaluation_phases={
                "building_block": "not_applicable",
                "normal_logic": "failed",
                "regex": "not_applicable",
                "aql": "not_applicable"
            },
            error=f"Rule syntax error: {str(e)}"
        )
    except Exception as e:
        return TestResult(
            alert=False,
            rule_name=request.rule.name,
            matched_events=[],
            evaluation_phases={
                "building_block": "not_applicable",
                "normal_logic": "not_applicable",
                "regex": "not_applicable",
                "aql": "not_applicable"
            },
            error=f"Evaluation error: {str(e)}"
        )
