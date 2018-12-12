var nearley = require("nearley");
var grammar = require("./grammar.js");
var BigNumber = require('bignumber.js');
var async = require('async');
var ValidationUtils = require("byteballcore/validation_utils.js");
var constants = require('byteballcore/constants');

BigNumber.config({EXPONENTIAL_AT: [-1e+9, 1e9], POW_PRECISION: 100, RANGE: 100});

exports.validate = function (formula, complexity, callback) {
	var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	try {
		parser.feed(formula);
	} catch (e) {
		return callback({error: 'incorrect formula', complexity});
	}
	var error = false;
	complexity++;
	
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
			case 'ifelse':
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
			case 'datafeed':
				var result = validDataFeed(arr[1], complexity);
				complexity = result.complexity;
				if (!result.error) {
					cb(true);
				} else {
					error = true;
					callback({error: 'Incorrect datafeed', complexity});
				}
				break;
			case 'input':
			case 'output':
				if (validInputAndOutput(arr)) {
					cb(true);
				} else {
					error = true;
					callback({error: 'Incorrect ' + arr[0], complexity});
				}
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
			callback({complexity});
		});
	} else {
		callback({error: 'Incorrect formula', complexity});
	}
};

function validInputAndOutput(arr) {
	for (var k in arr[1]) {
		var operator = arr[1][k].operator;
		var value = arr[1][k].value;
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
	for (var k in arr[1]) {
		var operator = arr[1][k].operator;
		var value = arr[1][k].value;
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
}

exports.evaluate = function (formula, callback) {
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
						if(typeof val1 === 'string'){
							if(arr[1] === '==') {
								return cb(val1 === val2);
							}else{
								return cb(val1 !== val2);
							}
						}else {
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
			case 'ifelse':
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
			case 'datafeed':
				
				cb(new BigNumber(4));
				break;
			case 'input':
				
				cb(new BigNumber(4));
				break;
			case 'output':
				
				cb(new BigNumber(4));
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