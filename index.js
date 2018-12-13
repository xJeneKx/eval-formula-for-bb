var nearley = require("nearley");
var grammar = require("./grammar.js");
var BigNumber = require('bignumber.js');
var async = require('async');
var ValidationUtils = require("byteballcore/validation_utils.js");
var constants = require('byteballcore/constants');

BigNumber.config({EXPONENTIAL_AT: [-1e+9, 1e9], POW_PRECISION: 100, RANGE: 100});

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
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						cb2(null);
					} else {
						evaluate(arr2, function (res) {
							cb2(null);
						});
					}
				}, function () {
					cb(true);
				});
				break;
			case '-':
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						cb2(null);
					} else {
						evaluate(arr2, function (res) {
							cb2(null);
						});
					}
				}, function () {
					cb(true);
				});
				break;
			case '*':
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						cb2(null);
					} else {
						evaluate(arr2, function (res) {
							cb2(null);
						});
					}
				}, function () {
					cb(true);
				});
				break;
			case '/':
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						cb2(null);
					} else {
						evaluate(arr2, function (res) {
							cb2(null);
						});
					}
				}, function () {
					cb(true);
				});
				break;
			case '^':
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						cb2(null);
					} else {
						evaluate(arr2, function (res) {
							cb2(null);
						});
					}
				}, function () {
					cb(true);
				});
				break;
			case 'sin':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'cos':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'tan':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'asin':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'acos':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'atan':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'log':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'sqrt':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'ceil':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'floor':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'round':
				if (BigNumber.isBigNumber(arr[1])) {
					cb(true);
				} else {
					evaluate(arr[1], function (res) {
						cb(true);
					});
				}
				break;
			case 'min':
				cb(arr[1].reduce(function (a, b) {
					return BigNumber.min(a, b);
				}));
				break;
			case 'max':
				cb(true);
				break;
			case 'pi':
				cb(true);
				break;
			case 'and':
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						cb2(null);
					} else {
						evaluate(arr2, function (res) {
							cb2(null);
						});
					}
				}, function () {
					cb(true);
				});
				break;
			case 'or':
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						cb2(null);
					} else {
						evaluate(arr2, function (res) {
							cb2(null);
						});
					}
				}, function () {
					cb(true);
				});
				break;
			case 'condition':
				async.eachSeries([arr[2]], function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						cb2();
					} else {
						evaluate(arr2, function (res) {
							cb2();
						});
					}
				}, function () {
					async.eachSeries([arr[3]], function (arr3, cb2) {
						if (BigNumber.isBigNumber(arr3)) {
							cb2();
						} else {
							evaluate(arr3, function (res) {
								cb2();
							});
						}
					}, function () {
						cb(true);
					});
				});
				break;
			case 'stringCondition':
				async.eachSeries([arr[2]], function (arr2, cb2) {
					if (typeof arr2 === 'string') {
						cb2();
					} else {
						evaluate(arr2, function (res) {
							cb2();
						});
					}
				}, function () {
					async.eachSeries([arr[3]], function (arr3, cb2) {
						if (typeof arr3 === 'string') {
							cb2();
						} else {
							evaluate(arr3, function (res) {
								cb2();
							});
						}
					}, function () {
						cb(true);
					});
				});
				break;
			case 'ternary':
				async.eachSeries([arr[1]], function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						cb2();
					} else if (typeof arr2 === 'boolean') {
						cb2();
					} else {
						evaluate(arr2, function (res) {
							cb2();
						});
					}
				}, function () {
					if (true) {
						var result;
						async.eachSeries([arr[2]], function (arr3, cb3) {
							if (BigNumber.isBigNumber(arr3)) {
								cb3();
							} else {
								evaluate(arr3, function (res) {
									cb3();
								});
							}
						}, function () {
							cb(true);
						})
					}
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
					callback({error: 'Incorrect data_feed', complexity});
				}
				break;
			case 'input':
			case 'output':
				if (validInputAndOutput(arr[1])) {
					cb(true);
				} else {
					error = true;
					callback({error: 'Incorrect ' + arr[0], complexity});
				}
				break;
			case 'concat':
				cb(true);
				break;
			default:
				if (BigNumber.isBigNumber(arr[0])) return cb(true);
				if (typeof arr[0] === 'boolean') return cb(true);
				error = true;
				callback({error: 'Incorrect formula: ' + arr});
				break;
		}
	}
	
	if (parser.results[0]) {
		evaluate(parser.results[0], res => {
			callback({complexity, error: null});
		});
	} else {
		callback({error: 'Incorrect formula', complexity});
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
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						if (prevV === undefined) {
							prevV = arr2;
						} else {
							prevV = arr2.plus(prevV);
						}
						cb2(null, prevV);
					} else {
						evaluate(arr2, function (res) {
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
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						if (prevV === undefined) {
							prevV = arr2;
						} else {
							prevV = prevV.minus(arr2);
						}
						cb2(null, prevV);
					} else {
						evaluate(arr2, function (res) {
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
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						if (prevV === undefined) {
							prevV = arr2;
						} else {
							prevV = arr2.times(prevV);
						}
						cb2(null, prevV);
					} else {
						evaluate(arr2, function (res) {
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
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						if (prevV === undefined) {
							prevV = arr2;
						} else {
							prevV = prevV.div(arr2);
						}
						cb2(null, prevV);
					} else {
						evaluate(arr2, function (res) {
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
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						if (prevV === undefined) {
							prevV = arr2;
						} else {
							prevV = prevV.pow(arr2);
						}
						cb2(null, prevV);
					} else {
						evaluate(arr2, function (res) {
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
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						prevV = prevV && !(arr2.eq(0));
						cb2(null, prevV);
					} else {
						evaluate(arr2, function (res) {
							prevV = prevV && res;
							cb2(null, prevV);
						});
					}
				}, function () {
					cb(prevV);
				});
				break;
			case 'or':
				var prevV = false;
				async.eachSeries(arr.slice(1), function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						prevV = prevV || !(arr2.eq(0));
						cb2(null, prevV);
					} else {
						evaluate(arr2, function (res) {
							prevV = prevV || res;
							cb2(null, prevV);
						});
					}
				}, function () {
					cb(prevV);
				});
				break;
			case 'condition':
				var val1;
				async.eachSeries([arr[2]], function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						val1 = arr2;
						cb2();
					} else {
						evaluate(arr2, function (res) {
							val1 = res;
							cb2();
						});
					}
				}, function () {
					var val2;
					async.eachSeries([arr[3]], function (arr3, cb2) {
						if (BigNumber.isBigNumber(arr3)) {
							val2 = arr3;
							cb2();
						} else {
							evaluate(arr3, function (res) {
								val2 = res;
								cb2();
							});
						}
					}, function () {
						if (typeof val1 === 'string') {
							if (arr[1] === '==') {
								return cb(val1 === val2);
							} else {
								return cb(val1 !== val2);
							}
						} else {
							switch (arr[1]) {
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
			case 'stringCondition':
				var val1;
				async.eachSeries([arr[2]], function (arr2, cb2) {
					if (typeof arr2 === 'string') {
						val1 = arr2;
						cb2();
					} else {
						evaluate(arr2, function (res) {
							val1 = res;
							cb2();
						});
					}
				}, function () {
					var val2;
					async.eachSeries([arr[3]], function (arr3, cb2) {
						if (typeof arr3 === 'string') {
							val2 = arr3;
							cb2();
						} else {
							evaluate(arr3, function (res) {
								val2 = res;
								cb2();
							});
						}
					}, function () {
						if (arr[1] === '==') {
							return cb(val1 === val2);
						} else {
							return cb(val1 !== val2);
						}
					});
				});
				break;
			case 'ternary':
				var conditionResult;
				async.eachSeries([arr[1]], function (arr2, cb2) {
					if (BigNumber.isBigNumber(arr2)) {
						conditionResult = !arr2.eq(0);
						cb2();
					} else if (typeof arr2 === 'boolean') {
						conditionResult = arr2;
						cb2();
					} else {
						evaluate(arr2, function (res) {
							conditionResult = res;
							cb2();
						});
					}
				}, function () {
					if (conditionResult) {
						var result;
						async.eachSeries([arr[2]], function (arr3, cb3) {
							if (BigNumber.isBigNumber(arr3)) {
								result = arr3;
								cb3();
							} else {
								evaluate(arr3, function (res) {
									result = res;
									cb3();
								});
							}
						}, function () {
							cb(result);
						})
					} else {
						async.eachSeries([arr[3]], function (arr3, cb3) {
							if (BigNumber.isBigNumber(arr3)) {
								result = arr3;
								cb3();
							} else {
								evaluate(arr3, function (res) {
									result = res;
									cb3();
								});
							}
						}, function () {
							cb(result);
						})
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
						min_mci = params.mci.value;
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
						var isNumber2 = /^-?\d+\.?\d*$/.test(params.ifnone.value);
						if (isNumber2) {
							ifnone = new BigNumber(params.ifnone.value);
						} else {
							ifnone = params.ifnone.value;
						}
					}
					
					var value_condition = '';
					var queryParams = [arrAddresses, feed_name];
					if (value) {
						var isNumber = /^-?\d+\.?\d*$/.test(value);
						if (isNumber) {
							var bForceNumericComparison = (['>', '>=', '<', '<='].indexOf(relation) >= 0);
							var plus_0 = bForceNumericComparison ? '+0' : '';
							value_condition = '(value' + plus_0 + relation + value + ' OR int_value' + relation + value + ')';
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
						objParams.amount.value = new BigNumber(objParams.amount.value);
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
				cb(arr[1] + arr[2]);
				break;
			default:
				if (BigNumber.isBigNumber(arr[0])) return cb(arr[0]);
				if (typeof arr[0] === 'boolean') return cb(arr[0]);
				throw new Error('Incorrect formula: ' + arr);
				break;
		}
	}
	
	evaluate(parser.results[0], res => {callback(res)});
};