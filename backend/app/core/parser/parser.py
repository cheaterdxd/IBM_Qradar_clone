"""
AQL Parser - Generates AST from tokens
"""
import ply.yacc as yacc
from app.core.parser.lexer import AQLLexer
from app.core.parser.ast_nodes import (
    ComparisonNode, LogicalNode, AggregationNode,
    BuildingBlockRefNode, RegexNode, StringOpNode, InOpNode
)


class AQLParser:
    """Parser for AQL (Ariel Query Language)"""
    
    tokens = AQLLexer.tokens
    
    # Operator precedence
    precedence = (
        ('left', 'OR'),
        ('left', 'AND'),
        ('right', 'NOT'),
    )
    
    def __init__(self):
        self.lexer = AQLLexer()
        self.parser = yacc.yacc(module=self, debug=False, write_tables=False)
    
    # Grammar rules
    
    def p_expression(self, p):
        """expression : condition"""
        p[0] = p[1]
    
    def p_condition_logical_and(self, p):
        """condition : condition AND condition"""
        # Flatten nested AND nodes
        if isinstance(p[1], LogicalNode) and p[1].operator == 'AND':
            children = p[1].children + [p[3]]
        else:
            children = [p[1], p[3]]
        p[0] = LogicalNode('AND', children)
    
    def p_condition_logical_or(self, p):
        """condition : condition OR condition"""
        # Flatten nested OR nodes
        if isinstance(p[1], LogicalNode) and p[1].operator == 'OR':
            children = p[1].children + [p[3]]
        else:
            children = [p[1], p[3]]
        p[0] = LogicalNode('OR', children)
    
    def p_condition_logical_not(self, p):
        """condition : NOT condition"""
        p[0] = LogicalNode('NOT', [p[2]])
    
    def p_condition_paren(self, p):
        """condition : LPAREN condition RPAREN"""
        p[0] = p[2]
    
    def p_condition_comparison(self, p):
        """condition : IDENTIFIER EQ value
                    | IDENTIFIER NE value
                    | IDENTIFIER LT value
                    | IDENTIFIER LE value
                    | IDENTIFIER GT value
                    | IDENTIFIER GE value"""
        p[0] = ComparisonNode(p[1], p[2], p[3])
    
    def p_condition_string_op(self, p):
        """condition : IDENTIFIER CONTAINS STRING
                    | IDENTIFIER STARTSWITH STRING
                    | IDENTIFIER ENDSWITH STRING"""
        p[0] = StringOpNode(p[1], p[2], p[3])
    
    def p_condition_regex(self, p):
        """condition : IDENTIFIER MATCHES STRING"""
        p[0] = RegexNode(p[1], p[3])
    
    def p_condition_in(self, p):
        """condition : IDENTIFIER IN LPAREN value_list RPAREN
                    | IDENTIFIER NOT IN LPAREN value_list RPAREN"""
        if len(p) == 6:
            # IN operator
            p[0] = InOpNode(p[1], p[4], negated=False)
        else:
            # NOT IN operator
            p[0] = InOpNode(p[1], p[5], negated=True)
    
    def p_condition_building_block(self, p):
        """condition : WHEN IDENTIFIER"""
        p[0] = BuildingBlockRefNode(p[2])
    
    def p_condition_aggregation(self, p):
        """condition : agg_function LPAREN IDENTIFIER RPAREN comparison_op value
                    | agg_function LPAREN IDENTIFIER RPAREN comparison_op value WITHIN time_window
                    | agg_function LPAREN IDENTIFIER RPAREN comparison_op value WITHIN time_window GROUP BY IDENTIFIER"""
        function = p[1]
        field = p[3]
        operator = p[5]
        value = p[6]
        
        time_window = None
        group_by = None
        
        if len(p) >= 9:
            # Has time window
            time_window = p[8]
        
        if len(p) == 12:
            # Has GROUP BY
            group_by = p[11]
        
        p[0] = AggregationNode(function, field, operator, value, time_window, group_by)
    
    def p_agg_function(self, p):
        """agg_function : COUNT
                       | SUM
                       | AVG
                       | MIN
                       | MAX"""
        p[0] = p[1]
    
    def p_comparison_op(self, p):
        """comparison_op : EQ
                        | NE
                        | LT
                        | LE
                        | GT
                        | GE"""
        p[0] = p[1]
    
    def p_time_window(self, p):
        """time_window : NUMBER IDENTIFIER"""
        # e.g., "10 minutes", "1 hour"
        p[0] = {"value": p[1], "unit": p[2]}
    
    def p_value(self, p):
        """value : STRING
                | NUMBER
                | IDENTIFIER"""
        p[0] = p[1]
    
    def p_value_list(self, p):
        """value_list : value
                     | value_list COMMA value"""
        if len(p) == 2:
            p[0] = [p[1]]
        else:
            p[0] = p[1] + [p[3]]
    
    def p_error(self, p):
        if p:
            raise SyntaxError(f"Syntax error at token {p.type} ('{p.value}') at position {p.lexpos}")
        else:
            raise SyntaxError("Syntax error at EOF")
    
    def parse(self, text: str):
        """Parse AQL text and return AST"""
        try:
            result = self.parser.parse(text, lexer=self.lexer.lexer)
            return result
        except Exception as e:
            raise SyntaxError(f"Parse error: {str(e)}")


# Create global parser instance
parser = AQLParser()


def parse_aql(text: str):
    """
    Parse AQL text and return AST
    
    Args:
        text: AQL query string
        
    Returns:
        AST root node
        
    Raises:
        SyntaxError: If parsing fails
    """
    return parser.parse(text)


def parse_aql_to_dict(text: str):
    """
    Parse AQL text and return AST as dictionary
    
    Args:
        text: AQL query string
        
    Returns:
        Dictionary representation of AST
        
    Raises:
        SyntaxError: If parsing fails
    """
    ast = parse_aql(text)
    if ast:
        return ast.to_dict()
    return None
