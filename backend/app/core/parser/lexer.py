"""
AQL Lexer - Tokenizer for QRadar AQL syntax
"""
import ply.lex as lex


class AQLLexer:
    """Lexer for AQL (Ariel Query Language)"""
    
    # Reserved keywords
    reserved = {
        'AND': 'AND',
        'OR': 'OR',
        'NOT': 'NOT',
        'IN': 'IN',
        'WHEN': 'WHEN',
        'WITHIN': 'WITHIN',
        'GROUP': 'GROUP',
        'BY': 'BY',
        'COUNT': 'COUNT',
        'SUM': 'SUM',
        'AVG': 'AVG',
        'MIN': 'MIN',
        'MAX': 'MAX',
        'CONTAINS': 'CONTAINS',
        'STARTSWITH': 'STARTSWITH',
        'ENDSWITH': 'ENDSWITH',
        'MATCHES': 'MATCHES',
        'FIRST': 'FIRST',
        'LAST': 'LAST',
        'LOWER': 'LOWER',
        'UPPER': 'UPPER',
        'SUBSTRING': 'SUBSTRING',
    }
    
    # Token list
    tokens = [
        'IDENTIFIER',
        'STRING',
        'NUMBER',
        'LPAREN',
        'RPAREN',
        'COMMA',
        'EQ',
        'NE',
        'LT',
        'LE',
        'GT',
        'GE',
    ] + list(reserved.values())
    
    # Token rules
    t_LPAREN = r'\('
    t_RPAREN = r'\)'
    t_COMMA = r','
    t_EQ = r'='
    t_NE = r'!='
    t_LE = r'<='
    t_GE = r'>='
    t_LT = r'<'
    t_GT = r'>'
    
    # Ignored characters (whitespace)
    t_ignore = ' \t\r\n'
    
    def t_STRING(self, t):
        r"'([^'\\\\]|\\\\.)*'"
        # Remove quotes
        t.value = t.value[1:-1]
        # Unescape special characters
        t.value = t.value.replace("\\'", "'").replace("\\\\", "\\")
        return t
    
    def t_NUMBER(self, t):
        r'\d+(\.\d+)?'
        # Convert to int or float
        if '.' in t.value:
            t.value = float(t.value)
        else:
            t.value = int(t.value)
        return t
    
    def t_IDENTIFIER(self, t):
        r'[a-zA-Z_][a-zA-Z0-9_]*'
        # Check if it's a reserved keyword
        t.type = self.reserved.get(t.value.upper(), 'IDENTIFIER')
        # Keep original case for identifiers, uppercase for keywords
        if t.type != 'IDENTIFIER':
            t.value = t.value.upper()
        return t
    
    def t_error(self, t):
        """Error handling"""
        raise SyntaxError(f"Illegal character '{t.value[0]}' at position {t.lexpos}")
    
    def __init__(self):
        self.lexer = lex.lex(module=self)
    
    def tokenize(self, data):
        """Tokenize input string"""
        self.lexer.input(data)
        tokens = []
        while True:
            tok = self.lexer.token()
            if not tok:
                break
            tokens.append(tok)
        return tokens


# Create global lexer instance
lexer = AQLLexer()


def tokenize(text: str):
    """Convenience function to tokenize AQL text"""
    return lexer.tokenize(text)
