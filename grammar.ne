@{%
	var BigNumber = require('bignumber.js');
%}

main -> _ condition _ {% function(d) {return d[1]; } %}

dataFeedMatch -> ("data_feed[" ( [\,]:* _ ("oracles"|"feed_name"|"mci"|"feed_value"|"ifseveral"|"ifnone") _ ("!="|">="|"<="|">"|"<"|"=") _ valueInDF _):* "]") {% id %}
inputAndOutputMatch -> (("input"|"output") "[" ( [\,]:* _ ("address"|"amount"|"asset") _ ("!="|">="|"<="|">"|"<"|"=") _ valueInIO _):* "]") {% id %}

IFELSE -> _ condition _ "?" _ AS _ ":" _ AS {% function(d) {return ['ifelse', d[1], d[5], d[9]];}%}

OR -> condition2 _ "||" _ condition {% function(d) {return ['or', d[0], d[4]];}%}

AND -> condition2 _ "&&" _ condition {% function(d) {return ['and', d[0], d[4]];}%}

condition -> AS _ conditional _ AS {% function(d) {return ['condition', d[2], d[0], d[4]];}%}
 			| string _ "==" _ string {% function(d) {return ['stringCondition', '==', d[0], d[4]];} %}
 			| string _ "!=" _ string {% function(d) {return ['stringCondition', '!=', d[0], d[4]];} %}
			| AND {% id %}
			| OR {% id %}
			| AS {% id %}
			| IFELSE {% id %}

condition2 -> AS _ conditional _ AS {% function(d) {return ['condition', d[2], d[0], d[4]];}%}
	| AS {% id %}

conditionals -> "==" | ">=" | "<=" | "!=" | ">" | "<"
conditional -> conditionals {% function(d) { return d[0][0] } %}

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
    | "min(" _ ([0-9\,\s]:+) _ ")"  {% function(d) {var params = d[2][0].join('').split(','); return ['min', params]; }  %}
    | "max(" _ ([0-9\,\s]:+) _ ")"  {% function(d) {var params = d[2][0].join('').split(','); return ['max', params]; }  %}
    | "ceil" _ P    {% function(d) {return ['ceil', d[2]]; } %}
    | "floor" _ P    {% function(d) {return ['floor', d[2]]; } %}
    | "round" _ P    {% function(d) {return ['round', d[2]]; } %}
    | dataFeedMatch {% function (d){
    	var params = {};
        for(var i = 0; i < d[0][1].length; i++){
        	params[d[0][1][i][2][0]] = {};
        	params[d[0][1][i][2][0]]['operator'] = d[0][1][i][4][0];
        	params[d[0][1][i][2][0]]['value'] = d[0][1][i][6];
        }
    	return ['datafeed', params]
    	}
    %}
    | inputAndOutputMatch "." ("asset"|"amount"|"address") {% function (d){
    	var params = {};
        for(var i = 0; i < d[0][2].length; i++){
        	params[d[0][2][i][2][0]] = {};
        	params[d[0][2][i][2][0]]['operator'] = d[0][2][i][4][0];
        	params[d[0][2][i][2][0]]['value'] = d[0][2][i][6];
        }
    	return [d[0][0][0], params, d[2][0]]
    	}
    %}

float ->
      int "." int   {% function(d) {return new BigNumber(d[0] + d[1] + d[2])} %}
	| int           {% function(d) {return new BigNumber(d[0])} %}

value -> AS {% id %}
int -> [0-9]:+        {% function(d) {return d[0].join(""); } %}
string -> "\"" [\w\s]:+ "\""        {% function(d) {return d[1].join("").trim(); } %}
valueInDF -> "\"" [\w\[\]\.\,\s\:]:+ "\""        {% function(d) {return d[1].join("").trim(); } %}
valueInIO-> [\w ]:+       {% function(d) {return d[0].join("").trim(); } %}
_ -> [\s]:*     {% function(d) {return null; } %}