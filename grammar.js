// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	var BigNumber = require('bignumber.js');
	var moo = require("moo");

	var lexer = moo.compile({
		WS: /[ ]+/,
		digits: /[0-9]+/,
		string: /(?:"|')[\w\[\]\.\, \:\-+_\"\']+(?:"|')/,
		op: ["+", "-", "/", "*", '&&', '||', '^'],
		name: ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'min', 'max', 'pi', 'e', 'sqrt', 'ln', 'ceil', 'floor', 'round'],
		l: '(',
		r: ')',
		sl:'[',
		sr: ']',
		io: ['input', 'output'],
		data_feed: 'data_feed',
		comparisonOperators: ["==", ">=", "<=", "!=", ">", "<", "="],
		dfParamsName: ['oracles', 'feed_name', 'mci', 'feed_value', 'ifseveral', 'ifnone'],
		ioParamsName: ['address', 'amount', 'asset'],
		quote: '"',
		ternary: ['?', ':'],
		ioParamValue: /[\w\ \/=+]+/,
		comma: ',',
		dot: '.',
	});

	var origNext = lexer.next;

    lexer.next = function () {
		var tok = origNext.call(this);
		if (tok) {
			switch (tok.type) {
				case 'WS':
					return lexer.next();
			}
			return tok;
		}
		return undefined;
	};
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["comparison"], "postprocess": id},
    {"name": "ternary", "symbols": ["comparison", {"literal":"?"}, "AS", {"literal":":"}, "AS"], "postprocess": function(d) {return ['ternary', d[0], d[2], d[4]];}},
    {"name": "OR", "symbols": ["comparison2", {"literal":"||"}, "comparison"], "postprocess": function(d) {return ['or', d[0], d[2]];}},
    {"name": "AND", "symbols": ["comparison2", {"literal":"&&"}, "comparison"], "postprocess": function(d) {return ['and', d[0], d[2]];}},
    {"name": "concat", "symbols": ["string", {"literal":"+"}, "string"], "postprocess": function(d) {return ['concat', d[0], d[2]]}},
    {"name": "comparison", "symbols": ["AS", "comparisonOperators", "AS"], "postprocess": function(d) {return ['comparison', d[1], d[0], d[2]];}},
    {"name": "comparison", "symbols": ["string", "comparisonOperators", "string"], "postprocess": function(d) {return ['stringComparison', d[1], d[0], d[2]];}},
    {"name": "comparison", "symbols": ["AS", "comparisonOperators", "string"], "postprocess": function(d) {return ['stringComparison', d[1], d[0], d[2]];}},
    {"name": "comparison", "symbols": ["string", "comparisonOperators", "AS"], "postprocess": function(d) {return ['stringComparison', d[1], d[0], d[2]];}},
    {"name": "comparison", "symbols": ["AND"], "postprocess": id},
    {"name": "comparison", "symbols": ["OR"], "postprocess": id},
    {"name": "comparison", "symbols": ["AS"], "postprocess": id},
    {"name": "comparison", "symbols": ["ternary"], "postprocess": id},
    {"name": "comparison", "symbols": ["concat"], "postprocess": id},
    {"name": "comparison2", "symbols": ["AS", "comparisonOperators", "AS"], "postprocess": function(d) {return ['comparison', d[1], d[0], d[2]];}},
    {"name": "comparison2", "symbols": ["AS"], "postprocess": id},
    {"name": "comparisonOperators", "symbols": [(lexer.has("comparisonOperators") ? {type: "comparisonOperators"} : comparisonOperators)], "postprocess": function(d) { return d[0].value }},
    {"name": "P", "symbols": [(lexer.has("l") ? {type: "l"} : l), "comparison", (lexer.has("r") ? {type: "r"} : r)], "postprocess": function(d) {return d[1]; }},
    {"name": "P", "symbols": ["N"], "postprocess": id},
    {"name": "E", "symbols": ["P", {"literal":"^"}, "E"], "postprocess": function(d) {return ['^', d[0], d[2]]; }},
    {"name": "E", "symbols": ["P"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", {"literal":"*"}, "E"], "postprocess": function(d) {return ['*', d[0], d[2]]; }},
    {"name": "MD", "symbols": ["MD", {"literal":"/"}, "E"], "postprocess": function(d) {return ['/', d[0], d[2]]; }},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", {"literal":"+"}, "MD"], "postprocess": function(d) {return ['+', d[0], d[2]]; }},
    {"name": "AS", "symbols": ["AS", {"literal":"-"}, "MD"], "postprocess": function(d) {return ['-', d[0], d[2]]; }},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "N", "symbols": ["float"], "postprocess": id},
    {"name": "N", "symbols": [{"literal":"sin"}, "P"], "postprocess": function(d) {return ['sin', d[1]]; }},
    {"name": "N", "symbols": [{"literal":"cos"}, "P"], "postprocess": function(d) {return ['cos', d[1]]; }},
    {"name": "N", "symbols": [{"literal":"tan"}, "P"], "postprocess": function(d) {return ['tan', d[1]]; }},
    {"name": "N", "symbols": [{"literal":"asin"}, "P"], "postprocess": function(d) {return ['asin', d[1]]; }},
    {"name": "N", "symbols": [{"literal":"acos"}, "P"], "postprocess": function(d) {return ['acos', d[1]]; }},
    {"name": "N", "symbols": [{"literal":"atan"}, "P"], "postprocess": function(d) {return ['atan', d[1]]; }},
    {"name": "N", "symbols": [{"literal":"pi"}], "postprocess": function(d) {return ['pi']; }},
    {"name": "N", "symbols": [{"literal":"e"}], "postprocess": function(d) {return ['e']; }},
    {"name": "N", "symbols": [{"literal":"sqrt"}, "P"], "postprocess": function(d) {return ['sqrt', d[1]]; }},
    {"name": "N", "symbols": [{"literal":"ln"}, "P"], "postprocess": function(d) {return ['log', d[1]]; }},
    {"name": "N$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "N$ebnf$1$subexpression$1$ebnf$1", "symbols": ["N$ebnf$1$subexpression$1$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$ebnf$1$subexpression$1", "symbols": ["AS", "N$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "N$ebnf$1", "symbols": ["N$ebnf$1$subexpression$1"]},
    {"name": "N$ebnf$1$subexpression$2$ebnf$1", "symbols": []},
    {"name": "N$ebnf$1$subexpression$2$ebnf$1", "symbols": ["N$ebnf$1$subexpression$2$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$ebnf$1$subexpression$2", "symbols": ["AS", "N$ebnf$1$subexpression$2$ebnf$1"]},
    {"name": "N$ebnf$1", "symbols": ["N$ebnf$1", "N$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N", "symbols": [{"literal":"min"}, (lexer.has("l") ? {type: "l"} : l), "N$ebnf$1", (lexer.has("r") ? {type: "r"} : r)], "postprocess": function(d) {var params = d[2].map(function(v){return v[0]});return ['min', params]; }},
    {"name": "N$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "N$ebnf$2$subexpression$1$ebnf$1", "symbols": ["N$ebnf$2$subexpression$1$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$ebnf$2$subexpression$1", "symbols": ["AS", "N$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "N$ebnf$2", "symbols": ["N$ebnf$2$subexpression$1"]},
    {"name": "N$ebnf$2$subexpression$2$ebnf$1", "symbols": []},
    {"name": "N$ebnf$2$subexpression$2$ebnf$1", "symbols": ["N$ebnf$2$subexpression$2$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$ebnf$2$subexpression$2", "symbols": ["AS", "N$ebnf$2$subexpression$2$ebnf$1"]},
    {"name": "N$ebnf$2", "symbols": ["N$ebnf$2", "N$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N", "symbols": [{"literal":"max"}, (lexer.has("l") ? {type: "l"} : l), "N$ebnf$2", (lexer.has("r") ? {type: "r"} : r)], "postprocess": function(d) {var params = d[2].map(function(v){return v[0]});return ['max', params]; }},
    {"name": "N", "symbols": [{"literal":"ceil"}, "P"], "postprocess": function(d) {return ['ceil', d[1]]; }},
    {"name": "N", "symbols": [{"literal":"floor"}, "P"], "postprocess": function(d) {return ['floor', d[1]]; }},
    {"name": "N", "symbols": [{"literal":"round"}, "P"], "postprocess": function(d) {return ['round', d[1]]; }},
    {"name": "N$subexpression$1$ebnf$1", "symbols": []},
    {"name": "N$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "N$subexpression$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["N$subexpression$1$ebnf$1$subexpression$1$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "N$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": ["float"]},
    {"name": "N$subexpression$1$ebnf$1$subexpression$1", "symbols": ["N$subexpression$1$ebnf$1$subexpression$1$ebnf$1", (lexer.has("dfParamsName") ? {type: "dfParamsName"} : dfParamsName), (lexer.has("comparisonOperators") ? {type: "comparisonOperators"} : comparisonOperators), "N$subexpression$1$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "N$subexpression$1$ebnf$1", "symbols": ["N$subexpression$1$ebnf$1", "N$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$subexpression$1", "symbols": [(lexer.has("data_feed") ? {type: "data_feed"} : data_feed), (lexer.has("sl") ? {type: "sl"} : sl), "N$subexpression$1$ebnf$1", (lexer.has("sr") ? {type: "sr"} : sr)]},
    {"name": "N", "symbols": ["N$subexpression$1"], "postprocess":  function (d){
        var params = {};
        var arrParams = d[0][2];
        for(var i = 0; i < arrParams.length; i++){
        	var name = arrParams[i][1].value;
        	var operator = arrParams[i][2].value
        	var value = arrParams[i][3][0];
        
        	params[name] = {};
        	params[name]['operator'] = operator;
        	if(BigNumber.isBigNumber(value)){
        		params[name]['value'] = value;
        	}else{
        		params[name]['value'] = value.value.slice(1, -1);
        	}
        }
        return ['data_feed', params]
        }
        	},
    {"name": "N$subexpression$2$ebnf$1", "symbols": []},
    {"name": "N$subexpression$2$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "N$subexpression$2$ebnf$1$subexpression$1$ebnf$1", "symbols": ["N$subexpression$2$ebnf$1$subexpression$1$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$subexpression$2$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("ioParamValue") ? {type: "ioParamValue"} : ioParamValue)]},
    {"name": "N$subexpression$2$ebnf$1$subexpression$1$subexpression$1", "symbols": ["float"]},
    {"name": "N$subexpression$2$ebnf$1$subexpression$1", "symbols": ["N$subexpression$2$ebnf$1$subexpression$1$ebnf$1", (lexer.has("ioParamsName") ? {type: "ioParamsName"} : ioParamsName), (lexer.has("comparisonOperators") ? {type: "comparisonOperators"} : comparisonOperators), "N$subexpression$2$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "N$subexpression$2$ebnf$1", "symbols": ["N$subexpression$2$ebnf$1", "N$subexpression$2$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "N$subexpression$2", "symbols": [(lexer.has("io") ? {type: "io"} : io), (lexer.has("sl") ? {type: "sl"} : sl), "N$subexpression$2$ebnf$1", {"literal":"]"}]},
    {"name": "N", "symbols": ["N$subexpression$2", {"literal":"."}, (lexer.has("ioParamsName") ? {type: "ioParamsName"} : ioParamsName)], "postprocess":  function (d){
        var params = {};
        var arrParams = d[0][2];
        for(var i = 0; i < arrParams.length; i++){
        	var name = arrParams[i][1].value;
        	var operator = arrParams[i][2].value
        	var value = arrParams[i][3][0];
        
        	params[name] = {};
        	params[name]['operator'] = operator;
        	if(BigNumber.isBigNumber(value)){
        		params[name]['value'] = value;
        	}else{
        		params[name]['value'] = value.value;
        	}
        }
        return [d[0][0].value, params, d[2].value]
        }
        	},
    {"name": "float$ebnf$1", "symbols": []},
    {"name": "float$ebnf$1", "symbols": ["float$ebnf$1", {"literal":"-"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "float$ebnf$2", "symbols": []},
    {"name": "float$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, (lexer.has("digits") ? {type: "digits"} : digits)]},
    {"name": "float$ebnf$2", "symbols": ["float$ebnf$2", "float$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "float", "symbols": ["float$ebnf$1", (lexer.has("digits") ? {type: "digits"} : digits), "float$ebnf$2"], "postprocess":  function(d,l, reject) {
        	var number = d[0][0] ? '-' + d[1] : d[1];
        	if(d[2][0] && d[2][0][0].type === 'dot'){
        		if(d[2].length > 1){
        			return reject;
        		}else{
        			number = number + '.' + d[2][0][1].value;
        		}
        	}
        	return new BigNumber(number)
        }},
    {"name": "value", "symbols": ["AS"], "postprocess": id},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": function(d) {return d[0].value; }}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
