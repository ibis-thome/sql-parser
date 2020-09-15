/*!
 * SQLParser (v1.3.1)
 * @copyright 2012-2015 Andy Kent <andy@forward.co.uk>
 * @copyright 2015-2020 Damien "Mistic" Sorel <contact@git.strangeplanet.fr>
 * @licence MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SQLParser = {}));
}(this, (function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var SQL_FUNCTIONS = ['AVG', 'COUNT', 'MIN', 'MAX', 'SUM', 'HASH_SHA256', 'TO_BINARY', 'UPPER', 'LOWER'];
	var SQL_SORT_ORDERS = ['ASC', 'DESC'];
	var SQL_OPERATORS = ['=', '!=', '>=', '>', '<=', '<>', '<', 'LIKE', 'NOT LIKE', 'ILIKE', 'NOT ILIKE', 'IS NOT', 'IS', 'REGEXP', 'NOT REGEXP'];
	var SUB_SELECT_OP = ['IN', 'NOT IN', 'ANY', 'ALL', 'SOME'];
	var SUB_SELECT_UNARY_OP = ['EXISTS'];
	var SQL_CONDITIONALS = ['AND', 'OR'];
	var SQL_BETWEENS = ['BETWEEN', 'NOT BETWEEN'];
	var BOOLEAN = ['TRUE', 'FALSE', 'NULL'];
	var MATH = ['+', '-', '||', '&&'];
	var MATH_MULTI = ['/', '*'];
	var STAR = /^\*/;
	var SEPARATOR = /^,/;
	var WHITESPACE = /^[ \n\r]+/;
	var LITERAL = /^`?([a-z_][a-z0-9_]{0,}(\:(number|float|string|date|boolean))?)`?/i;
	var PARAMETER = /^\$([a-z0-9_]+(\:(number|float|string|date|boolean))?)/;
	var NUMBER = /^[+-]?[0-9]+(\.[0-9]+)?/;
	var STRING = /^'((?:[^\\']+?|\\.|'')*)'(?!')/;
	var DBLSTRING = /^"([^\\"]*(?:\\.[^\\"]*)*)"/;
	var WITH_PRIMARY_KEY = /^WITH PRIMARY KEY/i;
	var FIELD_FUNCTIONS = ["CURRENT_UTCTIMESTAMP"];
	var PLACEHOLDER = "?";

	var Lexer = /*#__PURE__*/function () {
	  function Lexer(sql, opts) {
	    if (opts === void 0) {
	      opts = {};
	    }

	    this.sql = sql;
	    this.preserveWhitespace = opts.preserveWhitespace || false;
	    this.tokens = [];
	    this.currentLine = 1;
	    this.currentOffset = 0;
	    var i = 0;

	    while (!!(this.chunk = sql.slice(i))) {
	      var bytesConsumed = this.keywordToken() || this.starToken() || this.booleanToken() || this.functionToken() || this.windowExtension() || this.sortOrderToken() || this.seperatorToken() || this.operatorToken() || this.numberToken() || this.mathToken() || this.dotToken() || this.conditionalToken() || this.betweenToken() || this.subSelectOpToken() || this.subSelectUnaryOpToken() || this.stringToken() || this.parameterToken() || this.parensToken() || this.whitespaceToken() || this.primaryKeyToken() || this.fieldFunctionToken() || this.placeholderToken() || this.literalToken();

	      if (bytesConsumed < 1) {
	        throw new Error("NOTHING CONSUMED: Stopped at - '" + this.chunk.slice(0, 30) + "'");
	      }

	      i += bytesConsumed;
	      this.currentOffset += bytesConsumed;
	    }

	    this.token('EOF', '');
	    this.postProcess();
	  }

	  var _proto = Lexer.prototype;

	  _proto.postProcess = function postProcess() {
	    var results = [];

	    for (var _i = 0, j = 0, len = this.tokens.length; j < len; _i = ++j) {
	      var token = this.tokens[_i];

	      if (token[0] === 'STAR') {
	        var next_token = this.tokens[_i + 1];

	        if (!(next_token[0] === 'SEPARATOR' || next_token[0] === 'FROM')) {
	          results.push(token[0] = 'MATH_MULTI');
	        } else {
	          results.push(void 0);
	        }
	      } else {
	        results.push(void 0);
	      }
	    }

	    return results;
	  };

	  _proto.token = function token(name, value) {
	    return this.tokens.push([name, value, this.currentLine, this.currentOffset]);
	  };

	  _proto.tokenizeFromStringRegex = function tokenizeFromStringRegex(name, regex, part, lengthPart, output) {
	    if (part === void 0) {
	      part = 0;
	    }

	    if (lengthPart === void 0) {
	      lengthPart = part;
	    }

	    if (output === void 0) {
	      output = true;
	    }

	    var match = regex.exec(this.chunk);

	    if (!match) {
	      return 0;
	    }

	    var partMatch = match[part].replace(/''/g, '\'');

	    if (output) {
	      this.token(name, partMatch);
	    }

	    return match[lengthPart].length;
	  };

	  _proto.tokenizeFromRegex = function tokenizeFromRegex(name, regex, part, lengthPart, output) {
	    if (part === void 0) {
	      part = 0;
	    }

	    if (lengthPart === void 0) {
	      lengthPart = part;
	    }

	    if (output === void 0) {
	      output = true;
	    }

	    var match = regex.exec(this.chunk);

	    if (!match) {
	      return 0;
	    }

	    var partMatch = match[part];

	    if (output) {
	      this.token(name, partMatch);
	    }

	    return match[lengthPart].length;
	  };

	  _proto.tokenizeFromWord = function tokenizeFromWord(name, word) {
	    if (word === void 0) {
	      word = name;
	    }

	    word = this.regexEscape(word);
	    var matcher = /^\w+$/.test(word) ? new RegExp("^(" + word + ")\\b", 'ig') : new RegExp("^(" + word + ")", 'ig');
	    var match = matcher.exec(this.chunk);

	    if (!match) {
	      return 0;
	    }

	    this.token(name, match[1]);
	    return match[1].length;
	  };

	  _proto.tokenizeFromList = function tokenizeFromList(name, list) {
	    var ret = 0;

	    for (var j = 0, len = list.length; j < len; j++) {
	      var entry = list[j];
	      ret = this.tokenizeFromWord(name, entry);

	      if (ret > 0) {
	        break;
	      }
	    }

	    return ret;
	  };

	  _proto.keywordToken = function keywordToken() {
	    return this.tokenizeFromWord('SELECT') || this.tokenizeFromWord('DELETE') || this.tokenizeFromWord('UPDATE') || this.tokenizeFromWord('UPSERT') || this.tokenizeFromWord('INSERT') || this.tokenizeFromWord('INTO') || this.tokenizeFromWord('DEFAULT') || this.tokenizeFromWord('VALUES') || this.tokenizeFromWord('DISTINCT') || this.tokenizeFromWord('FROM') || this.tokenizeFromWord('WHERE') || this.tokenizeFromWord('GROUP') || this.tokenizeFromWord('ORDER') || this.tokenizeFromWord('BY') || this.tokenizeFromWord('HAVING') || this.tokenizeFromWord('LIMIT') || this.tokenizeFromWord('JOIN') || this.tokenizeFromWord('LEFT') || this.tokenizeFromWord('RIGHT') || this.tokenizeFromWord('INNER') || this.tokenizeFromWord('OUTER') || this.tokenizeFromWord('ON') || this.tokenizeFromWord('AS') || this.tokenizeFromWord('CASE') || this.tokenizeFromWord('WHEN') || this.tokenizeFromWord('THEN') || this.tokenizeFromWord('ELSE') || this.tokenizeFromWord('END') || this.tokenizeFromWord('UNION') || this.tokenizeFromWord('ALL') || this.tokenizeFromWord('LIMIT') || this.tokenizeFromWord('OFFSET') || this.tokenizeFromWord('FETCH') || this.tokenizeFromWord('ROW') || this.tokenizeFromWord('ROWS') || this.tokenizeFromWord('ONLY') || this.tokenizeFromWord('NEXT') || this.tokenizeFromWord('FIRST');
	  };

	  _proto.dotToken = function dotToken() {
	    return this.tokenizeFromWord('DOT', '.');
	  };

	  _proto.operatorToken = function operatorToken() {
	    return this.tokenizeFromList('OPERATOR', SQL_OPERATORS);
	  };

	  _proto.mathToken = function mathToken() {
	    return this.tokenizeFromList('MATH', MATH) || this.tokenizeFromList('MATH_MULTI', MATH_MULTI);
	  };

	  _proto.conditionalToken = function conditionalToken() {
	    return this.tokenizeFromList('CONDITIONAL', SQL_CONDITIONALS);
	  };

	  _proto.betweenToken = function betweenToken() {
	    return this.tokenizeFromList('BETWEEN', SQL_BETWEENS);
	  };

	  _proto.subSelectOpToken = function subSelectOpToken() {
	    return this.tokenizeFromList('SUB_SELECT_OP', SUB_SELECT_OP);
	  };

	  _proto.subSelectUnaryOpToken = function subSelectUnaryOpToken() {
	    return this.tokenizeFromList('SUB_SELECT_UNARY_OP', SUB_SELECT_UNARY_OP);
	  };

	  _proto.functionToken = function functionToken() {
	    return this.tokenizeFromList('FUNCTION', SQL_FUNCTIONS);
	  };

	  _proto.sortOrderToken = function sortOrderToken() {
	    return this.tokenizeFromList('DIRECTION', SQL_SORT_ORDERS);
	  };

	  _proto.booleanToken = function booleanToken() {
	    return this.tokenizeFromList('BOOLEAN', BOOLEAN);
	  };

	  _proto.starToken = function starToken() {
	    return this.tokenizeFromRegex('STAR', STAR);
	  };

	  _proto.seperatorToken = function seperatorToken() {
	    return this.tokenizeFromRegex('SEPARATOR', SEPARATOR);
	  };

	  _proto.literalToken = function literalToken() {
	    return this.tokenizeFromRegex('LITERAL', LITERAL, 1, 0);
	  };

	  _proto.numberToken = function numberToken() {
	    return this.tokenizeFromRegex('NUMBER', NUMBER);
	  };

	  _proto.parameterToken = function parameterToken() {
	    return this.tokenizeFromRegex('PARAMETER', PARAMETER, 1, 0);
	  };

	  _proto.stringToken = function stringToken() {
	    return this.tokenizeFromStringRegex('STRING', STRING, 1, 0) || this.tokenizeFromRegex('DBLSTRING', DBLSTRING, 1, 0);
	  };

	  _proto.parensToken = function parensToken() {
	    return this.tokenizeFromRegex('LEFT_PAREN', /^\(/) || this.tokenizeFromRegex('RIGHT_PAREN', /^\)/);
	  };

	  _proto.primaryKeyToken = function primaryKeyToken() {
	    return this.tokenizeFromRegex("WITH_PRIMARY_KEY", WITH_PRIMARY_KEY);
	  };

	  _proto.fieldFunctionToken = function fieldFunctionToken() {
	    return this.tokenizeFromList("FIELD_FUNCTION", FIELD_FUNCTIONS);
	  };

	  _proto.placeholderToken = function placeholderToken() {
	    return this.tokenizeFromWord("PLACEHOLDER", PLACEHOLDER);
	  };

	  _proto.windowExtension = function windowExtension() {
	    var match = /^\.(win):(length|time)/i.exec(this.chunk);

	    if (!match) {
	      return 0;
	    }

	    this.token('WINDOW', match[1]);
	    this.token('WINDOW_FUNCTION', match[2]);
	    return match[0].length;
	  };

	  _proto.whitespaceToken = function whitespaceToken() {
	    var match = WHITESPACE.exec(this.chunk);

	    if (!match) {
	      return 0;
	    }

	    var partMatch = match[0];

	    if (this.preserveWhitespace) {
	      this.token('WHITESPACE', partMatch);
	    }

	    var newlines = partMatch.match(/\n/g, '');
	    this.currentLine += (newlines != null ? newlines.length : void 0) || 0;
	    return partMatch.length;
	  };

	  _proto.regexEscape = function regexEscape(str) {
	    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	  };

	  return Lexer;
	}();

	var tokenize = function tokenize(sql, opts) {
	  return new Lexer(sql, opts).tokens;
	};

	var lexer = {
	  tokenize: tokenize
	};

	/* parser generated by jison 0.4.18 */

	/*
	  Returns a Parser object of the following structure:

	  Parser: {
	    yy: {}
	  }

	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),

	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),

	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },

	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }


	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }


	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var parser = function () {
	  var o = function o(k, v, _o, l) {
	    for (_o = _o || {}, l = k.length; l--; _o[k[l]] = v) {
	    }

	    return _o;
	  },
	      $V0 = [1, 15],
	      $V1 = [1, 14],
	      $V2 = [1, 17],
	      $V3 = [1, 13],
	      $V4 = [5, 23],
	      $V5 = [1, 23],
	      $V6 = [1, 22],
	      $V7 = [5, 23, 44, 55],
	      $V8 = [1, 25],
	      $V9 = [1, 29],
	      $Va = [1, 36],
	      $Vb = [1, 34],
	      $Vc = [1, 37],
	      $Vd = [5, 23, 44, 55, 58, 75],
	      $Ve = [1, 46],
	      $Vf = [1, 64],
	      $Vg = [1, 48],
	      $Vh = [1, 60],
	      $Vi = [1, 62],
	      $Vj = [1, 66],
	      $Vk = [1, 67],
	      $Vl = [1, 68],
	      $Vm = [1, 63],
	      $Vn = [1, 61],
	      $Vo = [1, 65],
	      $Vp = [1, 44],
	      $Vq = [1, 43],
	      $Vr = [5, 23, 44],
	      $Vs = [1, 74],
	      $Vt = [5, 23, 44, 55, 58],
	      $Vu = [5, 21, 23, 28, 44, 47, 48, 50, 51, 54, 55, 58, 75],
	      $Vv = [1, 86],
	      $Vw = [2, 110],
	      $Vx = [1, 93],
	      $Vy = [23, 32, 54, 56],
	      $Vz = [1, 96],
	      $VA = [1, 97],
	      $VB = [1, 98],
	      $VC = [1, 99],
	      $VD = [1, 100],
	      $VE = [5, 23, 32, 39, 44, 47, 50, 51, 54, 55, 56, 58, 75, 77, 78, 79, 80, 81, 83, 91, 94, 95, 96],
	      $VF = [5, 23, 32, 37, 39, 44, 47, 50, 51, 54, 55, 56, 57, 58, 64, 75, 77, 78, 79, 80, 81, 83, 84, 91, 94, 95, 96, 103, 104, 105, 106, 107, 109, 110, 112],
	      $VG = [1, 110],
	      $VH = [1, 130],
	      $VI = [5, 23, 44, 55, 56, 58, 77],
	      $VJ = [5, 23, 32, 37, 39, 44, 47, 50, 51, 54, 55, 56, 58, 75, 77, 78, 79, 80, 81, 83, 91, 94, 95, 96, 103, 104, 105, 106, 107, 109, 110, 112],
	      $VK = [91, 94, 96],
	      $VL = [1, 156],
	      $VM = [5, 23, 44, 55, 56, 57],
	      $VN = [5, 21, 23, 28, 32, 37, 39, 40, 44, 47, 48, 50, 51, 54, 55, 56, 57, 58, 64, 75, 77, 78, 79, 80, 81, 83, 84, 91, 94, 95, 96, 103, 104, 105, 106, 107, 108, 109, 110, 112],
	      $VO = [5, 23, 44, 54, 55, 58, 75],
	      $VP = [1, 172],
	      $VQ = [1, 173],
	      $VR = [1, 174],
	      $VS = [5, 23, 32, 39, 44, 47, 50, 51, 54, 55, 56, 58, 75, 77, 83, 91, 94, 95, 96],
	      $VT = [5, 23, 44, 47, 50, 51, 54, 55, 58, 75],
	      $VU = [5, 23, 44, 55, 69, 71];

	  var parser = {
	    trace: function trace() {},
	    yy: {},
	    symbols_: {
	      "error": 2,
	      "Root": 3,
	      "Query": 4,
	      "EOF": 5,
	      "SelectQuery": 6,
	      "Unions": 7,
	      "Delete": 8,
	      "Update": 9,
	      "Upsert": 10,
	      "SelectWithLimitQuery": 11,
	      "BasicSelectQuery": 12,
	      "Select": 13,
	      "OrderClause": 14,
	      "GroupClause": 15,
	      "LimitClause": 16,
	      "UpsertClause": 17,
	      "WITH_PRIMARY_KEY": 18,
	      "UPSERT": 19,
	      "Table": 20,
	      "LEFT_PAREN": 21,
	      "Fields": 22,
	      "RIGHT_PAREN": 23,
	      "VALUES": 24,
	      "List": 25,
	      "UpdateClause": 26,
	      "UPDATE": 27,
	      "SET": 28,
	      "WhereClause": 29,
	      "SelectClause": 30,
	      "SELECT": 31,
	      "FROM": 32,
	      "DISTINCT": 33,
	      "Joins": 34,
	      "DeleteClause": 35,
	      "DELETE": 36,
	      "DBLSTRING": 37,
	      "Literal": 38,
	      "AS": 39,
	      "WINDOW": 40,
	      "WINDOW_FUNCTION": 41,
	      "Number": 42,
	      "Union": 43,
	      "UNION": 44,
	      "ALL": 45,
	      "Join": 46,
	      "JOIN": 47,
	      "ON": 48,
	      "Expression": 49,
	      "LEFT": 50,
	      "RIGHT": 51,
	      "INNER": 52,
	      "OUTER": 53,
	      "WHERE": 54,
	      "LIMIT": 55,
	      "SEPARATOR": 56,
	      "OFFSET": 57,
	      "ORDER": 58,
	      "BY": 59,
	      "OrderArgs": 60,
	      "OffsetClause": 61,
	      "OrderArg": 62,
	      "Value": 63,
	      "DIRECTION": 64,
	      "OffsetRows": 65,
	      "FetchClause": 66,
	      "ROW": 67,
	      "ROWS": 68,
	      "FETCH": 69,
	      "FIRST": 70,
	      "ONLY": 71,
	      "NEXT": 72,
	      "GroupBasicClause": 73,
	      "HavingClause": 74,
	      "GROUP": 75,
	      "ArgumentList": 76,
	      "HAVING": 77,
	      "MATH": 78,
	      "MATH_MULTI": 79,
	      "OPERATOR": 80,
	      "BETWEEN": 81,
	      "BetweenExpression": 82,
	      "CONDITIONAL": 83,
	      "SUB_SELECT_OP": 84,
	      "SubSelectExpression": 85,
	      "SUB_SELECT_UNARY_OP": 86,
	      "WhitepaceList": 87,
	      "CaseStatement": 88,
	      "CASE": 89,
	      "CaseWhens": 90,
	      "END": 91,
	      "CaseElse": 92,
	      "CaseWhen": 93,
	      "WHEN": 94,
	      "THEN": 95,
	      "ELSE": 96,
	      "String": 97,
	      "Function": 98,
	      "UserFunction": 99,
	      "Boolean": 100,
	      "Parameter": 101,
	      "Placeholder": 102,
	      "NUMBER": 103,
	      "BOOLEAN": 104,
	      "PARAMETER": 105,
	      "PLACEHOLDER": 106,
	      "STRING": 107,
	      "DOT": 108,
	      "LITERAL": 109,
	      "FUNCTION": 110,
	      "AggregateArgumentList": 111,
	      "FIELD_FUNCTION": 112,
	      "Case": 113,
	      "Field": 114,
	      "STAR": 115,
	      "$accept": 0,
	      "$end": 1
	    },
	    terminals_: {
	      2: "error",
	      5: "EOF",
	      18: "WITH_PRIMARY_KEY",
	      19: "UPSERT",
	      21: "LEFT_PAREN",
	      23: "RIGHT_PAREN",
	      24: "VALUES",
	      27: "UPDATE",
	      28: "SET",
	      31: "SELECT",
	      32: "FROM",
	      33: "DISTINCT",
	      36: "DELETE",
	      37: "DBLSTRING",
	      39: "AS",
	      40: "WINDOW",
	      41: "WINDOW_FUNCTION",
	      44: "UNION",
	      45: "ALL",
	      47: "JOIN",
	      48: "ON",
	      50: "LEFT",
	      51: "RIGHT",
	      52: "INNER",
	      53: "OUTER",
	      54: "WHERE",
	      55: "LIMIT",
	      56: "SEPARATOR",
	      57: "OFFSET",
	      58: "ORDER",
	      59: "BY",
	      64: "DIRECTION",
	      67: "ROW",
	      68: "ROWS",
	      69: "FETCH",
	      70: "FIRST",
	      71: "ONLY",
	      72: "NEXT",
	      75: "GROUP",
	      77: "HAVING",
	      78: "MATH",
	      79: "MATH_MULTI",
	      80: "OPERATOR",
	      81: "BETWEEN",
	      83: "CONDITIONAL",
	      84: "SUB_SELECT_OP",
	      86: "SUB_SELECT_UNARY_OP",
	      89: "CASE",
	      91: "END",
	      94: "WHEN",
	      95: "THEN",
	      96: "ELSE",
	      103: "NUMBER",
	      104: "BOOLEAN",
	      105: "PARAMETER",
	      106: "PLACEHOLDER",
	      107: "STRING",
	      108: "DOT",
	      109: "LITERAL",
	      110: "FUNCTION",
	      112: "FIELD_FUNCTION",
	      113: "Case",
	      115: "STAR"
	    },
	    productions_: [0, [3, 2], [4, 1], [4, 2], [4, 1], [4, 1], [4, 1], [6, 1], [6, 1], [12, 1], [12, 2], [12, 2], [12, 3], [11, 2], [10, 1], [10, 2], [17, 9], [9, 1], [26, 5], [13, 1], [13, 2], [30, 4], [30, 5], [30, 5], [30, 6], [8, 1], [8, 2], [35, 3], [20, 1], [20, 2], [20, 1], [20, 2], [20, 3], [20, 3], [20, 3], [20, 4], [20, 6], [20, 3], [7, 1], [7, 2], [43, 2], [43, 3], [34, 1], [34, 2], [46, 4], [46, 5], [46, 5], [46, 6], [46, 6], [46, 6], [46, 6], [29, 2], [16, 2], [16, 4], [16, 4], [14, 3], [14, 4], [60, 1], [60, 3], [62, 1], [62, 2], [61, 2], [61, 3], [65, 2], [65, 2], [66, 4], [66, 4], [15, 1], [15, 2], [73, 3], [74, 2], [49, 3], [49, 3], [49, 3], [49, 3], [49, 3], [49, 3], [49, 5], [49, 3], [49, 2], [49, 1], [49, 1], [49, 1], [49, 1], [82, 3], [88, 3], [88, 4], [93, 4], [90, 2], [90, 1], [92, 2], [85, 3], [63, 1], [63, 1], [63, 1], [63, 1], [63, 1], [63, 1], [63, 1], [63, 1], [87, 2], [87, 2], [25, 1], [42, 1], [100, 1], [101, 1], [102, 1], [97, 1], [97, 1], [97, 3], [38, 1], [38, 3], [38, 3], [98, 4], [98, 1], [99, 3], [99, 4], [99, 4], [111, 1], [111, 2], [76, 1], [76, 3], [22, 1], [22, 3], [114, 1], [114, 1], [114, 1], [114, 3], [114, 3]],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate
	    /* action[1] */
	    , $$
	    /* vstack */
	    , _$
	    /* lstack */
	    ) {
	      /* this == yyval */
	      var $0 = $$.length - 1;

	      switch (yystate) {
	        case 1:
	          return this.$ = $$[$0 - 1];

	        case 2:
	        case 4:
	        case 5:
	        case 6:
	        case 7:
	        case 8:
	        case 9:
	        case 14:
	        case 17:
	        case 19:
	        case 25:
	        case 67:
	        case 80:
	        case 82:
	        case 83:
	        case 92:
	        case 93:
	        case 94:
	        case 95:
	        case 96:
	        case 97:
	        case 98:
	        case 99:
	          this.$ = $$[$0];
	          break;

	        case 3:
	          this.$ = function () {
	            $$[$0 - 1].unions = $$[$0];
	            return $$[$0 - 1];
	          }();

	          break;

	        case 10:
	          this.$ = function () {
	            $$[$0 - 1].order = $$[$0];
	            return $$[$0 - 1];
	          }();

	          break;

	        case 11:
	          this.$ = function () {
	            $$[$0 - 1].group = $$[$0];
	            return $$[$0 - 1];
	          }();

	          break;

	        case 12:
	          this.$ = function () {
	            $$[$0 - 2].group = $$[$0 - 1];
	            $$[$0 - 2].order = $$[$0];
	            return $$[$0 - 2];
	          }();

	          break;

	        case 13:
	          this.$ = function () {
	            $$[$0 - 1].limit = $$[$0];
	            return $$[$0 - 1];
	          }();

	          break;

	        case 15:
	          this.$ = function () {
	            $$[$0 - 1].extension = $$[$0];
	            return $$[$0 - 1];
	          }();

	          break;

	        case 16:
	          this.$ = new yy.Upsert($$[$0 - 7], $$[$0 - 5], $$[$0 - 1]);
	          break;

	        case 18:
	          this.$ = new yy.Update($$[$0 - 4], $$[$0 - 2], $$[$0 - 1]);
	          break;

	        case 20:
	        case 26:
	          this.$ = function () {
	            $$[$0 - 1].where = $$[$0];
	            return $$[$0 - 1];
	          }();

	          break;

	        case 21:
	          this.$ = new yy.Select($$[$0 - 2], $$[$0], false);
	          break;

	        case 22:
	          this.$ = new yy.Select($$[$0 - 2], $$[$0], true);
	          break;

	        case 23:
	          this.$ = new yy.Select($$[$0 - 3], $$[$0 - 1], false, $$[$0]);
	          break;

	        case 24:
	          this.$ = new yy.Select($$[$0 - 3], $$[$0 - 1], true, $$[$0]);
	          break;

	        case 27:
	          this.$ = new yy.Delete($$[$0], false);
	          break;

	        case 28:
	        case 30:
	          this.$ = new yy.Table($$[$0]);
	          break;

	        case 29:
	        case 37:
	          this.$ = new yy.Table($$[$0 - 1]);
	          break;

	        case 31:
	          this.$ = new yy.Table($$[$0 - 1], $$[$0]);
	          break;

	        case 32:
	          this.$ = new yy.Table($$[$0 - 2], $$[$0]);
	          break;

	        case 33:
	        case 63:
	        case 64:
	        case 65:
	        case 66:
	        case 71:
	          this.$ = $$[$0 - 1];
	          break;

	        case 34:
	        case 91:
	          this.$ = new yy.SubSelect($$[$0 - 1]);
	          break;

	        case 35:
	          this.$ = new yy.SubSelect($$[$0 - 2], $$[$0]);
	          break;

	        case 36:
	          this.$ = new yy.Table($$[$0 - 5], null, $$[$0 - 4], $$[$0 - 3], $$[$0 - 1]);
	          break;

	        case 38:
	        case 42:
	        case 57:
	        case 89:
	        case 120:
	        case 122:
	          this.$ = [$$[$0]];
	          break;

	        case 39:
	        case 43:
	        case 88:
	          this.$ = $$[$0 - 1].concat($$[$0]);
	          break;

	        case 40:
	          this.$ = new yy.Union($$[$0]);
	          break;

	        case 41:
	          this.$ = new yy.Union($$[$0], true);
	          break;

	        case 44:
	          this.$ = new yy.Join($$[$0 - 2], $$[$0]);
	          break;

	        case 45:
	          this.$ = new yy.Join($$[$0 - 2], $$[$0], 'LEFT');
	          break;

	        case 46:
	          this.$ = new yy.Join($$[$0 - 2], $$[$0], 'RIGHT');
	          break;

	        case 47:
	          this.$ = new yy.Join($$[$0 - 2], $$[$0], 'LEFT', 'INNER');
	          break;

	        case 48:
	          this.$ = new yy.Join($$[$0 - 2], $$[$0], 'RIGHT', 'INNER');
	          break;

	        case 49:
	          this.$ = new yy.Join($$[$0 - 2], $$[$0], 'LEFT', 'OUTER');
	          break;

	        case 50:
	          this.$ = new yy.Join($$[$0 - 2], $$[$0], 'RIGHT', 'OUTER');
	          break;

	        case 51:
	          this.$ = new yy.Where($$[$0]);
	          break;

	        case 52:
	          this.$ = new yy.Limit($$[$0]);
	          break;

	        case 53:
	          this.$ = new yy.Limit($$[$0], $$[$0 - 2]);
	          break;

	        case 54:
	          this.$ = new yy.Limit($$[$0 - 2], $$[$0]);
	          break;

	        case 55:
	          this.$ = new yy.Order($$[$0]);
	          break;

	        case 56:
	          this.$ = new yy.Order($$[$0 - 1], $$[$0]);
	          break;

	        case 58:
	        case 121:
	        case 123:
	          this.$ = $$[$0 - 2].concat($$[$0]);
	          break;

	        case 59:
	          this.$ = new yy.OrderArgument($$[$0], 'ASC');
	          break;

	        case 60:
	          this.$ = new yy.OrderArgument($$[$0 - 1], $$[$0]);
	          break;

	        case 61:
	          this.$ = new yy.Offset($$[$0]);
	          break;

	        case 62:
	          this.$ = new yy.Offset($$[$0 - 1], $$[$0]);
	          break;

	        case 68:
	          this.$ = function () {
	            $$[$0 - 1].having = $$[$0];
	            return $$[$0 - 1];
	          }();

	          break;

	        case 69:
	          this.$ = new yy.Group($$[$0]);
	          break;

	        case 70:
	          this.$ = new yy.Having($$[$0]);
	          break;

	        case 72:
	        case 73:
	        case 74:
	        case 75:
	        case 76:
	        case 78:
	          this.$ = new yy.Op($$[$0 - 1], $$[$0 - 2], $$[$0]);
	          break;

	        case 77:
	          this.$ = new yy.Op($$[$0 - 3], $$[$0 - 4], $$[$0 - 1]);
	          break;

	        case 79:
	          this.$ = new yy.UnaryOp($$[$0 - 1], $$[$0]);
	          break;

	        case 81:
	          this.$ = new yy.WhitepaceList($$[$0]);
	          break;

	        case 84:
	          this.$ = new yy.BetweenOp([$$[$0 - 2], $$[$0]]);
	          break;

	        case 85:
	          this.$ = new yy.Case($$[$0 - 1]);
	          break;

	        case 86:
	          this.$ = new yy.Case($$[$0 - 2], $$[$0 - 1]);
	          break;

	        case 87:
	          this.$ = new yy.CaseWhen($$[$0 - 2], $$[$0]);
	          break;

	        case 90:
	          this.$ = new yy.CaseElse($$[$0]);
	          break;

	        case 100:
	          this.$ = [$$[$0 - 1], $$[$0]];
	          break;

	        case 101:
	          this.$ = function () {
	            $$[$0 - 1].push($$[$0]);
	            return $$[$0 - 1];
	          }();

	          break;

	        case 102:
	          this.$ = new yy.ListValue($$[$0]);
	          break;

	        case 103:
	          this.$ = new yy.NumberValue($$[$0]);
	          break;

	        case 104:
	          this.$ = new yy.BooleanValue($$[$0]);
	          break;

	        case 105:
	          this.$ = new yy.ParameterValue($$[$0]);
	          break;

	        case 106:
	          this.$ = new yy.Placeholder($$[$0]);
	          break;

	        case 107:
	          this.$ = new yy.StringValue($$[$0], "'");
	          break;

	        case 108:
	          this.$ = new yy.StringValue($$[$0], '"');
	          break;

	        case 109:
	          this.$ = new yy.StringValue([$$[$0 - 2], $$[$0]], '"');
	          break;

	        case 110:
	          this.$ = new yy.LiteralValue($$[$0]);
	          break;

	        case 111:
	          this.$ = new yy.LiteralValue($$[$0 - 2], $$[$0]);
	          break;

	        case 112:
	          this.$ = new yy.LiteralValue($$[$0 - 2], $$[$0], true);
	          break;

	        case 113:
	          this.$ = new yy.FunctionValue($$[$0 - 3], $$[$0 - 1]);
	          break;

	        case 114:
	        case 125:
	        case 126:
	          this.$ = new yy.Field($$[$0]);
	          break;

	        case 115:
	          this.$ = new yy.FunctionValue($$[$0 - 2], null, true);
	          break;

	        case 116:
	        case 117:
	          this.$ = new yy.FunctionValue($$[$0 - 3], $$[$0 - 1], true);
	          break;

	        case 118:
	          this.$ = new yy.ArgumentListValue($$[$0]);
	          break;

	        case 119:
	          this.$ = new yy.ArgumentListValue($$[$0], true);
	          break;

	        case 124:
	          this.$ = new yy.Star();
	          break;

	        case 127:
	          this.$ = new yy.Field($$[$0 - 2], $$[$0]);
	          break;

	        case 128:
	          this.$ = new yy.Field($$[$0 - 2], $$[$0], true);
	          break;
	      }
	    },
	    table: [{
	      3: 1,
	      4: 2,
	      6: 3,
	      8: 4,
	      9: 5,
	      10: 6,
	      11: 7,
	      12: 8,
	      13: 12,
	      17: 11,
	      19: $V0,
	      26: 10,
	      27: $V1,
	      30: 16,
	      31: $V2,
	      35: 9,
	      36: $V3
	    }, {
	      1: [3]
	    }, {
	      5: [1, 18]
	    }, o($V4, [2, 2], {
	      7: 19,
	      16: 20,
	      43: 21,
	      44: $V5,
	      55: $V6
	    }), o($V4, [2, 4]), o($V4, [2, 5]), o($V4, [2, 6]), o($V7, [2, 7]), o($V7, [2, 8]), o($V4, [2, 25], {
	      29: 24,
	      54: $V8
	    }), o($V4, [2, 17]), o($V4, [2, 14], {
	      18: [1, 26]
	    }), o($V7, [2, 9], {
	      14: 27,
	      15: 28,
	      73: 30,
	      58: $V9,
	      75: [1, 31]
	    }), {
	      32: [1, 32]
	    }, {
	      20: 33,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      20: 38,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, o($Vd, [2, 19], {
	      29: 39,
	      54: $V8
	    }), {
	      21: $Ve,
	      22: 40,
	      33: [1, 41],
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 45,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vp,
	      114: 42,
	      115: $Vq
	    }, {
	      1: [2, 1]
	    }, o($V4, [2, 3], {
	      43: 69,
	      44: $V5
	    }), o($V7, [2, 13]), o($Vr, [2, 38]), {
	      42: 70,
	      103: $Vi
	    }, {
	      6: 71,
	      11: 7,
	      12: 8,
	      13: 12,
	      30: 16,
	      31: $V2,
	      45: [1, 72]
	    }, o($V4, [2, 26]), {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 73,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o($V4, [2, 15]), o($V7, [2, 10]), o($V7, [2, 11], {
	      14: 75,
	      58: $V9
	    }), {
	      59: [1, 76]
	    }, o($Vt, [2, 67], {
	      74: 77,
	      77: [1, 78]
	    }), {
	      59: [1, 79]
	    }, {
	      20: 80,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      28: [1, 81]
	    }, o($Vu, [2, 28], {
	      38: 82,
	      109: $Vc
	    }), o($Vu, [2, 30], {
	      38: 83,
	      39: [1, 84],
	      40: [1, 85],
	      108: $Vv,
	      109: $Vc
	    }), {
	      4: 88,
	      6: 3,
	      8: 4,
	      9: 5,
	      10: 6,
	      11: 7,
	      12: 8,
	      13: 12,
	      17: 11,
	      19: $V0,
	      21: $Ve,
	      25: 87,
	      26: 10,
	      27: $V1,
	      30: 16,
	      31: $V2,
	      35: 9,
	      36: $V3,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 90,
	      63: 47,
	      76: 89,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o([5, 21, 23, 28, 32, 37, 39, 40, 44, 47, 48, 50, 51, 54, 55, 56, 58, 75, 108, 109], $Vw), {
	      21: [1, 91]
	    }, o($Vd, [2, 20]), {
	      32: [1, 92],
	      56: $Vx
	    }, {
	      21: $Ve,
	      22: 94,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 45,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vp,
	      114: 42,
	      115: $Vq
	    }, o($Vy, [2, 122]), o($Vy, [2, 124]), o([23, 32, 37, 39, 54, 56, 78, 79, 80, 81, 83, 84, 103, 104, 105, 106, 107, 109, 110, 112], [2, 125]), o($Vy, [2, 126], {
	      39: [1, 95],
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), {
	      4: 102,
	      6: 3,
	      8: 4,
	      9: 5,
	      10: 6,
	      11: 7,
	      12: 8,
	      13: 12,
	      17: 11,
	      19: $V0,
	      21: $Ve,
	      26: 10,
	      27: $V1,
	      30: 16,
	      31: $V2,
	      35: 9,
	      36: $V3,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 101,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o($VE, [2, 83], {
	      38: 52,
	      42: 53,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      63: 104,
	      37: $Vf,
	      84: [1, 103],
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }), {
	      21: [1, 106],
	      85: 105
	    }, o($VE, [2, 80]), o($VE, [2, 81], {
	      38: 52,
	      42: 53,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      63: 107,
	      37: $Vf,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }), o($VE, [2, 82]), o($VF, [2, 92], {
	      108: $Vv
	    }), o($VF, [2, 93]), o($VF, [2, 94]), o($VF, [2, 95]), o($VF, [2, 96]), o($VF, [2, 97]), o($VF, [2, 98]), o($VF, [2, 99]), {
	      90: 108,
	      93: 109,
	      94: $VG
	    }, o([5, 23, 32, 37, 39, 44, 47, 50, 51, 54, 55, 56, 57, 58, 64, 75, 77, 78, 79, 80, 81, 83, 84, 91, 94, 95, 96, 103, 104, 105, 106, 107, 108, 109, 110, 112], $Vw, {
	      21: [1, 111]
	    }), o([5, 23, 32, 37, 39, 44, 47, 50, 51, 54, 55, 56, 57, 58, 64, 67, 68, 75, 77, 78, 79, 80, 81, 83, 84, 91, 94, 95, 96, 103, 104, 105, 106, 107, 109, 110, 112], [2, 103]), o($VF, [2, 107]), o($VF, [2, 108], {
	      108: [1, 112]
	    }), {
	      21: [1, 113]
	    }, o($VF, [2, 104]), o($VF, [2, 105]), o($VF, [2, 106]), o($Vr, [2, 39]), o($V7, [2, 52], {
	      56: [1, 114],
	      57: [1, 115]
	    }), o($Vr, [2, 40], {
	      16: 20,
	      55: $V6
	    }), {
	      6: 116,
	      11: 7,
	      12: 8,
	      13: 12,
	      30: 16,
	      31: $V2
	    }, o($Vd, [2, 51], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), o($VF, [2, 114]), o($V7, [2, 12]), {
	      37: $Vf,
	      38: 52,
	      42: 53,
	      60: 117,
	      62: 118,
	      63: 119,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o($Vt, [2, 68]), {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 120,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 90,
	      63: 47,
	      76: 121,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o([5, 23, 54], [2, 27]), {
	      21: $Ve,
	      22: 122,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 45,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vp,
	      114: 42,
	      115: $Vq
	    }, o($Vu, [2, 29], {
	      37: [1, 123],
	      108: $Vv
	    }), o($Vu, [2, 31], {
	      108: $Vv
	    }), {
	      38: 124,
	      109: $Vc
	    }, {
	      41: [1, 125]
	    }, {
	      37: [1, 127],
	      109: [1, 126]
	    }, {
	      23: [1, 128]
	    }, {
	      23: [1, 129]
	    }, {
	      23: [2, 102],
	      56: $VH
	    }, o($VI, [2, 120], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), {
	      21: $Ve,
	      22: 131,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 45,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vp,
	      114: 42,
	      115: $Vq
	    }, {
	      20: 132,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 45,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vp,
	      114: 133,
	      115: $Vq
	    }, {
	      32: [1, 134],
	      56: $Vx
	    }, {
	      37: [1, 136],
	      38: 135,
	      109: $Vc
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 137,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 138,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 139,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 141,
	      63: 47,
	      82: 140,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 142,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      23: [1, 143],
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }, {
	      23: [1, 144]
	    }, {
	      21: [1, 145],
	      85: 146
	    }, o($VJ, [2, 100]), o($VE, [2, 79]), {
	      4: 102,
	      6: 3,
	      8: 4,
	      9: 5,
	      10: 6,
	      11: 7,
	      12: 8,
	      13: 12,
	      17: 11,
	      19: $V0,
	      26: 10,
	      27: $V1,
	      30: 16,
	      31: $V2,
	      35: 9,
	      36: $V3
	    }, o($VJ, [2, 101]), {
	      91: [1, 147],
	      92: 148,
	      93: 149,
	      94: $VG,
	      96: [1, 150]
	    }, o($VK, [2, 89]), {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 151,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      21: $Ve,
	      23: [1, 152],
	      33: $VL,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 90,
	      63: 47,
	      76: 155,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      111: 153,
	      112: $Vs,
	      113: [1, 154]
	    }, {
	      37: [1, 157]
	    }, {
	      21: $Ve,
	      33: $VL,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 90,
	      63: 47,
	      76: 155,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      111: 158,
	      112: $Vs
	    }, {
	      42: 159,
	      103: $Vi
	    }, {
	      42: 160,
	      103: $Vi
	    }, o($Vr, [2, 41], {
	      16: 20,
	      55: $V6
	    }), o($V7, [2, 55], {
	      61: 161,
	      56: [1, 162],
	      57: [1, 163]
	    }), o($VM, [2, 57]), o($VM, [2, 59], {
	      64: [1, 164]
	    }), o($Vt, [2, 70], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), o([5, 23, 44, 55, 58, 77], [2, 69], {
	      56: $VH
	    }), {
	      29: 165,
	      54: $V8,
	      56: $Vx
	    }, o($Vu, [2, 37]), o($Vu, [2, 32], {
	      108: $Vv
	    }), {
	      21: [1, 166]
	    }, o($VN, [2, 111]), o($VN, [2, 112]), o($Vu, [2, 33]), o($Vu, [2, 34], {
	      38: 167,
	      109: $Vc
	    }), {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 168,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      23: [1, 169],
	      56: $Vx
	    }, o($VO, [2, 21], {
	      34: 170,
	      46: 171,
	      47: $VP,
	      50: $VQ,
	      51: $VR
	    }), o($Vy, [2, 123]), {
	      20: 175,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, o($Vy, [2, 127], {
	      108: $Vv
	    }), o($Vy, [2, 128]), o([5, 23, 32, 39, 44, 47, 50, 51, 54, 55, 56, 58, 75, 77, 78, 80, 83, 91, 94, 95, 96], [2, 72], {
	      79: $VA,
	      81: $VC
	    }), o([5, 23, 32, 39, 44, 47, 50, 51, 54, 55, 56, 58, 75, 77, 78, 79, 80, 83, 91, 94, 95, 96], [2, 73], {
	      81: $VC
	    }), o([5, 23, 32, 39, 44, 47, 50, 51, 54, 55, 56, 58, 75, 77, 80, 83, 91, 94, 95, 96], [2, 74], {
	      78: $Vz,
	      79: $VA,
	      81: $VC
	    }), o($VE, [2, 75]), {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: [1, 176]
	    }, o($VS, [2, 76], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC
	    }), o($VE, [2, 71]), o($VE, [2, 91]), {
	      4: 102,
	      6: 3,
	      8: 4,
	      9: 5,
	      10: 6,
	      11: 7,
	      12: 8,
	      13: 12,
	      17: 11,
	      19: $V0,
	      21: $Ve,
	      25: 177,
	      26: 10,
	      27: $V1,
	      30: 16,
	      31: $V2,
	      35: 9,
	      36: $V3,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 90,
	      63: 47,
	      76: 89,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o($VE, [2, 78]), o($VE, [2, 85]), {
	      91: [1, 178]
	    }, o($VK, [2, 88]), {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 179,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD,
	      95: [1, 180]
	    }, o($VF, [2, 115]), {
	      23: [1, 181]
	    }, {
	      23: [1, 182]
	    }, {
	      23: [2, 118],
	      56: $VH
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 90,
	      63: 47,
	      76: 183,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o($VF, [2, 109]), {
	      23: [1, 184]
	    }, o($V7, [2, 53]), o($V7, [2, 54]), o($V7, [2, 56]), {
	      37: $Vf,
	      38: 52,
	      42: 53,
	      62: 185,
	      63: 119,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      42: 187,
	      65: 186,
	      103: $Vi
	    }, o($VM, [2, 60]), o($V4, [2, 18]), {
	      42: 188,
	      103: $Vi
	    }, o($Vu, [2, 35], {
	      108: $Vv
	    }), o($VI, [2, 121], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), {
	      24: [1, 189]
	    }, o($VO, [2, 23], {
	      46: 190,
	      47: $VP,
	      50: $VQ,
	      51: $VR
	    }), o($VT, [2, 42]), {
	      20: 191,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      47: [1, 192],
	      52: [1, 193],
	      53: [1, 194]
	    }, {
	      47: [1, 195],
	      52: [1, 196],
	      53: [1, 197]
	    }, o($VO, [2, 22], {
	      46: 171,
	      34: 198,
	      47: $VP,
	      50: $VQ,
	      51: $VR
	    }), {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 199,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      23: [1, 200]
	    }, o($VE, [2, 86]), {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD,
	      91: [2, 90]
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 201,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o($VF, [2, 116]), o($VF, [2, 117]), {
	      23: [2, 119],
	      56: $VH
	    }, o($VF, [2, 113]), o($VM, [2, 58]), o($V7, [2, 61], {
	      66: 202,
	      69: [1, 203]
	    }), {
	      67: [1, 204],
	      68: [1, 205]
	    }, {
	      23: [1, 206]
	    }, {
	      21: [1, 207]
	    }, o($VT, [2, 43]), {
	      48: [1, 208]
	    }, {
	      20: 209,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      47: [1, 210]
	    }, {
	      47: [1, 211]
	    }, {
	      20: 212,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      47: [1, 213]
	    }, {
	      47: [1, 214]
	    }, o($VO, [2, 24], {
	      46: 190,
	      47: $VP,
	      50: $VQ,
	      51: $VR
	    }), o($VS, [2, 84], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC
	    }), o($VE, [2, 77]), o($VK, [2, 87], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), o($V7, [2, 62]), {
	      70: [1, 215],
	      72: [1, 216]
	    }, o($VU, [2, 63]), o($VU, [2, 64]), o($Vu, [2, 36]), {
	      21: $Ve,
	      25: 217,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 90,
	      63: 47,
	      76: 89,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 218,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      48: [1, 219]
	    }, {
	      20: 220,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      20: 221,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      48: [1, 222]
	    }, {
	      20: 223,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      20: 224,
	      21: $Va,
	      37: $Vb,
	      38: 35,
	      109: $Vc
	    }, {
	      42: 187,
	      65: 225,
	      103: $Vi
	    }, {
	      42: 187,
	      65: 226,
	      103: $Vi
	    }, {
	      23: [1, 227]
	    }, o($VT, [2, 44], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 228,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      48: [1, 229]
	    }, {
	      48: [1, 230]
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 231,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      48: [1, 232]
	    }, {
	      48: [1, 233]
	    }, {
	      71: [1, 234]
	    }, {
	      71: [1, 235]
	    }, o([5, 18, 23], [2, 16]), o($VT, [2, 45], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 236,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 237,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o($VT, [2, 46], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 238,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, {
	      21: $Ve,
	      37: $Vf,
	      38: 52,
	      42: 53,
	      49: 239,
	      63: 47,
	      85: 49,
	      86: $Vg,
	      87: 50,
	      88: 51,
	      89: $Vh,
	      97: 54,
	      98: 55,
	      99: 56,
	      100: 57,
	      101: 58,
	      102: 59,
	      103: $Vi,
	      104: $Vj,
	      105: $Vk,
	      106: $Vl,
	      107: $Vm,
	      109: $Vn,
	      110: $Vo,
	      112: $Vs
	    }, o($V7, [2, 65]), o($V7, [2, 66]), o($VT, [2, 47], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), o($VT, [2, 49], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), o($VT, [2, 48], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    }), o($VT, [2, 50], {
	      78: $Vz,
	      79: $VA,
	      80: $VB,
	      81: $VC,
	      83: $VD
	    })],
	    defaultActions: {
	      18: [2, 1]
	    },
	    parseError: function parseError(str, hash) {
	      if (hash.recoverable) {
	        this.trace(str);
	      } else {
	        var error = new Error(str);
	        error.hash = hash;
	        throw error;
	      }
	    },
	    parse: function parse(input) {
	      var self = this,
	          stack = [0],
	          vstack = [null],
	          lstack = [],
	          table = this.table,
	          yytext = '',
	          yylineno = 0,
	          yyleng = 0,
	          TERROR = 2,
	          EOF = 1;
	      var args = lstack.slice.call(arguments, 1);
	      var lexer = Object.create(this.lexer);
	      var sharedState = {
	        yy: {}
	      };

	      for (var k in this.yy) {
	        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
	          sharedState.yy[k] = this.yy[k];
	        }
	      }

	      lexer.setInput(input, sharedState.yy);
	      sharedState.yy.lexer = lexer;
	      sharedState.yy.parser = this;

	      if (typeof lexer.yylloc == 'undefined') {
	        lexer.yylloc = {};
	      }

	      var yyloc = lexer.yylloc;
	      lstack.push(yyloc);
	      var ranges = lexer.options && lexer.options.ranges;

	      if (typeof sharedState.yy.parseError === 'function') {
	        this.parseError = sharedState.yy.parseError;
	      } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	      }

	       var lex = function lex() {
	        var token;
	        token = lexer.lex() || EOF;

	        if (typeof token !== 'number') {
	          token = self.symbols_[token] || token;
	        }

	        return token;
	      };

	      var symbol,
	          state,
	          action,
	          r,
	          yyval = {},
	          p,
	          len,
	          newState,
	          expected;

	      while (true) {
	        state = stack[stack.length - 1];

	        if (this.defaultActions[state]) {
	          action = this.defaultActions[state];
	        } else {
	          if (symbol === null || typeof symbol == 'undefined') {
	            symbol = lex();
	          }

	          action = table[state] && table[state][symbol];
	        }

	        if (typeof action === 'undefined' || !action.length || !action[0]) {
	          var errStr = '';
	          expected = [];

	          for (p in table[state]) {
	            if (this.terminals_[p] && p > TERROR) {
	              expected.push('\'' + this.terminals_[p] + '\'');
	            }
	          }

	          if (lexer.showPosition) {
	            errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	          } else {
	            errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	          }

	          this.parseError(errStr, {
	            text: lexer.match,
	            token: this.terminals_[symbol] || symbol,
	            line: lexer.yylineno,
	            loc: yyloc,
	            expected: expected
	          });
	        }

	        if (action[0] instanceof Array && action.length > 1) {
	          throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }

	        switch (action[0]) {
	          case 1:
	            stack.push(symbol);
	            vstack.push(lexer.yytext);
	            lstack.push(lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;

	            {
	              yyleng = lexer.yyleng;
	              yytext = lexer.yytext;
	              yylineno = lexer.yylineno;
	              yyloc = lexer.yylloc;
	            }

	            break;

	          case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	              first_line: lstack[lstack.length - (len || 1)].first_line,
	              last_line: lstack[lstack.length - 1].last_line,
	              first_column: lstack[lstack.length - (len || 1)].first_column,
	              last_column: lstack[lstack.length - 1].last_column
	            };

	            if (ranges) {
	              yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
	            }

	            r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

	            if (typeof r !== 'undefined') {
	              return r;
	            }

	            if (len) {
	              stack = stack.slice(0, -1 * len * 2);
	              vstack = vstack.slice(0, -1 * len);
	              lstack = lstack.slice(0, -1 * len);
	            }

	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;

	          case 3:
	            return true;
	        }
	      }

	      return true;
	    }
	  };

	  function Parser() {
	    this.yy = {};
	  }

	  Parser.prototype = parser;
	  parser.Parser = Parser;
	  return new Parser();
	}();

	var parser_1 = parser;
	var compiled_parser = {
	  parser: parser_1
	};

	var nodes = createCommonjsModule(function (module, exports) {
	  function indent(str) {
	    return function () {
	      var ref = str.split('\n');
	      var results = [];

	      for (var i = 0, len = ref.length; i < len; i++) {
	        results.push("  " + ref[i]);
	      }

	      return results;
	    }().join('\n');
	  }

	  exports.Select = /*#__PURE__*/function () {
	    function Select(fields, source, distinct, joins, unions) {
	      if (distinct === void 0) {
	        distinct = false;
	      }

	      if (joins === void 0) {
	        joins = [];
	      }

	      if (unions === void 0) {
	        unions = [];
	      }

	      this.fields = fields;
	      this.source = source;
	      this.distinct = distinct;
	      this.joins = joins;
	      this.unions = unions;
	      this.order = null;
	      this.group = null;
	      this.where = null;
	      this.limit = null;
	    }

	    var _proto = Select.prototype;

	    _proto.toString = function toString() {
	      var ret = ["SELECT " + this.fields.join(', ')];
	      ret.push(indent("FROM " + this.source));

	      for (var i = 0, len = this.joins.length; i < len; i++) {
	        ret.push(indent(this.joins[i].toString()));
	      }

	      if (this.where) {
	        ret.push(indent(this.where.toString()));
	      }

	      if (this.group) {
	        ret.push(indent(this.group.toString()));
	      }

	      if (this.order) {
	        ret.push(indent(this.order.toString()));
	      }

	      if (this.limit) {
	        ret.push(indent(this.limit.toString()));
	      }

	      for (var j = 0, len1 = this.unions.length; j < len1; j++) {
	        ret.push(this.unions[j].toString());
	      }

	      return ret.join('\n');
	    };

	    return Select;
	  }();

	  exports.Update = /*#__PURE__*/function () {
	    function Update(source, fields, where) {
	      this.fields = fields;
	      this.source = source;
	      this.where = where;
	    }

	    var _proto2 = Update.prototype;

	    _proto2.toString = function toString() {
	      return "UPDATE " + this.source + " SET " + this.fields + " WHERE " + this.where.toString();
	    };

	    return Update;
	  }();

	  exports.Upsert = /*#__PURE__*/function () {
	    function Upsert(source, fields, values) {
	      this.fields = fields;
	      this.values = values;
	      this.source = source;
	      this.extension = null;
	    }

	    var _proto3 = Upsert.prototype;

	    _proto3.toString = function toString() {
	      return "UPSERT " + this.source + " (" + this.fields.join(", ") + ") values (" + this.values.join(", ") + ") " + (this.extension ? " " + this.extension.toString() : "");
	    };

	    return Upsert;
	  }();

	  exports.SubSelect = /*#__PURE__*/function () {
	    function SubSelect(select, name) {
	      if (name === void 0) {
	        name = null;
	      }

	      this.select = select;
	      this.name = name;
	    }

	    var _proto4 = SubSelect.prototype;

	    _proto4.toString = function toString() {
	      var ret = [];
	      ret.push('(');
	      ret.push(indent(this.select.toString()));
	      ret.push(this.name ? ") " + this.name.toString() : ')');
	      return ret.join('\n');
	    };

	    return SubSelect;
	  }();

	  exports.Join = /*#__PURE__*/function () {
	    function Join(right, conditions, side, mode) {
	      if (conditions === void 0) {
	        conditions = null;
	      }

	      if (side === void 0) {
	        side = null;
	      }

	      if (mode === void 0) {
	        mode = null;
	      }

	      this.right = right;
	      this.conditions = conditions;
	      this.side = side;
	      this.mode = mode;
	    }

	    var _proto5 = Join.prototype;

	    _proto5.toString = function toString() {
	      var ret = '';

	      if (this.side != null) {
	        ret += this.side + " ";
	      }

	      if (this.mode != null) {
	        ret += this.mode + " ";
	      }

	      return ret + ("JOIN " + this.right + "\n") + indent("ON " + this.conditions);
	    };

	    return Join;
	  }();

	  exports.Union = /*#__PURE__*/function () {
	    function Union(query, all1) {
	      if (all1 === void 0) {
	        all1 = false;
	      }

	      this.query = query;
	      this.all = all1;
	    }

	    var _proto6 = Union.prototype;

	    _proto6.toString = function toString() {
	      var all = this.all ? ' ALL' : '';
	      return "UNION" + all + "\n" + this.query.toString();
	    };

	    return Union;
	  }();

	  exports.LiteralValue = /*#__PURE__*/function () {
	    function LiteralValue(value1, value2, dblQuote) {
	      if (value2 === void 0) {
	        value2 = null;
	      }

	      if (dblQuote === void 0) {
	        dblQuote = false;
	      }

	      this.value = value1;
	      this.value2 = value2;
	      this.dblQuote = dblQuote;

	      if (this.value2) {
	        this.nested = true;
	        this.values = this.value.values;
	        this.values.push(this.value2);
	      } else {
	        this.nested = false;
	        this.values = [this.value];
	      }
	    } // TODO: Backtick quotes only supports MySQL, Postgres uses double-quotes


	    var _proto7 = LiteralValue.prototype;

	    _proto7.toString = function toString(quote) {
	      var _this = this;

	      if (quote === void 0) {
	        quote = false;
	      }

	      if (quote) {
	        return "`" + this.values.join('`.`') + "`";
	      } else {
	        return "" + this.values.map(function (value, index) {
	          return index && _this.dblQuote ? "\"" + value + "\"" : value;
	        }).join(".");
	      }
	    };

	    return LiteralValue;
	  }();

	  exports.StringValue = /*#__PURE__*/function () {
	    function StringValue(value1, quoteType) {
	      if (quoteType === void 0) {
	        quoteType = '\'\'';
	      }

	      this.values = Array.isArray(value1) ? value1 : [value1];
	      this.quoteType = quoteType;
	    }

	    var _proto8 = StringValue.prototype;

	    _proto8.toString = function toString() {
	      var _this2 = this;

	      var escaped = this.quoteType === '\'' ? this.values.map(function (value) {
	        return value.replace(/(^|[^\\])'/g, '$1\'\'');
	      }) : this.values;
	      return "" + this.values.map(function (value) {
	        return "" + _this2.quoteType + value + _this2.quoteType;
	      }).join(".");
	    };

	    return StringValue;
	  }();

	  exports.NumberValue = /*#__PURE__*/function () {
	    function NumberValue(value) {
	      this.value = Number(value);
	    }

	    var _proto9 = NumberValue.prototype;

	    _proto9.toString = function toString() {
	      return this.value.toString();
	    };

	    return NumberValue;
	  }();

	  exports.ListValue = /*#__PURE__*/function () {
	    function ListValue(value1) {
	      this.value = value1;
	    }

	    var _proto10 = ListValue.prototype;

	    _proto10.toString = function toString() {
	      return "(" + this.value.join(', ') + ")";
	    };

	    return ListValue;
	  }();

	  exports.WhitepaceList = /*#__PURE__*/function () {
	    function WhitepaceList(value1) {
	      this.value = value1;
	    }

	    var _proto11 = WhitepaceList.prototype;

	    _proto11.toString = function toString() {
	      // not backtick for literals
	      return this.value.map(function (value) {
	        if (value instanceof exports.LiteralValue) {
	          return value.toString(false);
	        } else {
	          return value.toString();
	        }
	      }).join(' ');
	    };

	    return WhitepaceList;
	  }();

	  exports.ParameterValue = /*#__PURE__*/function () {
	    function ParameterValue(value) {
	      this.value = value;
	      this.index = parseInt(value.substr(1), 10) - 1;
	    }

	    var _proto12 = ParameterValue.prototype;

	    _proto12.toString = function toString() {
	      return "$" + this.value;
	    };

	    return ParameterValue;
	  }();

	  exports.Placeholder = /*#__PURE__*/function () {
	    function Placeholder() {}

	    var _proto13 = Placeholder.prototype;

	    _proto13.toString = function toString() {
	      return "?";
	    };

	    return Placeholder;
	  }();

	  exports.Extension = /*#__PURE__*/function () {
	    function Extension(extension) {
	      this.extension = extension;
	    }

	    var _proto14 = Extension.prototype;

	    _proto14.toString = function toString() {
	      return "" + extension;
	    };

	    return Extension;
	  }();

	  exports.ArgumentListValue = /*#__PURE__*/function () {
	    function ArgumentListValue(value1, distinct) {
	      if (distinct === void 0) {
	        distinct = false;
	      }

	      this.value = value1;
	      this.distinct = distinct;
	    }

	    var _proto15 = ArgumentListValue.prototype;

	    _proto15.toString = function toString() {
	      if (this.distinct) {
	        return "DISTINCT " + this.value.join(', ');
	      } else {
	        return "" + this.value.join(', ');
	      }
	    };

	    return ArgumentListValue;
	  }();

	  exports.BooleanValue = /*#__PURE__*/function () {
	    function LiteralValue(value) {
	      this.value = function () {
	        switch (value.toLowerCase()) {
	          case 'true':
	            return true;

	          case 'false':
	            return false;

	          default:
	            return null;
	        }
	      }();
	    }

	    var _proto16 = LiteralValue.prototype;

	    _proto16.toString = function toString() {
	      if (this.value != null) {
	        return this.value.toString().toUpperCase();
	      } else {
	        return 'NULL';
	      }
	    };

	    return LiteralValue;
	  }();

	  exports.FunctionValue = /*#__PURE__*/function () {
	    function FunctionValue(name, _arguments, udf) {
	      if (_arguments === void 0) {
	        _arguments = null;
	      }

	      if (udf === void 0) {
	        udf = false;
	      }

	      this.name = name;
	      this.arguments = _arguments;
	      this.udf = udf;
	    }

	    var _proto17 = FunctionValue.prototype;

	    _proto17.toString = function toString() {
	      if (this.arguments) {
	        return this.name.toUpperCase() + "(" + this.arguments.toString() + ")";
	      } else {
	        return this.name.toUpperCase() + "()";
	      }
	    };

	    return FunctionValue;
	  }();

	  exports.Case = /*#__PURE__*/function () {
	    function Case(whens, _else) {
	      this.whens = whens;
	      this["else"] = _else;
	    }

	    var _proto18 = Case.prototype;

	    _proto18.toString = function toString() {
	      var whensStr = this.whens.map(function (w) {
	        return w.toString();
	      }).join(' ');

	      if (this["else"]) {
	        return "CASE " + whensStr + " " + this["else"].toString() + " END";
	      } else {
	        return "CASE " + whensStr + " END";
	      }
	    };

	    return Case;
	  }();

	  exports.CaseWhen = /*#__PURE__*/function () {
	    function CaseWhen(whenCondition, resCondition) {
	      this.whenCondition = whenCondition;
	      this.resCondition = resCondition;
	    }

	    var _proto19 = CaseWhen.prototype;

	    _proto19.toString = function toString() {
	      return "WHEN " + this.whenCondition + " THEN " + this.resCondition;
	    };

	    return CaseWhen;
	  }();

	  exports.CaseElse = /*#__PURE__*/function () {
	    function CaseElse(elseCondition) {
	      this.elseCondition = elseCondition;
	    }

	    var _proto20 = CaseElse.prototype;

	    _proto20.toString = function toString() {
	      return "ELSE " + this.elseCondition;
	    };

	    return CaseElse;
	  }();

	  exports.Order = /*#__PURE__*/function () {
	    function Order(orderings, offset) {
	      this.orderings = orderings;
	      this.offset = offset;
	    }

	    var _proto21 = Order.prototype;

	    _proto21.toString = function toString() {
	      return "ORDER BY " + this.orderings.join(', ') + (this.offset ? '\n' + this.offset.toString() : '');
	    };

	    return Order;
	  }();

	  exports.OrderArgument = /*#__PURE__*/function () {
	    function OrderArgument(value, direction) {
	      if (direction === void 0) {
	        direction = 'ASC';
	      }

	      this.value = value;
	      this.direction = direction;
	    }

	    var _proto22 = OrderArgument.prototype;

	    _proto22.toString = function toString() {
	      return this.value + " " + this.direction;
	    };

	    return OrderArgument;
	  }();

	  exports.Offset = /*#__PURE__*/function () {
	    function Offset(row_count, limit) {
	      this.row_count = row_count;
	      this.limit = limit;
	    }

	    var _proto23 = Offset.prototype;

	    _proto23.toString = function toString() {
	      return "OFFSET " + this.row_count + " ROWS" + (this.limit ? "\nFETCH NEXT " + this.limit + " ROWS ONLY" : '');
	    };

	    return Offset;
	  }();

	  exports.Limit = /*#__PURE__*/function () {
	    function Limit(value1, offset) {
	      this.value = value1;
	      this.offset = offset;
	    }

	    var _proto24 = Limit.prototype;

	    _proto24.toString = function toString() {
	      return "LIMIT " + this.value + (this.offset ? "\nOFFSET " + this.offset : '');
	    };

	    return Limit;
	  }();

	  exports.Table = /*#__PURE__*/function () {
	    function Table(name, alias, win, winFn, winArg) {
	      if (alias === void 0) {
	        alias = null;
	      }

	      if (win === void 0) {
	        win = null;
	      }

	      if (winFn === void 0) {
	        winFn = null;
	      }

	      if (winArg === void 0) {
	        winArg = null;
	      }

	      this.name = name;
	      this.alias = alias;
	      this.win = win;
	      this.winFn = winFn;
	      this.winArg = winArg;
	    }

	    var _proto25 = Table.prototype;

	    _proto25.toString = function toString() {
	      var name = /(:|\.)/.test(this.name) ? "\"" + this.name + "\"" : "" + this.name;

	      if (this.win) {
	        return name + "." + this.win + ":" + this.winFn + "(" + this.winArg + ")";
	      } else if (this.alias) {
	        return name + " AS " + this.alias;
	      } else {
	        return name;
	      }
	    };

	    return Table;
	  }();

	  exports.Group = /*#__PURE__*/function () {
	    function Group(fields) {
	      this.fields = fields;
	      this.having = null;
	    }

	    var _proto26 = Group.prototype;

	    _proto26.toString = function toString() {
	      var ret = ["GROUP BY " + this.fields.join(', ')];

	      if (this.having) {
	        ret.push(this.having.toString());
	      }

	      return ret.join('\n');
	    };

	    return Group;
	  }();

	  exports.Where = /*#__PURE__*/function () {
	    function Where(conditions) {
	      this.conditions = conditions;
	    }

	    var _proto27 = Where.prototype;

	    _proto27.toString = function toString() {
	      return "WHERE " + this.conditions;
	    };

	    return Where;
	  }();

	  exports.Having = /*#__PURE__*/function () {
	    function Having(conditions) {
	      this.conditions = conditions;
	    }

	    var _proto28 = Having.prototype;

	    _proto28.toString = function toString() {
	      return "HAVING " + this.conditions;
	    };

	    return Having;
	  }();

	  exports.Op = /*#__PURE__*/function () {
	    function Op(operation, left, right) {
	      this.operation = operation;
	      this.left = left;
	      this.right = right;
	    }

	    var _proto29 = Op.prototype;

	    _proto29.toString = function toString() {
	      return "(" + this.left + " " + this.operation.toUpperCase() + " " + this.right + ")";
	    };

	    return Op;
	  }();

	  exports.UnaryOp = /*#__PURE__*/function () {
	    function UnaryOp(operator, operand) {
	      this.operator = operator;
	      this.operand = operand;
	    }

	    var _proto30 = UnaryOp.prototype;

	    _proto30.toString = function toString() {
	      return "(" + this.operator.toUpperCase() + " " + this.operand + ")";
	    };

	    return UnaryOp;
	  }();

	  exports.BetweenOp = /*#__PURE__*/function () {
	    function BetweenOp(value) {
	      this.value = value;
	    }

	    var _proto31 = BetweenOp.prototype;

	    _proto31.toString = function toString() {
	      return "" + this.value.join(' AND ');
	    };

	    return BetweenOp;
	  }();

	  exports.Field = /*#__PURE__*/function () {
	    function Field(field, name) {
	      if (name === void 0) {
	        name = null;
	      }

	      this.field = field;
	      this.name = name;
	    }

	    var _proto32 = Field.prototype;

	    _proto32.toString = function toString() {
	      if (this.name) {
	        return this.field + " AS \"" + this.name + "\"";
	      } else {
	        return this.field.toString();
	      }
	    };

	    return Field;
	  }();

	  exports.Delete = /*#__PURE__*/function () {
	    function Delete(source) {
	      this.source = source;
	    }

	    var _proto33 = Delete.prototype;

	    _proto33.toString = function toString() {
	      return "DELETE FROM " + this.source;
	    };

	    return Delete;
	  }();

	  exports.Star = /*#__PURE__*/function () {
	    function Star() {}

	    var _proto34 = Star.prototype;

	    _proto34.toString = function toString() {
	      return '*';
	    };

	    return Star;
	  }();
	});
	var nodes_1 = nodes.Select;
	var nodes_2 = nodes.Update;
	var nodes_3 = nodes.Upsert;
	var nodes_4 = nodes.SubSelect;
	var nodes_5 = nodes.Join;
	var nodes_6 = nodes.Union;
	var nodes_7 = nodes.LiteralValue;
	var nodes_8 = nodes.StringValue;
	var nodes_9 = nodes.NumberValue;
	var nodes_10 = nodes.ListValue;
	var nodes_11 = nodes.WhitepaceList;
	var nodes_12 = nodes.ParameterValue;
	var nodes_13 = nodes.Placeholder;
	var nodes_14 = nodes.Extension;
	var nodes_15 = nodes.ArgumentListValue;
	var nodes_16 = nodes.BooleanValue;
	var nodes_17 = nodes.FunctionValue;
	var nodes_18 = nodes.Case;
	var nodes_19 = nodes.CaseWhen;
	var nodes_20 = nodes.CaseElse;
	var nodes_21 = nodes.Order;
	var nodes_22 = nodes.OrderArgument;
	var nodes_23 = nodes.Offset;
	var nodes_24 = nodes.Limit;
	var nodes_25 = nodes.Table;
	var nodes_26 = nodes.Group;
	var nodes_27 = nodes.Where;
	var nodes_28 = nodes.Having;
	var nodes_29 = nodes.Op;
	var nodes_30 = nodes.UnaryOp;
	var nodes_31 = nodes.BetweenOp;
	var nodes_32 = nodes.Field;
	var nodes_33 = nodes.Delete;
	var nodes_34 = nodes.Star;

	var parser$1 = compiled_parser.parser;
	parser$1.lexer = {
	  lex: function lex() {
	    var tag;

	    var _ref = this.tokens[this.pos++] || [''];

	    tag = _ref[0];
	    this.yytext = _ref[1];
	    this.yylineno = _ref[2];
	    return tag;
	  },
	  setInput: function setInput(tokens) {
	    this.tokens = tokens;
	    return this.pos = 0;
	  },
	  upcomingInput: function upcomingInput() {
	    return '';
	  }
	};
	parser$1.yy = nodes;
	var parser_2 = parser$1;

	var parse = function parse(str) {
	  return parser$1.parse(str);
	};

	var parser_1$1 = {
	  parser: parser_2,
	  parse: parse
	};

	var sql_parser = createCommonjsModule(function (module, exports) {
	  exports.lexer = lexer;
	  exports.parser = parser_1$1;
	  exports.nodes = nodes;

	  exports.parse = function (sql) {
	    return exports.parser.parse(exports.lexer.tokenize(sql));
	  };
	});
	var sql_parser_1 = sql_parser.lexer;
	var sql_parser_2 = sql_parser.parser;
	var sql_parser_3 = sql_parser.nodes;
	var sql_parser_4 = sql_parser.parse;

	exports.default = sql_parser;
	exports.lexer = sql_parser_1;
	exports.nodes = sql_parser_3;
	exports.parse = sql_parser_4;
	exports.parser = sql_parser_2;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sql-parser.js.map
