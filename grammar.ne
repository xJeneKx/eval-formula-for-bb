@{%
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
%}

@lexer lexer

main -> sCondition {% id %}

dataFeedMatch -> ("data_feed" "[" ( [\, ]:* %dfParams ("!="|">="|"<="|">"|"<"|"=") valueInDF ):* "]") {% id %}
paramName -> _ "oracles"|"feed_name"|"mci"|"feed_value"|"ifseveral"|"ifnone" _ {% function(d) {return d[1]; } %}
valueInDF -> _ %string _       {% function(d) {return d[1].value} %}

inputAndOutputMatch -> (("input"|"output") "[" ( [\,]:* _ ("address"|"amount"|"asset") _ ("!="|">="|"<="|">"|"<"|"=") _ valueInIO _):* "]") {% id %}

ternary -> sCondition "?" sAS ":" sAS {% function(d) {return ['ternary', d[0], d[2], d[4]];}%}

sCondition -> _ condition _ {% function(d) {return d[1];}%}
sAS -> _ AS _ {% function(d) {return d[1];}%}

OR -> condition2 _ "||" _ condition {% function(d) {return ['or', d[0], d[4]];}%}

AND -> condition2 _ "&&" _ condition {% function(d) {return ['and', d[0], d[4]];}%}

concat -> string _ "+" _ string {% function(d) {return ['concat', d[0], d[4]]}%}

condition -> AS _ conditional _ AS {% function(d) {return ['condition', d[2], d[0], d[4]];}%}
 			| string _ "==" _ string {% function(d) {return ['stringCondition', '==', d[0], d[4]];} %}
 			| string _ "!=" _ string {% function(d) {return ['stringCondition', '!=', d[0], d[4]];} %}
 			| condition _ "==" _ string {% function(d) {return ['stringCondition', '==', d[0], d[4]];} %}
 			| condition _ "!=" _ string {% function(d) {return ['stringCondition', '!=', d[0], d[4]];} %}
			| AND {% id %}
			| OR {% id %}
			| AS {% id %}
			| ternary {% id %}
			| concat {% id %}

condition2 -> AS _ conditional _ AS {% function(d) {return ['condition', d[2], d[0], d[4]];}%}
	| AS {% id %}

conditional -> _ %conditionals _ {% function(d) { return d[1].value } %}

P -> "(" _ condition _ ")" {% function(d) {return d[2]; } %}
    | N      {% id %}

E -> P _ "^" _ E    {% function(d) {return ['^', d[0], d[4]]; } %}
    | P             {% id %}

MD -> MD _ "*" _ E  {% function(d) {return ['*', d[0], d[4]]; } %}
    | MD _ "/" _ E  {% function(d) {return ['/', d[0], d[4]]; } %}
    | E             {% id %}

AS -> AS _ "+" _ MD {% function(d) {return ['+', d[0], d[4]]; } %}
    | AS _ "-" _ MD {% function(d) {return ['-', d[0], d[4]]; } %}
    | MD            {% id %}

N -> float          {% id %}
    | "sin" _ P     {% function(d) {return ['sin', d[2]]; } %}
    | "cos" _ P     {% function(d) {return ['cos', d[2]]; } %}
    | "tan" _ P     {% function(d) {return ['tan', d[2]]; } %}

    | "asin" _ P    {% function(d) {return ['asin', d[2]]; } %}
    | "acos" _ P    {% function(d) {return ['acos', d[2]]; } %}
    | "atan" _ P    {% function(d) {return ['atan', d[2]]; } %}

    | "pi"          {% function(d) {return ['pi']; } %}
    | "e"           {% function(d) {return ['e']; } %}
    | "sqrt" _ P    {% function(d) {return ['sqrt', d[2]]; } %}
    | "ln" _ P      {% function(d) {return ['log', d[2]]; }  %}
    | "min" _ "(" (_ AS _ ",":*):+ _ ")"  {% function(d) {var params = d[3].map(function(v){return v[1]});return ['min', params]; }  %}
    | "max" _ "(" (_ AS _ ",":*):+ _ ")"  {% function(d) {var params = d[3].map(function(v){return v[1]});return ['max', params]; }  %}
    | "ceil" _ P    {% function(d) {return ['ceil', d[2]]; } %}
    | "floor" _ P    {% function(d) {return ['floor', d[2]]; } %}
    | "round" _ P    {% function(d) {return ['round', d[2]]; } %}
    | dataFeedMatch {% function (d){
    	var params = {};
        for(var i = 0; i < d[0][2].length; i++){
        	params[d[0][2][i][1].value] = {};
        	params[d[0][2][i][1].value]['operator'] = d[0][2][i][2][0].value;
        	params[d[0][2][i][1].value]['value'] = d[0][2][i][3].substr(1).substr(0, d[0][2][i][3].length - 2);
        }
    	return ['data_feed', params]
    	}
    %}
    | inputAndOutputMatch "." ("asset"|"amount"|"address") {% function (d){
    	var params = {};
        for(var i = 0; i < d[0][2].length; i++){
        	params[d[0][2][i][2][0].value] = {};
        	params[d[0][2][i][2][0].value]['operator'] = d[0][2][i][4][0].value;
        	params[d[0][2][i][2][0].value]['value'] = d[0][2][i][6];
        }
    	return [d[0][0][0].value, params, d[2][0].value]
    	}
    %}

float -> "-":* %number ("." %number):*         {% function(d,l, reject) {
var number = d[0][0] ? '-' + d[1] : d[1];
if(d[2][0] && d[2][0][0].type === 'dot'){
	if(d[2].length > 1 || d[2][0][1].type !== 'number'){
		return reject;
	}else{
		number = number + '.' + d[2][0][1].value;
	}
}
return new BigNumber(number)} %}

value -> AS {% id %}
string -> %string        {% function(d) {return d[0].value; } %}
valueInIO-> [\w\s+\-\/=]:+       {% function(d) {return d[0].join("").trim(); } %}
_ -> %WS:*     {% function(d) {return null; } %}