var nearley = require("nearley");
var grammar = require("./grammar.js");
var BigNumber = require('bignumber.js');
var async = require('async');
var ValidationUtils = require("byteballcore/validation_utils.js");
var constants = require('byteballcore/constants');

BigNumber.config({EXPONENTIAL_AT: [-30, 30], POW_PRECISION: 100, RANGE: 100});

exports.validate = function (formula, complexity, callback) {
	complexity++;
	var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	try {
		parser.feed(formula);
	} catch (e) {
		return callback({error: 'Incorrect formula', complexity});
	}
	var error = false;
	
	function evaluate(arr, cb) {
		if (error) return;
		var op = arr[0];
		switch (op) {
			case '+':
			case '-':
			case '*':
			case '/':
			case '^':
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						cb2(true);
					} else {
						evaluate(param, function (res) {
							cb2(res);
						});
					}
				}, function (result) {
					cb(result);
				});
				break;
			case 'sin':
			case 'cos':
			case 'tan':
			case 'asin':
			case 'acos':
			case 'atan':
			case 'log':
			case 'sqrt':
			case 'ceil':
			case 'floor':
			case 'round':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(res);
					});
				}
				break;
			case 'min':
			case 'max':
			case 'pi':
				cb(true);
				break;
			case 'and':
			case 'or':
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						cb2(true);
					} else {
						evaluate(param, function (res) {
							cb2(res);
						});
					}
				}, function (result) {
					cb(result);
				});
				break;
			case 'comparison':
				async.eachSeries([arr[2]], function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						cb2(true);
					} else {
						evaluate(param, function (res) {
							cb2(res);
						});
					}
				}, function (result) {
					if(!result) return cb(false);
					async.eachSeries([arr[3]], function (arr3, cb2) {
						if (BigNumber.isBigNumber(arr3)) {
							cb2(true);
						} else {
							evaluate(arr3, function (res) {
								cb2(res);
							});
						}
					}, function (result2) {
						cb(result2);
					});
				});
				break;
			case 'stringComparison':
				async.eachSeries([arr[2]], function (param, cb2) {
					if (typeof param === 'string') {
						cb2(true);
					} else {
						evaluate(param, function (res) {
							cb2(res);
						});
					}
				}, function (result) {
					if(!result) return cb(false);
					async.eachSeries([arr[3]], function (arr3, cb2) {
						if (typeof arr3 === 'string') {
							cb2(true);
						} else {
							evaluate(arr3, function (res) {
								cb2(res);
							});
						}
					}, function (result2) {
						cb(result2);
					});
				});
				break;
			case 'ternary':
				async.eachSeries([arr[1]], function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						cb2(true);
					} else if (typeof param === 'boolean') {
						cb2(true);
					} else {
						evaluate(param, function (res) {
							cb2(res);
						});
					}
				}, function (result) {
					if(!result) return cb(false);
					async.eachSeries([arr[2]], function (arr3, cb3) {
						if (BigNumber.isBigNumber(arr3)) {
							cb3(true);
						} else {
							evaluate(arr3, function (res) {
								cb3(res);
							});
						}
					}, function (result2) {
						cb(result2);
					})
				});
				break;
			case 'e':
				cb(true);
				break;
			case 'data_feed':
				var result = validDataFeed(arr[1], complexity);
				complexity = result.complexity;
				if (!result.error) {
					cb(true);
				} else {
					error = true;
					cb(false);
				}
				break;
			case 'input':
			case 'output':
				if (validInputAndOutput(arr[1])) {
					cb(true);
				} else {
					error = true;
					cb(false);
				}
				break;
			case 'concat':
				cb(true);
				break;
			default:
				if (BigNumber.isBigNumber(arr[0])) return cb(true);
				if (typeof arr[0] === 'boolean') return cb(true);
				error = true;
				cb(false);
				break;
		}
	}
	
	if (parser.results[0]) {
		evaluate(parser.results[0], res => {
			callback({complexity, error: !res});
		});
	} else {
		callback({error: true, complexity});
	}
};

function validInputAndOutput(params) {
	if (!Object.keys(params).length) return false;
	for (var k in params) {
		var operator = params[k].operator;
		var value = params[k].value;
		if (value.substr(-1) === ",") value = value.substr(0, value.length - 1);
		switch (k) {
			case 'address':
				if (operator !== '=' && operator !== '!=') return false;
				if (!(value === 'this address' || value === 'other address' || ValidationUtils.isValidAddress(value))) return false;
				break;
			case 'amount':
				if (!(/^\d+$/.test(value) && ValidationUtils.isPositiveInteger(parseInt(value)))) return false;
				break;
			case 'asset':
				if (operator !== '=' && operator !== '!=') return false;
				if (!(value === 'base' || ValidationUtils.isValidBase64(value, constants.HASH_LENGTH))) return false;
				break;
			default:
				return false;
		}
	}
	return true;
}

function validDataFeed(arr, complexity) {
	if (arr['oracles'] && arr['feed_name']) {
		for (var k in arr) {
			var operator = arr[k].operator;
			var value = arr[k].value;
			switch (k) {
				case 'oracles':
					if (operator !== '=') return {error: true, complexity};
					var addresses = value.split(':');
					if (addresses.length === 0) return {error: true, complexity};
					complexity += addresses.length;
					if (!addresses.every(function (address) {
						return ValidationUtils.isValidAddress(address) || address === 'this address';
					})) return {error: true, complexity};
					break;
				
				case 'feed_name':
					if (!(operator === '=')) return {error: true, complexity};
					break;
				
				case 'mci':
					if (!(/^\d+$/.test(value) && ValidationUtils.isNonnegativeInteger(parseInt(value)))) return {
						error: true,
						complexity
					};
					break;
				
				case 'feed_value':
					break;
				case 'ifseveral':
					if (!(value === 'first' || value === 'last' || value === 'abort')) return {error: true, complexity};
					break;
				case 'ifnone':
					if (!(operator === '=')) return {error: true, complexity};
					break;
				default:
					return {error: true, complexity};
			}
		}
		return {error: false, complexity};
	} else {
		return {error: true, complexity};
	}
}

exports.evaluate = function (formula, conn, messages, objValidationState, address, callback) {
	var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	parser.feed(formula);
	
	function evaluate(arr, cb) {
		var op = arr[0];
		switch (op) {
			case '+':
				var prevV;
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						if (prevV === undefined) {
							prevV = param;
						} else  {
							prevV = param.plus(prevV);
						}
						cb2(null, prevV);
					} else {
						evaluate(param, function (res) {
							if (prevV === undefined) {
								prevV = res;
							} else {
								prevV = res.plus(prevV);
							}
							cb2(null, prevV);
						});
					}
				}, function () {
					cb(prevV);
				});
				break;
			case '-':
				var prevV;
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						if (prevV === undefined) {
							prevV = param;
						} else {
							prevV = prevV.minus(param);
						}
						cb2(null, prevV);
					} else {
						evaluate(param, function (res) {
							if (prevV === undefined) {
								prevV = res;
							} else {
								prevV = prevV.minus(res);
							}
							cb2(null, prevV);
						});
					}
				}, function () {
					cb(prevV);
				});
				break;
			case '*':
				var prevV;
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						if (prevV === undefined) {
							prevV = param;
						} else {
							prevV = param.times(prevV);
						}
						cb2(null, prevV);
					} else {
						evaluate(param, function (res) {
							if (prevV === undefined) {
								prevV = res;
							} else {
								prevV = res.times(prevV);
							}
							cb2(null, prevV);
						});
					}
				}, function () {
					cb(prevV);
				});
				break;
			case '/':
				var prevV;
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						if (prevV === undefined) {
							prevV = param;
						} else {
							prevV = prevV.div(param);
						}
						cb2(null, prevV);
					} else {
						evaluate(param, function (res) {
							if (prevV === undefined) {
								prevV = res;
							} else {
								prevV = prevV.div(res);
							}
							cb2(null, prevV);
						});
					}
				}, function () {
					cb(prevV);
				});
				break;
			case '^':
				var prevV;
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						if (prevV === undefined) {
							prevV = param;
						} else {
							prevV = prevV.pow(param);
						}
						cb2(null, prevV);
					} else {
						evaluate(param, function (res) {
							if (prevV === undefined) {
								prevV = res;
							} else {
								prevV = prevV.pow(res);
							}
							cb2(null, prevV);
						});
					}
				}, function () {
					cb(prevV);
				});
				break;
			case 'sin':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(new BigNumber(Math.sin(arr[1].toNumber())));
				} else {
					evaluate(arr[1], function (res) {
						cb(new BigNumber(Math.sin(res.toNumber())));
					});
				}
				break;
			case 'cos':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(new BigNumber(Math.cos(arr[1].toNumber())));
				} else {
					evaluate(arr[1], function (res) {
						cb(new BigNumber(Math.cos(res.toNumber())));
					});
				}
				break;
			case 'tan':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(new BigNumber(Math.tan(arr[1].toNumber())));
				} else {
					evaluate(arr[1], function (res) {
						cb(new BigNumber(Math.tan(res.toNumber())));
					});
				}
				break;
			case 'asin':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(new BigNumber(Math.asin(arr[1].toNumber())));
				} else {
					evaluate(arr[1], function (res) {
						cb(new BigNumber(Math.asin(res.toNumber())));
					});
				}
				break;
			case 'acos':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(new BigNumber(Math.acos(arr[1].toNumber())));
				} else {
					evaluate(arr[1], function (res) {
						cb(new BigNumber(Math.acos(res.toNumber())));
					});
				}
				break;
			case 'atan':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(new BigNumber(Math.atan(arr[1].toNumber())));
				} else {
					evaluate(arr[1], function (res) {
						cb(new BigNumber(Math.atan(res.toNumber())));
					});
				}
				break;
			case 'log':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(new BigNumber(Math.log(arr[1].toNumber())));
				} else {
					evaluate(arr[1], function (res) {
						cb(new BigNumber(Math.log(res.toNumber())));
					});
				}
				break;
			case 'sqrt':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(arr[1].sqrt());
				} else {
					evaluate(arr[1], function (res) {
						cb(res.sqrt());
					});
				}
				break;
			case 'ceil':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(arr[1].dp(0, 2));
				} else {
					evaluate(arr[1], function (res) {
						cb(res.dp(0, 2));
					});
				}
				break;
			case 'floor':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(arr[1].dp(0, 3));
				} else {
					evaluate(arr[1], function (res) {
						cb(res.dp(0, 3));
					});
				}
				break;
			case 'round':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(arr[1].dp(0, 6));
				} else {
					evaluate(arr[1], function (res) {
						cb(res.dp(0, 6));
					});
				}
				break;
			case 'min':
				cb(arr[1].reduce(function (a, b) {
					return BigNumber.min(a, b);
				}));
				break;
			case 'max':
				cb(arr[1].reduce(function (a, b) {
					return BigNumber.max(a, b);
				}));
				break;
			case 'pi':
				cb(new BigNumber(Math.PI));
				break;
			case 'and':
				var prevV = true;
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						prevV = prevV && !(param.eq(0));
						cb2(null, prevV);
					} else {
						evaluate(param, function (res) {
							if(typeof res === 'boolean'){
								prevV = prevV && res;
							} else if(BigNumber.isBigNumber(res)) {
								prevV = prevV && !(res.eq(0));
							} else {
								throw Error('Incorrect and');
							}
							cb2(null, prevV);
						});
					}
				}, function () {
					cb(prevV);
				});
				break;
			case 'or':
				var prevV = false;
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						prevV = prevV || !(param.eq(0));
						cb2(null, prevV);
					} else {
						evaluate(param, function (res) {
							if(typeof res === 'boolean'){
								prevV = prevV || res;
							} else if(BigNumber.isBigNumber(res)) {
								prevV = prevV || !(res.eq(0));
							} else {
								throw Error('Incorrect and');
							}
							cb2(null, prevV);
						});
					}
				}, function () {
					cb(prevV);
				});
				break;
			case 'comparison':
				var val1;
				var operator = arr[1];
				var param1 = arr[2];
				var param2 = arr[3];
				async.eachSeries([param1], function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						val1 = param;
						cb2();
					} else {
						evaluate(param, function (res) {
							val1 = res;
							cb2();
						});
					}
				}, function () {
					var val2;
					async.eachSeries([param2], function (param, cb2) {
						if (BigNumber.isBigNumber(param)) {
							val2 = param;
							cb2();
						} else {
							evaluate(param, function (res) {
								val2 = res;
								cb2();
							});
						}
					}, function () {
						if (typeof val1 === 'string') {
							throw new Error('Incorrect comparison')
						} else {
							switch (operator) {
								case '==':
									return cb(val1.eq(val2));
								case '>=':
									return cb(val1.gte(val2));
								case '<=':
									return cb(val1.lte(val2));
								case '!=':
									return cb(!(val1.eq(val2)));
								case '>':
									return cb(val1.gt(val2));
								case '<':
									return cb(val1.lt(val2));
							}
						}
					});
				});
				break;
			case 'stringComparison':
				var val1;
				var operator = arr[1];
				var param1 = arr[2];
				var param2 = arr[3];
				async.eachSeries([param1], function (param, cb2) {
					if (typeof param === 'string') {
						val1 = param;
						cb2();
					} else {
						evaluate(param, function (res) {
							val1 = res;
							cb2();
						});
					}
				}, function () {
					var val2;
					async.eachSeries([param2], function (param, cb2) {
						if (typeof param === 'string') {
							val2 = param;
							cb2();
						} else {
							evaluate(param, function (res) {
								val2 = res;
								cb2();
							});
						}
					}, function () {
						if(BigNumber.isBigNumber(val1)) val1 = val1.toString();
						if(BigNumber.isBigNumber(val2)) val2 = val2.toString();
						if(val1[0] === '"' || val1[0] === "'") val1 = val1.slice(1, -1);
						if(val2[0] === '"' || val2[0] === "'") val2 = val2.slice(1, -1);
						switch (operator) {
							case '==':
								return cb(val1 === val2);
							case '>=':
								return cb(val1 >= val2);
							case '<=':
								return cb(val1 <= val2);
							case '!=':
								return cb(val1 !== val2);
							case '>':
								return cb(val1 > val2);
							case '<':
								return cb(val1 < val2);
						}
					});
				});
				break;
			case 'ternary':
				var conditionResult;
				async.eachSeries([arr[1]], function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						conditionResult = !param.eq(0);
						cb2();
					} else if (typeof param === 'boolean') {
						conditionResult = param;
						cb2();
					} else {
						evaluate(param, function (res) {
							if(typeof res === 'boolean') {
								conditionResult = res;
							}else if(BigNumber.isBigNumber(res)){
								conditionResult = !(res.eq(0));
							}else if(typeof res === 'string'){
								conditionResult = !!res;
							}else{
								throw Error('Incorrect ternary');
							}
							cb2();
						});
					}
				}, function () {
					var param2 = conditionResult ? arr[2] : arr[3];
					if (BigNumber.isBigNumber(param2)) {
						cb(param2);
					} else {
						evaluate(param2, function (res) {
							cb(res);
						});
					}
				});
				break;
			case 'e':
				cb(new BigNumber(Math.E));
				break;
			case 'data_feed':
			
				function getDataFeed(params, cb) {
					var arrAddresses = params.oracles.value.split(':');
					var feed_name = params.feed_name.value;
					var value = null;
					var relation = '';
					var mci_relation = '<=';
					var min_mci = 0;
					if (params.feed_value) {
						value = params.feed_value.value;
						relation = params.feed_value.operator;
					}
					if (params.mci) {
						min_mci = params.mci.value.toString();
						mci_relation = params.mci.operator;
					}
					var ifseveral = 'ORDER BY main_chain_index DESC';
					var abortIfSeveral = false;
					if (params.ifseveral) {
						if (params.ifseveral.value === 'first') {
							ifseveral = 'ORDER BY main_chain_index ASC';
						} else if (params.ifseveral.value === 'abort') {
							ifseveral = '';
							abortIfSeveral = true;
						}
					}
					var ifnone = false;
					if (params.ifnone && params.ifnone.value !== 'abort') {
						ifnone = params.ifnone.value;
					}
					
					var value_condition = '';
					var queryParams = [arrAddresses, feed_name];
					if (value) {
						if (BigNumber.isBigNumber(value)) {
							var bForceNumericComparison = (['>', '>=', '<', '<='].indexOf(relation) >= 0);
							var plus_0 = bForceNumericComparison ? '+0' : '';
							value_condition = '(value' + plus_0 + relation + value.toString() + ' OR int_value' + relation + value.toString() + ')';
						}
						else {
							value_condition = 'value' + relation + '?';
							queryParams.push(value);
						}
					}
					queryParams.push(objValidationState.last_ball_mci, min_mci);
					conn.query(
						"SELECT value, int_value FROM data_feeds CROSS JOIN units USING(unit) CROSS JOIN unit_authors USING(unit) \n\
								WHERE address IN(?) AND feed_name=? " + (value_condition ? ' AND ' + value_condition : '') + " \n\
							AND main_chain_index<=? AND main_chain_index" + mci_relation + "? AND sequence='good' AND is_stable=1 " + ifseveral + " LIMIT " + (abortIfSeveral ? "2" : "1"),
						queryParams,
						function (rows) {
							if (rows.length) {
								if (abortIfSeveral && rows.length > 1) {
									cb('abort');
								} else {
									if (rows[0].value === null) {
										cb(null, new BigNumber(rows[0].int_value));
									} else {
										cb(null, rows[0].value);
									}
								}
							} else {
								if (ifnone === false) {
									cb('not found');
								} else {
									cb(null, ifnone);
								}
							}
						}
					);
				}
				
				getDataFeed(arr[1], function (err, result) {
					if (err) return callback(false);
					cb(result);
				});
				break;
			case 'input':
			case 'output':
				var type = op + 's';
				function findOutputOrInputAndReturnName(objParams) {
					var asset = objParams.asset ? objParams.asset.value : null;
					var operator = objParams.asset ? objParams.asset.operator : null;
					var puts = [];
					messages.forEach(function (message) {
						if (message.payload) {
							if (!asset) {
								puts = puts.concat(message.payload[type]);
							} else if (operator === '=' && asset === 'base' && !message.payload.asset) {
								puts = puts.concat(message.payload[type]);
							} else if (operator === '!=' && asset === 'base' && message.payload.asset) {
								puts = puts.concat(message.payload[type]);
							} else if (operator === '=' && asset === message.payload.asset && message.payload.asset) {
								puts = puts.concat(message.payload[type]);
							} else if (operator === '!=' && asset !== message.payload.asset && message.payload.asset) {
								puts = puts.concat(message.payload[type]);
							}
						}
					});
					if (puts.length === 0) return '';
					if (objParams.address) {
						if (objParams.address.value === 'this address')
							objParams.address.value = address;
						
						if (objParams.address.value === 'other address') {
							objParams.address.value = address;
							if (objParams.address.operator === '=') {
								objParams.address.operator = '!=';
							} else {
								objParams.address.operator = '=';
							}
						}
						
						puts = puts.filter(function (put) {
							if (objParams.address.operator === '=') {
								return put.address === objParams.address.value;
							} else {
								return put.address !== objParams.address.value;
							}
						});
					}
					if (objParams.amount) {
						puts = puts.filter(function (put) {
							put.amount = new BigNumber(put.amount);
							if (objParams.amount.operator === '=') {
								return put.amount.eq(objParams.amount.value);
							} else if (objParams.amount.operator === '>') {
								return put.amount.gt(objParams.amount.value);
							} else if (objParams.amount.operator === '<') {
								return put.amount.lt(objParams.amount.value);
							} else if (objParams.amount.operator === '<=') {
								return put.amount.lte(objParams.amount.value);
							} else if (objParams.amount.operator === '>=') {
								return put.amount.gte(objParams.amount.value);
							} else {
								return !(put.amount.eq(objParams.amount.value));
							}
						});
					}
					if (puts.length) {
						if (puts.length > 1) return '';
						return puts[0];
					} else {
						return '';
					}
				}
				
				var result = findOutputOrInputAndReturnName(arr[1]);
				if (result === '') return callback(false);
				if (arr[2] === 'amount') {
					cb(new BigNumber(result['amount']));
				} else if (arr[2] === 'asset') {
					if(!result['asset']) result['asset'] = 'base';
					cb(result['asset'])
				} else {
					cb(result[arr[2]]);
				}
				break;
				
			case 'concat':
				var result = '';
				async.eachSeries(arr.slice(1), function (param, cb2) {
					if (BigNumber.isBigNumber(param)) {
						result += param.toString();
						cb2();
					} else if (param.value) {
						result += param.value.slice(1,-1);
						cb2();
					} else {
						evaluate(param, function (res) {
							if (BigNumber.isBigNumber(res)) {
								result += res.toString();
							} else if (res.value) {
								result += res.value.slice(1,-1);
							}else if(typeof res === 'string'){
								result += res;
							}else{
								throw Error('Incorrect concat: ' + res);
							}
							cb2();
						});
					}
				}, function () {
					cb(result);
				});
				break;
			default:
				if (BigNumber.isBigNumber(arr[0])) return cb(arr[0]);
				if (BigNumber.isBigNumber(arr)) return cb(arr);
				if (typeof arr[0] === 'boolean') return cb(arr[0]);
				throw new Error('Incorrect formula: ' + arr);
				break;
		}
	}
	
	evaluate(parser.results[0], res => {callback(res)});
};