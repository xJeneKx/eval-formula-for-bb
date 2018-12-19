// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	var BigNumber = require('bignumber.js');
	var moo = require("moo");

    var lexer = moo.compile({
      WS: /[ ]+/,
      number: /[0-9]+/,
      string: /"[\w\[\]\.\, \:\-+_]+"/,
      op: ["+", "-", "/", "*", '&&', '||', '^'],
      name: ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'min', 'max', 'pi', 'e', 'sqrt', 'ln', 'ceil', 'floor', 'round', 'input', 'output','data_feed'],
      l: '(',
      r: ')',
      sl:'[',
      sr: ']',
      comma: ',',
      dot: '.',
      conditionals: ["==", ">=", "<=", "!=", ">", "<", "="],
      dfParams: ['oracles', 'feed_name', 'mci', 'feed_value', 'ifseveral', 'ifnone'],
      ioParams: ['address', 'amount', 'asset'],
      quote: '"',
      ternary: ['?', ':'],
      ioParamValue: /[a-zA-Z\ \-\/=]+/
    });
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["sCondition"], "postprocess": id},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1", "symbols": []},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$ebnf$1", /[\, ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"!="}]},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":">="}]},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"<="}]},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":">"}]},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"<"}]},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"="}]},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1", "symbols": ["dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$ebnf$1", (lexer.has("dfParams") ? {type: "dfParams"} : dfParams), "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "valueInDF"]},
    {"name": "dataFeedMatch$subexpression$1$ebnf$1", "symbols": ["dataFeedMatch$subexpression$1$ebnf$1", "dataFeedMatch$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dataFeedMatch$subexpression$1", "symbols": [{"literal":"data_feed"}, {"literal":"["}, "dataFeedMatch$subexpression$1$ebnf$1", {"literal":"]"}]},
    {"name": "dataFeedMatch", "symbols": ["dataFeedMatch$subexpression$1"], "postprocess": id},
    {"name": "paramName", "symbols": ["_", {"literal":"oracles"}]},
    {"name": "paramName", "symbols": [{"literal":"feed_name"}]},
    {"name": "paramName", "symbols": [{"literal":"mci"}]},
    {"name": "paramName", "symbols": [{"literal":"feed_value"}]},
    {"name": "paramName", "symbols": [{"literal":"ifseveral"}]},
    {"name": "paramName", "symbols": [{"literal":"ifnone"}, "_"], "postprocess": function(d) {return d[1]; }},
    {"name": "valueInDF", "symbols": ["_", (lexer.has("string") ? {type: "string"} : string), "_"], "postprocess": function(d) {return d[1].value}},
    {"name": "inputAndOutputMatch$subexpression$1$subexpression$1", "symbols": [{"literal":"input"}]},
    {"name": "inputAndOutputMatch$subexpression$1$subexpression$1", "symbols": [{"literal":"output"}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1", "symbols": []},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$ebnf$1", /[\,]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"address"}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"amount"}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"asset"}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$2", "symbols": [{"literal":"!="}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$2", "symbols": [{"literal":">="}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$2", "symbols": [{"literal":"<="}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$2", "symbols": [{"literal":">"}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$2", "symbols": [{"literal":"<"}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$2", "symbols": [{"literal":"="}]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1", "symbols": ["inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "_", "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "_", "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1$subexpression$2", "_", "valueInIO", "_"]},
    {"name": "inputAndOutputMatch$subexpression$1$ebnf$1", "symbols": ["inputAndOutputMatch$subexpression$1$ebnf$1", "inputAndOutputMatch$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "inputAndOutputMatch$subexpression$1", "symbols": ["inputAndOutputMatch$subexpression$1$subexpression$1", {"literal":"["}, "inputAndOutputMatch$subexpression$1$ebnf$1", {"literal":"]"}]},
    {"name": "inputAndOutputMatch", "symbols": ["inputAndOutputMatch$subexpression$1"], "postprocess": id},
    {"name": "ternary", "symbols": ["sCondition", {"literal":"?"}, "sAS", {"literal":":"}, "sAS"], "postprocess": function(d) {return ['ternary', d[0], d[2], d[4]];}},
    {"name": "sCondition", "symbols": ["_", "condition", "_"], "postprocess": function(d) {return d[1];}},
    {"name": "sAS", "symbols": ["_", "AS", "_"], "postprocess": function(d) {return d[1];}},
    {"name": "OR", "symbols": ["condition2", "_", {"literal":"||"}, "_", "condition"], "postprocess": function(d) {return ['or', d[0], d[4]];}},
    {"name": "AND", "symbols": ["condition2", "_", {"literal":"&&"}, "_", "condition"], "postprocess": function(d) {return ['and', d[0], d[4]];}},
    {"name": "concat", "symbols": ["string", "_", {"literal":"+"}, "_", "string"], "postprocess": function(d) {return ['concat', d[0], d[4]]}},
    {"name": "condition", "symbols": ["AS", "_", "conditional", "_", "AS"], "postprocess": function(d) {return ['condition', d[2], d[0], d[4]];}},
    {"name": "condition", "symbols": ["string", "_", {"literal":"=="}, "_", "string"], "postprocess": function(d) {return ['stringCondition', '==', d[0], d[4]];}},
    {"name": "condition", "symbols": ["string", "_", {"literal":"!="}, "_", "string"], "postprocess": function(d) {return ['stringCondition', '!=', d[0], d[4]];}},
    {"name": "condition", "symbols": ["condition", "_", {"literal":"=="}, "_", "string"], "postprocess": function(d) {return ['stringCondition', '==', d[0], d[4]];}},
    {"name": "condition", "symbols": ["condition", "_", {"literal":"!="}, "_", "string"], "postprocess": function(d) {return ['stringCondition', '!=', d[0], d[4]];}},
    {"name": "condition", "symbols": ["AND"], "postprocess": id},
    {"name": "condition", "symbols": ["OR"], "postprocess": id},
    {"name": "condition", "symbols": ["AS"], "postprocess": id},
    {"name": "condition", "symbols": ["ternary"], "postprocess": id},
    {"name": "condition", "symbols": ["concat"], "postprocess": id},
    {"name": "condition2", "symbols": ["AS", "_", "conditional", "_", "AS"], "postprocess": function(d) {return ['condition', d[2], d[0], d[4]];}},
    {"name": "condition2", "symbols": ["AS"], "postprocess": id},
    {"name": "conditional", "symbols": ["_", (lexer.has("conditionals") ? {type: "conditionals"} : conditionals), "_"], "postprocess": function(d) { return d[1].value }},
    {"name": "P", "symbols": [{"literal":"("}, "_", "condition", "_", {"literal":")"}], "postprocess": function(d) {return d[2]; }},
    {"name": "P", "symbols": ["N"], "postprocess": id},
    {"name": "E", "symbols": ["P", "_", {"literal":"^"}, "_", "E"], "postprocess": function(d) {return ['^', d[0], d[4]]; }},
    {"name": "E", "symbols": ["P"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"*"}, "_", "E"], "postprocess": function(d) {return ['*', d[0], d[4]]; }},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"/"}, "_", "E"], "postprocess": function(d) {return ['/', d[0], d[4]]; }},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "MD"], "postprocess": function(d) {return ['+', d[0], d[4]]; }},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "MD"], "postprocess": function(d) {return ['-', d[0], d[4]]; }},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "N", "symbols": ["float"], "postprocess": id},
    {"name": "N", "symbols": [{"literal":"sin"}, "_", "P"], "postprocess": function(d) {return ['sin', d[2]]; }},
    {"name": "N", "symbols": [{"literal":"cos"}, "_", "P"], "postprocess": function(d) {return ['cos', d[2]]; }},
    {"name": "N", "symbols": [{"literal":"tan"}, "_", "P"], "postprocess": function(d) {return ['tan', d[2]]; }},
    {"name": "N", "symbols": [{"literal":"asin"}, "_", "P"], "postprocess": function(d) {return ['asin', d[2]]; }},
    {"name": "N", "symbols": [{"literal":"acos"}, "_", "P"], "postprocess": function(d) {return ['acos', d[2]]; }},
    {"name": "N", "symbols": [{"literal":"atan"}, "_", "P"], "postprocess": function(d) {return ['atan', d[2]]; }},
    {"name": "N", "symbols": [{"literal":"pi"}], "postprocess": function(d) {return ['pi']; }},
    {"name": "N", "symbols": [{"literal":"e"}], "postprocess": function(d) {return ['e']; }},
    {"name": "N", "symbols": [{"literal":"sqrt"}, "_", "P"], "postprocess": function(d) {return ['sqrt', d[2]]; }},
    {"name": "N", "symbols": [{"literal":"ln"}, "_", "P"], "postprocess": function(d) {return ['log', d[2]]; }},
    {"name": "N$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "N$ebnf$1$subexpression$1$ebnf$1", "symbols": ["N$ebnf$1$subexpression$1$ebnf$1", {"literal":","}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$ebnf$1$subexpression$1", "symbols": ["_", "AS", "_", "N$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "N$ebnf$1", "symbols": ["N$ebnf$1$subexpression$1"]},
    {"name": "N$ebnf$1$subexpression$2$ebnf$1", "symbols": []},
    {"name": "N$ebnf$1$subexpression$2$ebnf$1", "symbols": ["N$ebnf$1$subexpression$2$ebnf$1", {"literal":","}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$ebnf$1$subexpression$2", "symbols": ["_", "AS", "_", "N$ebnf$1$subexpression$2$ebnf$1"]},
    {"name": "N$ebnf$1", "symbols": ["N$ebnf$1", "N$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N", "symbols": [{"literal":"min"}, "_", {"literal":"("}, "N$ebnf$1", "_", {"literal":")"}], "postprocess": function(d) {var params = d[3].map(function(v){return v[1]});return ['min', params]; }},
    {"name": "N$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "N$ebnf$2$subexpression$1$ebnf$1", "symbols": ["N$ebnf$2$subexpression$1$ebnf$1", {"literal":","}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$ebnf$2$subexpression$1", "symbols": ["_", "AS", "_", "N$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "N$ebnf$2", "symbols": ["N$ebnf$2$subexpression$1"]},
    {"name": "N$ebnf$2$subexpression$2$ebnf$1", "symbols": []},
    {"name": "N$ebnf$2$subexpression$2$ebnf$1", "symbols": ["N$ebnf$2$subexpression$2$ebnf$1", {"literal":","}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$ebnf$2$subexpression$2", "symbols": ["_", "AS", "_", "N$ebnf$2$subexpression$2$ebnf$1"]},
    {"name": "N$ebnf$2", "symbols": ["N$ebnf$2", "N$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N", "symbols": [{"literal":"max"}, "_", {"literal":"("}, "N$ebnf$2", "_", {"literal":")"}], "postprocess": function(d) {var params = d[3].map(function(v){return v[1]});return ['max', params]; }},
    {"name": "N", "symbols": [{"literal":"ceil"}, "_", "P"], "postprocess": function(d) {return ['ceil', d[2]]; }},
    {"name": "N", "symbols": [{"literal":"floor"}, "_", "P"], "postprocess": function(d) {return ['floor', d[2]]; }},
    {"name": "N", "symbols": [{"literal":"round"}, "_", "P"], "postprocess": function(d) {return ['round', d[2]]; }},
    {"name": "N", "symbols": ["dataFeedMatch"], "postprocess":  function (d){
        var params = {};
                for(var i = 0; i < d[0][2].length; i++){
                	params[d[0][2][i][1].value] = {};
                	params[d[0][2][i][1].value]['operator'] = d[0][2][i][2][0].value;
                	params[d[0][2][i][1].value]['value'] = d[0][2][i][3].substr(1).substr(0, d[0][2][i][3].length - 2);
                }
        return ['data_feed', params]
        }
            },
    {"name": "N$subexpression$1", "symbols": [{"literal":"asset"}]},
    {"name": "N$subexpression$1", "symbols": [{"literal":"amount"}]},
    {"name": "N$subexpression$1", "symbols": [{"literal":"address"}]},
    {"name": "N", "symbols": ["inputAndOutputMatch", {"literal":"."}, "N$subexpression$1"], "postprocess":  function (d){
        var params = {};
                for(var i = 0; i < d[0][2].length; i++){
                	params[d[0][2][i][2][0].value] = {};
                	params[d[0][2][i][2][0].value]['operator'] = d[0][2][i][4][0].value;
                	params[d[0][2][i][2][0].value]['value'] = d[0][2][i][6];
                }
        return [d[0][0][0].value, params, d[2][0].value]
        }
            },
    {"name": "float$ebnf$1", "symbols": []},
    {"name": "float$ebnf$1", "symbols": ["float$ebnf$1", {"literal":"-"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "float$ebnf$2", "symbols": []},
    {"name": "float$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, (lexer.has("number") ? {type: "number"} : number)]},
    {"name": "float$ebnf$2", "symbols": ["float$ebnf$2", "float$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "float", "symbols": ["float$ebnf$1", (lexer.has("number") ? {type: "number"} : number), "float$ebnf$2"], "postprocess":  function(d,l, reject) {
        var number = d[0][0] ? '-' + d[1] : d[1];
        if(d[2][0] && d[2][0][0].type === 'dot'){
        	if(d[2].length > 1 || d[2][0][1].type !== 'number'){
        		return reject;
        	}else{
        		number = number + '.' + d[2][0][1].value;
        	}
        }
        return new BigNumber(number)} },
    {"name": "value", "symbols": ["AS"], "postprocess": id},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": function(d) {return d[0].value; }},
    {"name": "valueInIO$ebnf$1", "symbols": [/[\w\s+\-\/=]/]},
    {"name": "valueInIO$ebnf$1", "symbols": ["valueInIO$ebnf$1", /[\w\s+\-\/=]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "valueInIO", "symbols": ["valueInIO$ebnf$1"], "postprocess": function(d) {return d[0].join("").trim(); }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null; }}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
