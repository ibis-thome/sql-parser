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
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,17],$V1=[1,16],$V2=[1,20],$V3=[1,15],$V4=[1,18],$V5=[5,19,24],$V6=[1,26],$V7=[1,25],$V8=[5,19,24,50,61],$V9=[1,28],$Va=[1,32],$Vb=[1,39],$Vc=[1,44],$Vd=[1,42],$Ve=[5,19,24,50,61,64,81],$Vf=[1,53],$Vg=[1,71],$Vh=[1,55],$Vi=[1,67],$Vj=[1,69],$Vk=[1,73],$Vl=[1,74],$Vm=[1,75],$Vn=[1,70],$Vo=[1,68],$Vp=[1,72],$Vq=[1,51],$Vr=[1,50],$Vs=[5,19,24,50],$Vt=[1,81],$Vu=[5,19,24,50,61,64],$Vv=[2,33],$Vw=[2,34],$Vx=[1,89],$Vy=[2,118],$Vz=[5,19,22,24,50,53,54,56,57,58,60,61,64,81],$VA=[1,102],$VB=[24,34,62],$VC=[1,106],$VD=[1,107],$VE=[1,108],$VF=[1,109],$VG=[1,110],$VH=[5,19,24,34,44,50,53,56,57,58,60,61,62,64,81,82,83,84,85,86,88,96,99,100,101],$VI=[5,19,24,34,42,44,50,53,56,57,58,60,61,62,63,64,70,81,82,83,84,85,86,88,89,96,99,100,101,108,109,110,111,112,114,115,117],$VJ=[1,120],$VK=[1,142],$VL=[5,19,24,50,60,61,62,64,82],$VM=[5,19,24,34,42,44,50,53,56,57,58,60,61,62,64,81,82,83,84,85,86,88,96,99,100,101,108,109,110,111,112,114,115,117],$VN=[96,99,101],$VO=[1,170],$VP=[5,19,24,50,61,62,63],$VQ=[5,19,22,24,29,34,42,44,46,50,53,54,56,57,58,60,61,62,63,64,70,81,82,83,84,85,86,88,89,96,99,100,101,108,109,110,111,112,113,114,115,117],$VR=[5,19,24,50,60,61,64,81],$VS=[1,187],$VT=[1,188],$VU=[1,189],$VV=[1,190],$VW=[5,19,24,34,44,50,53,56,57,58,60,61,62,64,81,82,88,96,99,100,101],$VX=[5,19,24,50,53,56,57,58,60,61,64,81],$VY=[5,19,24,50,61,75,77];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"Root":3,"Query":4,"EOF":5,"SelectQuery":6,"Unions":7,"Delete":8,"Update":9,"Upsert":10,"Insert":11,"SelectWithLimitQuery":12,"BasicSelectQuery":13,"Select":14,"OrderClause":15,"GroupClause":16,"LimitClause":17,"UpsertClause":18,"WITH_PRIMARY_KEY":19,"UPSERT":20,"Table":21,"LEFT_PAREN":22,"Fields":23,"RIGHT_PAREN":24,"VALUES":25,"UpdateClause":26,"UPDATE":27,"TableWithoutAlias":28,"SET":29,"ArgumentList":30,"WhereClause":31,"SelectClause":32,"SELECT":33,"FROM":34,"DISTINCT":35,"Joins":36,"DeleteClause":37,"DELETE":38,"InsertClause":39,"INSERT":40,"INTO":41,"DBLSTRING":42,"Literal":43,"AS":44,"List":45,"WINDOW":46,"WINDOW_FUNCTION":47,"Number":48,"Union":49,"UNION":50,"ALL":51,"Join":52,"JOIN":53,"ON":54,"Expression":55,"INNER":56,"LEFT":57,"RIGHT":58,"OUTER":59,"WHERE":60,"LIMIT":61,"SEPARATOR":62,"OFFSET":63,"ORDER":64,"BY":65,"OrderArgs":66,"OffsetClause":67,"OrderArg":68,"Value":69,"DIRECTION":70,"OffsetRows":71,"FetchClause":72,"ROW":73,"ROWS":74,"FETCH":75,"FIRST":76,"ONLY":77,"NEXT":78,"GroupBasicClause":79,"HavingClause":80,"GROUP":81,"HAVING":82,"MATH":83,"MATH_MULTI":84,"OPERATOR":85,"BETWEEN":86,"BetweenExpression":87,"CONDITIONAL":88,"SUB_SELECT_OP":89,"SubSelectExpression":90,"SUB_SELECT_UNARY_OP":91,"WhitepaceList":92,"CaseStatement":93,"CASE":94,"CaseWhens":95,"END":96,"CaseElse":97,"CaseWhen":98,"WHEN":99,"THEN":100,"ELSE":101,"String":102,"Function":103,"UserFunction":104,"Boolean":105,"Parameter":106,"Placeholder":107,"NUMBER":108,"BOOLEAN":109,"PARAMETER":110,"PLACEHOLDER":111,"STRING":112,"DOT":113,"LITERAL":114,"FUNCTION":115,"AggregateArgumentList":116,"FIELD_FUNCTION":117,"Case":118,"Field":119,"STAR":120,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",19:"WITH_PRIMARY_KEY",20:"UPSERT",22:"LEFT_PAREN",24:"RIGHT_PAREN",25:"VALUES",27:"UPDATE",29:"SET",33:"SELECT",34:"FROM",35:"DISTINCT",38:"DELETE",40:"INSERT",41:"INTO",42:"DBLSTRING",44:"AS",46:"WINDOW",47:"WINDOW_FUNCTION",50:"UNION",51:"ALL",53:"JOIN",54:"ON",56:"INNER",57:"LEFT",58:"RIGHT",59:"OUTER",60:"WHERE",61:"LIMIT",62:"SEPARATOR",63:"OFFSET",64:"ORDER",65:"BY",70:"DIRECTION",73:"ROW",74:"ROWS",75:"FETCH",76:"FIRST",77:"ONLY",78:"NEXT",81:"GROUP",82:"HAVING",83:"MATH",84:"MATH_MULTI",85:"OPERATOR",86:"BETWEEN",88:"CONDITIONAL",89:"SUB_SELECT_OP",91:"SUB_SELECT_UNARY_OP",94:"CASE",96:"END",99:"WHEN",100:"THEN",101:"ELSE",108:"NUMBER",109:"BOOLEAN",110:"PARAMETER",111:"PLACEHOLDER",112:"STRING",113:"DOT",114:"LITERAL",115:"FUNCTION",117:"FIELD_FUNCTION",118:"Case",120:"STAR"},
productions_: [0,[3,2],[4,1],[4,2],[4,1],[4,1],[4,1],[4,1],[6,1],[6,1],[13,1],[13,2],[13,2],[13,3],[12,2],[10,1],[10,2],[18,7],[18,6],[9,1],[26,5],[14,1],[14,2],[32,4],[32,5],[32,5],[32,6],[8,1],[8,2],[37,3],[11,1],[39,8],[39,7],[28,1],[28,1],[21,1],[21,2],[21,3],[21,2],[21,3],[21,3],[21,3],[21,4],[21,6],[21,3],[7,1],[7,2],[49,2],[49,3],[36,1],[36,2],[52,4],[52,5],[52,5],[52,5],[52,6],[52,6],[52,6],[52,6],[31,2],[17,2],[17,4],[17,4],[15,3],[15,4],[66,1],[66,3],[68,1],[68,2],[67,2],[67,3],[71,2],[71,2],[72,4],[72,4],[16,1],[16,2],[79,3],[80,2],[55,3],[55,3],[55,3],[55,3],[55,3],[55,3],[55,5],[55,3],[55,2],[55,1],[55,1],[55,1],[55,1],[87,3],[93,3],[93,4],[98,4],[95,2],[95,1],[97,2],[90,3],[69,1],[69,1],[69,1],[69,1],[69,1],[69,1],[69,1],[69,1],[92,2],[92,2],[45,1],[48,1],[105,1],[106,1],[107,1],[102,1],[102,1],[102,3],[43,1],[43,3],[43,3],[103,4],[103,1],[104,3],[104,4],[104,4],[116,1],[116,2],[30,1],[30,3],[23,1],[23,3],[119,1],[119,1],[119,3],[119,3],[119,1],[119,3],[119,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return this.$ = $$[$0-1];
break;
case 2: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 15: case 19: case 21: case 27: case 30: case 35: case 75: case 88: case 90: case 91: case 100: case 101: case 102: case 103: case 104: case 105: case 106: case 107:
this.$ = $$[$0];
break;
case 3:
this.$ = (function(){ $$[$0-1].unions = $$[$0]; return $$[$0-1]; }());
break;
case 11:
this.$ = (function(){ $$[$0-1].order = $$[$0]; return $$[$0-1]; }());
break;
case 12:
this.$ = (function(){ $$[$0-1].group = $$[$0]; return $$[$0-1]; }());
break;
case 13:
this.$ = (function(){ $$[$0-2].group = $$[$0-1]; $$[$0-2].order = $$[$0]; return $$[$0-2]; }());
break;
case 14:
this.$ = (function(){ $$[$0-1].limit = $$[$0]; return $$[$0-1]; }());
break;
case 16:
this.$ = (function(){ $$[$0-1].extension = $$[$0]; return $$[$0-1]; }());
break;
case 17:
this.$ = new yy.Upsert($$[$0-5], $$[$0-3], $$[$0]);
break;
case 18:
this.$ = new yy.Upsert($$[$0-4], $$[$0-2], $$[$0]);
break;
case 20:
this.$ = new yy.Update($$[$0-3], $$[$0-1], $$[$0]);
break;
case 22: case 28:
this.$ = (function(){ $$[$0-1].where = $$[$0]; return $$[$0-1]; }());
break;
case 23:
this.$ = new yy.Select($$[$0-2], $$[$0], false);
break;
case 24:
this.$ = new yy.Select($$[$0-2], $$[$0], true);
break;
case 25:
this.$ = new yy.Select($$[$0-3], $$[$0-1], false, $$[$0]);
break;
case 26:
this.$ = new yy.Select($$[$0-3], $$[$0-1], true, $$[$0]);
break;
case 29:
this.$ = new yy.Delete($$[$0], false);
break;
case 31:
this.$ = new yy.Insert($$[$0-5], $$[$0-3], $$[$0]);
break;
case 32:
this.$ = new yy.Insert($$[$0-4], $$[$0-2], $$[$0]);
break;
case 33: case 34:
this.$ = new yy.Table($$[$0]);
break;
case 36: case 38:
this.$ = new yy.Table($$[$0-1], $$[$0]);
break;
case 37: case 39:
this.$ = new yy.Table($$[$0-2], $$[$0]);
break;
case 40: case 71: case 72: case 73: case 74: case 79:
this.$ = $$[$0-1];
break;
case 41: case 99:
this.$ = new yy.SubSelect($$[$0-1]);
break;
case 42:
this.$ = new yy.SubSelect($$[$0-2], $$[$0]);
break;
case 43:
this.$ = new yy.Table($$[$0-5], null, $$[$0-4], $$[$0-3], $$[$0-1]);
break;
case 44:
this.$ = new yy.Table($$[$0-1]);
break;
case 45: case 49: case 65: case 97: case 128: case 130:
this.$ = [$$[$0]];
break;
case 46: case 50: case 96:
this.$ = $$[$0-1].concat($$[$0]);
break;
case 47:
this.$ = new yy.Union($$[$0]);
break;
case 48:
this.$ = new yy.Union($$[$0], true);
break;
case 51:
this.$ = new yy.Join($$[$0-2], $$[$0]);
break;
case 52:
this.$ = new yy.Join($$[$0-2], $$[$0], 'INNER');
break;
case 53:
this.$ = new yy.Join($$[$0-2], $$[$0], 'LEFT');
break;
case 54:
this.$ = new yy.Join($$[$0-2], $$[$0], 'RIGHT');
break;
case 55:
this.$ = new yy.Join($$[$0-2], $$[$0], 'LEFT', 'INNER');
break;
case 56:
this.$ = new yy.Join($$[$0-2], $$[$0], 'RIGHT', 'INNER');
break;
case 57:
this.$ = new yy.Join($$[$0-2], $$[$0], 'LEFT', 'OUTER');
break;
case 58:
this.$ = new yy.Join($$[$0-2], $$[$0], 'RIGHT', 'OUTER');
break;
case 59:
this.$ = new yy.Where($$[$0]);
break;
case 60:
this.$ = new yy.Limit($$[$0]);
break;
case 61:
this.$ = new yy.Limit($$[$0], $$[$0-2]);
break;
case 62:
this.$ = new yy.Limit($$[$0-2], $$[$0]);
break;
case 63:
this.$ = new yy.Order($$[$0]);
break;
case 64:
this.$ = new yy.Order($$[$0-1], $$[$0]);
break;
case 66: case 129: case 131:
this.$ = $$[$0-2].concat($$[$0]);
break;
case 67:
this.$ = new yy.OrderArgument($$[$0], 'ASC');
break;
case 68:
this.$ = new yy.OrderArgument($$[$0-1], $$[$0]);
break;
case 69:
this.$ = new yy.Offset($$[$0]);
break;
case 70:
this.$ = new yy.Offset($$[$0-1], $$[$0]);
break;
case 76:
this.$ = (function(){ $$[$0-1].having = $$[$0]; return $$[$0-1]; }());
break;
case 77:
this.$ = new yy.Group($$[$0]);
break;
case 78:
this.$ = new yy.Having($$[$0]);
break;
case 80: case 81: case 82: case 83: case 84: case 86:
this.$ = new yy.Op($$[$0-1], $$[$0-2], $$[$0]);
break;
case 85:
this.$ = new yy.Op($$[$0-3], $$[$0-4], $$[$0-1]);
break;
case 87:
this.$ = new yy.UnaryOp($$[$0-1], $$[$0]);
break;
case 89:
this.$ = new yy.WhitepaceList($$[$0]);
break;
case 92:
this.$ = new yy.BetweenOp([$$[$0-2], $$[$0]]);
break;
case 93:
this.$ = new yy.Case($$[$0-1]);
break;
case 94:
this.$ = new yy.Case($$[$0-2], $$[$0-1]);
break;
case 95:
this.$ = new yy.CaseWhen($$[$0-2], $$[$0]);
break;
case 98:
this.$ = new yy.CaseElse($$[$0]);
break;
case 108:
this.$ = [$$[$0-1], $$[$0]];
break;
case 109:
this.$ = (function(){ $$[$0-1].push($$[$0]); return $$[$0-1]; }());
break;
case 110:
this.$ = new yy.ListValue($$[$0]);
break;
case 111:
this.$ = new yy.NumberValue($$[$0]);
break;
case 112:
this.$ = new yy.BooleanValue($$[$0]);
break;
case 113:
this.$ = new yy.ParameterValue($$[$0]);
break;
case 114:
this.$ = new yy.Placeholder($$[$0]);
break;
case 115:
this.$ = new yy.StringValue($$[$0], "'");
break;
case 116:
this.$ = new yy.StringValue($$[$0], '"');
break;
case 117:
this.$ = new yy.StringValue([$$[$0-2], $$[$0]], '"');
break;
case 118:
this.$ = new yy.LiteralValue($$[$0]);
break;
case 119:
this.$ = new yy.LiteralValue($$[$0-2], $$[$0]);
break;
case 120:
this.$ = new yy.LiteralValue($$[$0-2], $$[$0], true);
break;
case 121:
this.$ = new yy.FunctionValue($$[$0-3], $$[$0-1]);
break;
case 122: case 133: case 136:
this.$ = new yy.Field($$[$0]);
break;
case 123:
this.$ = new yy.FunctionValue($$[$0-2], null, true);
break;
case 124: case 125:
this.$ = new yy.FunctionValue($$[$0-3], $$[$0-1], true);
break;
case 126:
this.$ = new yy.ArgumentListValue($$[$0]);
break;
case 127:
this.$ = new yy.ArgumentListValue($$[$0], true);
break;
case 132:
this.$ = new yy.Star();
break;
case 134: case 135: case 137: case 138:
this.$ = new yy.Field($$[$0-2], $$[$0]);
break;
}
},
table: [{3:1,4:2,6:3,8:4,9:5,10:6,11:7,12:8,13:9,14:14,18:12,20:$V0,26:11,27:$V1,32:19,33:$V2,37:10,38:$V3,39:13,40:$V4},{1:[3]},{5:[1,21]},o($V5,[2,2],{7:22,17:23,49:24,50:$V6,61:$V7}),o($V5,[2,4]),o($V5,[2,5]),o($V5,[2,6]),o($V5,[2,7]),o($V8,[2,8]),o($V8,[2,9]),o($V5,[2,27],{31:27,60:$V9}),o($V5,[2,19]),o([5,24],[2,15],{19:[1,29]}),o($V5,[2,30]),o($V8,[2,10],{15:30,16:31,79:33,64:$Va,81:[1,34]}),{34:[1,35]},{28:36,42:[1,37],43:38,114:$Vb},{21:40,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{41:[1,45]},o($Ve,[2,21],{31:46,60:$V9}),{22:$Vf,23:47,35:[1,48],42:$Vg,43:59,48:60,55:52,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vq,119:49,120:$Vr},{1:[2,1]},o($V5,[2,3],{49:76,50:$V6}),o($V8,[2,14]),o($Vs,[2,45]),{48:77,108:$Vj},{6:78,12:8,13:9,14:14,32:19,33:$V2,51:[1,79]},o($V5,[2,28]),{22:$Vf,42:$Vg,43:59,48:60,55:80,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},o($V5,[2,16]),o($V8,[2,11]),o($V8,[2,12],{15:82,64:$Va}),{65:[1,83]},o($Vu,[2,75],{80:84,82:[1,85]}),{65:[1,86]},{21:87,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{29:[1,88]},{29:$Vv},{29:$Vw,113:$Vx},o([5,19,22,24,29,34,42,44,46,50,53,54,56,57,58,60,61,62,64,81,113,114],$Vy),{22:[1,90]},o($Vz,[2,35]),o($Vz,$Vv,{43:91,44:[1,92],114:$Vb}),o($Vz,$Vw,{43:93,44:[1,94],46:[1,95],113:$Vx,114:$Vb}),{4:97,6:3,8:4,9:5,10:6,11:7,12:8,13:9,14:14,18:12,20:$V0,22:$Vf,26:11,27:$V1,30:98,32:19,33:$V2,37:10,38:$V3,39:13,40:$V4,42:$Vg,43:59,45:96,48:60,55:99,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{21:100,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},o($Ve,[2,22]),{34:[1,101],62:$VA},{22:$Vf,23:103,42:$Vg,43:59,48:60,55:52,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vq,119:49,120:$Vr},o($VB,[2,130]),o($VB,[2,132]),o([24,34,42,62,83,84,85,86,88,89,108,109,110,111,112,114,115,117],[2,133],{44:[1,104]}),o($VB,[2,136],{44:[1,105],83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),{4:112,6:3,8:4,9:5,10:6,11:7,12:8,13:9,14:14,18:12,20:$V0,22:$Vf,26:11,27:$V1,32:19,33:$V2,37:10,38:$V3,39:13,40:$V4,42:$Vg,43:59,48:60,55:111,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},o($VH,[2,91],{43:59,48:60,102:61,103:62,104:63,105:64,106:65,107:66,69:114,42:$Vg,89:[1,113],108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt}),{22:[1,116],90:115},o($VH,[2,88]),o($VH,[2,89],{43:59,48:60,102:61,103:62,104:63,105:64,106:65,107:66,69:117,42:$Vg,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt}),o($VH,[2,90]),o($VI,[2,100],{113:$Vx}),o($VI,[2,101]),o($VI,[2,102]),o($VI,[2,103]),o($VI,[2,104]),o($VI,[2,105]),o($VI,[2,106]),o($VI,[2,107]),{95:118,98:119,99:$VJ},o([5,19,24,34,42,44,50,53,56,57,58,60,61,62,63,64,70,81,82,83,84,85,86,88,89,96,99,100,101,108,109,110,111,112,113,114,115,117],$Vy,{22:[1,121]}),o([5,19,24,34,42,44,50,53,56,57,58,60,61,62,63,64,70,73,74,81,82,83,84,85,86,88,89,96,99,100,101,108,109,110,111,112,114,115,117],[2,111]),o($VI,[2,115]),o($VI,[2,116],{113:[1,122]}),{22:[1,123]},o($VI,[2,112]),o($VI,[2,113]),o($VI,[2,114]),o($Vs,[2,46]),o($V8,[2,60],{62:[1,124],63:[1,125]}),o($Vs,[2,47],{17:23,61:$V7}),{6:126,12:8,13:9,14:14,32:19,33:$V2},o($Ve,[2,59],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),o($VI,[2,122]),o($V8,[2,13]),{42:$Vg,43:59,48:60,66:127,68:128,69:129,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},o($Vu,[2,76]),{22:$Vf,42:$Vg,43:59,48:60,55:130,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,30:131,42:$Vg,43:59,48:60,55:99,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},o([5,19,24,60],[2,29]),{22:$Vf,30:132,42:$Vg,43:59,48:60,55:99,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{42:[1,134],114:[1,133]},{22:$Vf,23:135,42:$Vg,43:59,48:60,55:52,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vq,119:49,120:$Vr},o($Vz,[2,36],{42:[1,136],113:$Vx}),{43:137,114:$Vb},o($Vz,[2,38],{113:$Vx}),{43:138,114:$Vb},{47:[1,139]},{24:[1,140]},{24:[1,141]},{24:[2,110],62:$VK},o($VL,[2,128],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),{22:[1,143]},{21:144,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{22:$Vf,42:$Vg,43:59,48:60,55:52,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vq,119:145,120:$Vr},{34:[1,146],62:$VA},{42:[1,148],43:147,114:$Vb},{42:[1,150],43:149,114:$Vb},{22:$Vf,42:$Vg,43:59,48:60,55:151,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,42:$Vg,43:59,48:60,55:152,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,42:$Vg,43:59,48:60,55:153,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,42:$Vg,43:59,48:60,55:155,69:54,87:154,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,42:$Vg,43:59,48:60,55:156,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{24:[1,157],83:$VC,84:$VD,85:$VE,86:$VF,88:$VG},{24:[1,158]},{22:[1,159],90:160},o($VM,[2,108]),o($VH,[2,87]),{4:112,6:3,8:4,9:5,10:6,11:7,12:8,13:9,14:14,18:12,20:$V0,26:11,27:$V1,32:19,33:$V2,37:10,38:$V3,39:13,40:$V4},o($VM,[2,109]),{96:[1,161],97:162,98:163,99:$VJ,101:[1,164]},o($VN,[2,97]),{22:$Vf,42:$Vg,43:59,48:60,55:165,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,24:[1,166],30:169,35:$VO,42:$Vg,43:59,48:60,55:99,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,116:167,117:$Vt,118:[1,168]},{42:[1,171]},{22:$Vf,30:169,35:$VO,42:$Vg,43:59,48:60,55:99,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,116:172,117:$Vt},{48:173,108:$Vj},{48:174,108:$Vj},o($Vs,[2,48],{17:23,61:$V7}),o($V8,[2,63],{67:175,62:[1,176],63:[1,177]}),o($VP,[2,65]),o($VP,[2,67],{70:[1,178]}),o($Vu,[2,78],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),o([5,19,24,50,61,64,82],[2,77],{62:$VK}),{31:179,60:$V9,62:$VK},o($VQ,[2,119]),o($VQ,[2,120]),{24:[1,180],62:$VA},o($Vz,[2,44]),o($Vz,[2,37],{113:$Vx}),o($Vz,[2,39],{113:$Vx}),{22:[1,181]},o($Vz,[2,40]),o($Vz,[2,41],{43:182,114:$Vb}),{22:$Vf,42:$Vg,43:59,48:60,55:183,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,23:184,42:$Vg,43:59,48:60,55:52,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vq,119:49,120:$Vr},o($VR,[2,23],{36:185,52:186,53:$VS,56:$VT,57:$VU,58:$VV}),o($VB,[2,131]),{21:191,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},o($VB,[2,134],{113:$Vx}),o($VB,[2,135]),o($VB,[2,137],{113:$Vx}),o($VB,[2,138]),o([5,19,24,34,44,50,53,56,57,58,60,61,62,64,81,82,83,85,88,96,99,100,101],[2,80],{84:$VD,86:$VF}),o([5,19,24,34,44,50,53,56,57,58,60,61,62,64,81,82,83,84,85,88,96,99,100,101],[2,81],{86:$VF}),o([5,19,24,34,44,50,53,56,57,58,60,61,62,64,81,82,85,88,96,99,100,101],[2,82],{83:$VC,84:$VD,86:$VF}),o($VH,[2,83]),{83:$VC,84:$VD,85:$VE,86:$VF,88:[1,192]},o($VW,[2,84],{83:$VC,84:$VD,85:$VE,86:$VF}),o($VH,[2,79]),o($VH,[2,99]),{4:112,6:3,8:4,9:5,10:6,11:7,12:8,13:9,14:14,18:12,20:$V0,22:$Vf,26:11,27:$V1,30:98,32:19,33:$V2,37:10,38:$V3,39:13,40:$V4,42:$Vg,43:59,45:193,48:60,55:99,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},o($VH,[2,86]),o($VH,[2,93]),{96:[1,194]},o($VN,[2,96]),{22:$Vf,42:$Vg,43:59,48:60,55:195,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG,100:[1,196]},o($VI,[2,123]),{24:[1,197]},{24:[1,198]},{24:[2,126],62:$VK},{22:$Vf,30:199,42:$Vg,43:59,48:60,55:99,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},o($VI,[2,117]),{24:[1,200]},o($V8,[2,61]),o($V8,[2,62]),o($V8,[2,64]),{42:$Vg,43:59,48:60,68:201,69:129,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{48:203,71:202,108:$Vj},o($VP,[2,68]),o($V5,[2,20]),{4:205,6:3,8:4,9:5,10:6,11:7,12:8,13:9,14:14,18:12,20:$V0,25:[1,204],26:11,27:$V1,32:19,33:$V2,37:10,38:$V3,39:13,40:$V4},{48:206,108:$Vj},o($Vz,[2,42],{113:$Vx}),o($VL,[2,129],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),{24:[1,207],62:$VA},o($VR,[2,25],{52:208,53:$VS,56:$VT,57:$VU,58:$VV}),o($VX,[2,49]),{21:209,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{53:[1,210]},{53:[1,211],56:[1,212],59:[1,213]},{53:[1,214],56:[1,215],59:[1,216]},o($VR,[2,24],{52:186,36:217,53:$VS,56:$VT,57:$VU,58:$VV}),{22:$Vf,42:$Vg,43:59,48:60,55:218,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{24:[1,219]},o($VH,[2,94]),{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG,96:[2,98]},{22:$Vf,42:$Vg,43:59,48:60,55:220,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},o($VI,[2,124]),o($VI,[2,125]),{24:[2,127],62:$VK},o($VI,[2,121]),o($VP,[2,66]),o($V8,[2,69],{72:221,75:[1,222]}),{73:[1,223],74:[1,224]},{21:225,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},o($V5,[2,18]),{24:[1,226]},{4:228,6:3,8:4,9:5,10:6,11:7,12:8,13:9,14:14,18:12,20:$V0,25:[1,227],26:11,27:$V1,32:19,33:$V2,37:10,38:$V3,39:13,40:$V4},o($VX,[2,50]),{54:[1,229]},{21:230,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{21:231,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{53:[1,232]},{53:[1,233]},{21:234,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{53:[1,235]},{53:[1,236]},o($VR,[2,26],{52:208,53:$VS,56:$VT,57:$VU,58:$VV}),o($VW,[2,92],{83:$VC,84:$VD,85:$VE,86:$VF}),o($VH,[2,85]),o($VN,[2,95],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),o($V8,[2,70]),{76:[1,237],78:[1,238]},o($VY,[2,71]),o($VY,[2,72]),o($V5,[2,17]),o($Vz,[2,43]),{21:239,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},o($V5,[2,32]),{22:$Vf,42:$Vg,43:59,48:60,55:240,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{54:[1,241]},{54:[1,242]},{21:243,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{21:244,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{54:[1,245]},{21:246,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{21:247,22:$Vc,28:41,42:$Vd,43:43,114:$Vb},{48:203,71:248,108:$Vj},{48:203,71:249,108:$Vj},o($V5,[2,31]),o($VX,[2,51],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),{22:$Vf,42:$Vg,43:59,48:60,55:250,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,42:$Vg,43:59,48:60,55:251,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{54:[1,252]},{54:[1,253]},{22:$Vf,42:$Vg,43:59,48:60,55:254,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{54:[1,255]},{54:[1,256]},{77:[1,257]},{77:[1,258]},o($VX,[2,52],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),o($VX,[2,53],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),{22:$Vf,42:$Vg,43:59,48:60,55:259,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,42:$Vg,43:59,48:60,55:260,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},o($VX,[2,54],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),{22:$Vf,42:$Vg,43:59,48:60,55:261,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},{22:$Vf,42:$Vg,43:59,48:60,55:262,69:54,90:56,91:$Vh,92:57,93:58,94:$Vi,102:61,103:62,104:63,105:64,106:65,107:66,108:$Vj,109:$Vk,110:$Vl,111:$Vm,112:$Vn,114:$Vo,115:$Vp,117:$Vt},o($V8,[2,73]),o($V8,[2,74]),o($VX,[2,55],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),o($VX,[2,57],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),o($VX,[2,56],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG}),o($VX,[2,58],{83:$VC,84:$VD,85:$VE,86:$VF,88:$VG})],
defaultActions: {21:[2,1],37:[2,33]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
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
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
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
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
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
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
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
}};

function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();

exports.parser = parser;