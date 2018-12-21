@{%
	var BigNumber = require('bignumber.js');
	var moo = require("moo");

    var lexer = moo.compile({
      WS: /[ ]+/,
      number: /[0-9]+/,
      string: /"[\w\[\]\.\, \:\-+_]+"/,
      op: ["+", "-", "/", "*", '&&', '||', '^'],
      name: ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'min', 'max', 'pi', 'e', 'sqrt', 'ln', 'ceil', 'floor', 'round'],
      l: '(',
      r: ')',
      sl:'[',
      sr: ']',
      io: ['input', 'output'],
      data_feed: 'data_feed',
      conditionals: ["==", ">=", "<=", "!=", ">", "<", "="],
      dfParamsName: ['oracles', 'feed_name', 'mci', 'feed_value', 'ifseveral', 'ifnone'],
      ioParamsName: ['address', 'amount', 'asset'],
      quote: '"',
      ternary: ['?', ':'],
      ioParamValue: /[\w\ \-\/=+]+/,
      comma: ',',
      dot: '.',
    });
%}

@lexer lexer

main -> sCondition {% id %}

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

P -> %l _ condition _ %r {% function(d) {return d[2]; } %}
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
    | "min" _ %l (_ AS _ ",":*):+ _ %r  {% function(d) {var params = d[3].map(function(v){return v[1]});return ['min', params]; }  %}
    | "max" _ %l (_ AS _ ",":*):+ _ %r  {% function(d) {var params = d[3].map(function(v){return v[1]});return ['max', params]; }  %}
    | "ceil" _ P    {% function(d) {return ['ceil', d[2]]; } %}
    | "floor" _ P    {% function(d) {return ['floor', d[2]]; } %}
    | "round" _ P    {% function(d) {return ['round', d[2]]; } %}
    | (%data_feed %sl ( [\, ]:* _ %dfParamsName _ %conditionals _ (%string|float) _ ):* %sr) {% function (d){
    	var params = {};
        for(var i = 0; i < d[0][2].length; i++){
        	params[d[0][2][i][2].value] = {};
        	params[d[0][2][i][2].value]['operator'] = d[0][2][i][4].value;
        	if(BigNumber.isBigNumber(d[0][2][i][6][0])){
        		params[d[0][2][i][2].value]['value'] = d[0][2][i][6][0].toString();
        	}else{
        		params[d[0][2][i][2].value]['value'] = d[0][2][i][6][0].value.slice(1, -1);
        	}
        }
    	return ['data_feed', params]
    	}
    %}
    | (%io %sl ( [\, ]:* _ %ioParamsName _ %conditionals _ (%ioParamValue|float) _):* "]" ) "." ("asset"|"amount"|"address") {% function (d){
    	var params = {};
        for(var i = 0; i < d[0][2].length; i++){
        	params[d[0][2][i][2].value] = {};
        	params[d[0][2][i][2].value]['operator'] = d[0][2][i][4].value;
        	if(BigNumber.isBigNumber(d[0][2][i][6][0])){
        		params[d[0][2][i][2].value]['value'] = d[0][2][i][6][0].toString();

        	}else{
        		params[d[0][2][i][2].value]['value'] = d[0][2][i][6][0].value;
        	}
        }
    	return [d[0][0].value, params, d[2][0].value]
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
_ -> %WS:*     {% function(d) {return null; } %}