var evalFormula = require('./index').evaluate;
var test = require('ava');

var objValidationState = {
	last_ball_mci: 0,
	arrAugmentedMessages: [{
		"app": "payment",
		"payload_location": "inline",
		"payload_hash": "2p893QLyyaUi0Nw5IWGjRtocjAksxpiFvXYuBRwPTZI=",
		"payload": {
			"outputs": [
				{"address": "MXMEKGN37H5QO2AWHT7XRG6LHJVVTAWU", "amount": 19088},
				{"address": "GFK3RDAPQLLNCMQEVGGD2KCPZTLSG3HN", "amount": 1}
			],
			"inputs": [{
				"unit": "p+U9OB+JOCW5/7hXiRpVw65HwzFprNfj68PCy/7BR6A=",
				"message_index": 0,
				"output_index": 1,
				"type": "transfer",
				"amount": 20000,
				"address": "MXMEKGN37H5QO2AWHT7XRG6LHJVVTAWU"
			}]
		}
	}]
	
};

test('1 + 1', t => {
	evalFormula("1 + 1", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(2), true);
	});
});

test('1 - 1', t => {
	evalFormula("1 - 1", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(0), true);
	});
});

test('2 * 2', t => {
	evalFormula("2 * 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(4), true);
	});
});

test('2 / 2', t => {
	evalFormula("2 / 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(1), true);
	});
});

test('2 ^ 4', t => {
	evalFormula("2 ^ 4", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(16), true);
	});
});

test('(2 + 2) * 2', t => {
	evalFormula("(2 + 2) * 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(8), true);
	});
});

test('2 + 2 * 2', t => {
	evalFormula("2 + 2 * 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(6), true);
	});
});

test('pi + 2', t => {
	evalFormula("pi + 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(Math.PI + 2), true);
	});
});

test('e + 2', t => {
	evalFormula("e + 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(Math.E + 2), true);
	});
});

test('sin(2)', t => {
	evalFormula("sin(2)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(0.9092974268256817), true);
	});
});

test('cos(2)', t => {
	evalFormula("cos(2)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(-0.4161468365471424), true);
	});
});

test('tan(2)', t => {
	evalFormula("tan(2)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(-2.185039863261519), true);
	});
});

test('asin(1)', t => {
	evalFormula("asin(1)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(1.5707963267948966), true);
	});
});

test('acos(1)', t => {
	evalFormula("acos(1)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(0), true);
	});
});

test('atan(2)', t => {
	evalFormula("atan(2)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(1.1071487177940904), true);
	});
});

test('sqrt(2)', t => {
	evalFormula("sqrt(2)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq('1.4142135623730950488'), true);
	});
});

test('ln(2)', t => {
	evalFormula("ln(2)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(0.6931471805599453), true);
	});
});

test('1 == 1', t => {
	evalFormula("1 == 1", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('1 != 1', t => {
	evalFormula("1 != 1", 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('1 != 2', t => {
	evalFormula("1 != 2", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('1 < 2', t => {
	evalFormula("1 < 2", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('1 > 2', t => {
	evalFormula("1 > 2", 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('1 >= 2', t => {
	evalFormula("2 >= 2", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('1 <= 2', t => {
	evalFormula("1 <= 2", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('0 >= 2', t => {
	evalFormula("0 >= 2", 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('3 <= 2', t => {
	evalFormula("3 <= 1", 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('"test" == "test"', t => {
	evalFormula('"test" == "test"', 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('"test" != "test"', t => {
	evalFormula('"test" != "test"', 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('"test 1" != "test 2"', t => {
	evalFormula('"test 1" != "test 2"', 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('"test 2" != "test 2"', t => {
	evalFormula('"test 2" != "test 2"', 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('"test 3" == "test 3"', t => {
	evalFormula('"test 3" == "test 3"', 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('1 && 1', t => {
	evalFormula("1 && 1", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('0 && 0', t => {
	evalFormula("0 && 0", 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('0 && 1', t => {
	evalFormula("0 && 1", 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('0 || 1', t => {
	evalFormula("0 || 1", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('1 == 1 && 1 == 1', t => {
	evalFormula("1 == 1 && 1 == 1", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});
test('1 == 1 && 1 == 2', t => {
	evalFormula("1 == 1 && 1 == 2", 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('1 == 1 || 1 == 2', t => {
	evalFormula("1 == 1 || 1 == 2", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('1 == 2 || 1 == 2', t => {
	evalFormula("1 == 2 || 1 == 2", 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('10 == 10 ? 1 : 2', t => {
	evalFormula("10 == 10 ? 1 : 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(1), true);
	});
});

test('10 != 10 ? 1 : 2', t => {
	evalFormula("10 != 10 ? 1 : 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(2), true);
	});
});

test('10 == 10 ? 1 + 1 : 2 + 2', t => {
	evalFormula("10 == 10 ? 1 + 1 : 2 + 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(2), true);
	});
});

test('10 != 10 ? 1 + 1 : 2 + 2', t => {
	evalFormula("10 != 10 ? 1 + 1 : 2 + 2", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(4), true);
	});
});

test('1000000000000000000000000000000 == 1000000000000000000000000000000', t => {
	evalFormula("1000000000000000000000000000000 == 1000000000000000000000000000000", 0, 0, 0, 0, res => {
		t.deepEqual(res, true);
	});
});

test('1000000000000000000000000000000 == 1000000000000000000000000000001', t => {
	evalFormula("1000000000000000000000000000000 == 1000000000000000000000000000001", 0, 0, 0, 0, res => {
		t.deepEqual(res, false);
	});
});

test('min 1,2', t => {
	evalFormula('min(1,2)', 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(1), true);
	});
});

test('min 1,2,4', t => {
	evalFormula("min(1,2,4)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(1), true);
	});
});

test('min 2,3,5,7', t => {
	evalFormula("min(2,3,5,7)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(2), true);
	});
});

test('max 1,2', t => {
	evalFormula("max(1,2)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(2), true);
	});
});

test('max 1,2,4', t => {
	evalFormula("max(1,2,4)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(4), true);
	});
});
test('max 2,3,5,7', t => {
	evalFormula("max(2,3,5,7)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(7), true);
	});
});

test('ceil 2.5', t => {
	evalFormula("ceil(2.5)", 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(3), true);
	});
});

test('floor 2.5', t => {
	evalFormula('floor(2.5)', 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(2), true);
	});
});

test('round 2.5', t => {
	evalFormula('round(2.9)', 0, 0, 0, 0, res => {
		t.deepEqual(res.eq(3), true);
	});
});

test('formula - amount !=', t => {
	evalFormula('input[asset=base].amount != output[asset=base, address=GFK3RDAPQLLNCMQEVGGD2KCPZTLSG3HN].amount', 0, objValidationState.arrAugmentedMessages, objValidationState, 0, res => {
		t.deepEqual(res, true);
	});
});

test('formula - amount = 1', t => {
	evalFormula("output[asset=base, amount=1].amount == 1", 0, objValidationState.arrAugmentedMessages, objValidationState, 0, res => {
		t.deepEqual(res, true);
	});
});

test('formula - datafeed', t => {
	let db = {};
	db.query = function (query, params, cb) {
		let rows = [{value: null, int_value: 10}];
		cb(rows);
	};
	evalFormula("data_feed[oracles=\"MXMEKGN37H5QO2AWHT7XRG6LHJVVTAWU\", feed_name=\"test\", ifseveral=\"last\"] == 10", db, objValidationState.arrAugmentedMessages, objValidationState, 0, res => {
		t.deepEqual(res, true);
	});
});