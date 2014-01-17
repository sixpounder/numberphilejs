// Created by Andrea Coronese

var assert = require('assert');
var N = require('../dist/numberphile.js').NumberphileReactor;
var E = require('../dist/numberphile.js').Numberphiler;
var WrapperFunction = require('../dist/numberphile.js').N

var f = function(v) {
    return new E(v);
};

describe('Numberphiler', function() {
    it("symbol Numberphiler should be defined (whatch your exports!)", function() {
        assert.notEqual("undefined", typeof E);
    });

    it("wrapper function N should be defined (whatch your exports!)", function() {
        assert.notEqual("undefined", typeof WrapperFunction);
    });

    it("should expose add method", function() {
        assert.notEqual("undefined", typeof f(1).add);
    });

    it("should expose divide method", function() {
        assert.notEqual("undefined", typeof f(1).divide);
    });

    it("should expose multiply method", function() {
        assert.notEqual("undefined", typeof f(1).multiply);
    });

    it("should expose subtract method", function() {
        assert.notEqual("undefined", typeof f(1).subtract);
    });

    it("should expose mod method", function() {
        assert.notEqual("undefined", typeof f(1).mod);
    });

    it("f(6000) should return 6000 as value", function() {
        assert.equal(6000, f(6000).val());
    });

    it("f(6000).multiply(2).val() should return 12000", function() {
        assert.equal(12000, f(6000).multiply(2).val());
    });

    it("f(6000).add('4.000,30').add(1).val() should return 10.001.3", function() {
        assert.equal(10001.3, f(6000).add('4.000,30').add(1).val());
    });

    it("f(6000).multiply(2.5).val() should return 15000", function() {
        assert.equal(15000, f(6000).multiply(2.5).val());
    });

    it("f(6000).multiply('3,').val() should return 18000", function() {
        assert.equal(18000, f(6000).multiply("3,").val());
    });

    it("f(6000.45).multiply(2).val() should return 18000", function() {
        assert.equal(12000.9, f(6000.45).multiply(2).val());
    });

    it("f('6.000') should return 6 as value", function() {
        assert.equal(6, f("6.000").val());
    });

    it("f('6.000,') should return 6000 as value", function() {
        assert.equal(6000, f("6.000,").val());
    });

    it("f('6.000,01') should return 6000.01 as value", function() {
        assert.equal(6000.01, f("6.000,01").val());
    });

    it("f('6.000,01').add(6000) should return 12000.01 as value", function() {
        assert.equal(12000.01, f('6.000,01').add(6000).val());
    });

    it("f('6.000,01').subtract(6000) should return 0.01 as value", function() {
        assert.equal(0.01, f(6000.01).subtract(6000).val());
    });

    it("f('6.000,01').multiply(2.12).add(1) should return 12721.02 as value", function() {
        assert.equal(12721.02, f(6000.01).multiply(2.12).add(1).val());
    });

    it("f(6000).val('import') should return '6.000,00'", function() {
        assert.equal("6.000,00", f(6000).val('import'));
    });

    it("f(6000).add('4.000,30').val('import') should return '10.000,30'", function() {
        assert.equal("10.000,30", f(6000).add('4.000,30').val('import'));
    });
});

describe('NumberphileReactor (BASE)', function() {
    it("symbol NumberphileReactor should be defined (whatch your exports!)", function() {
        assert.notEqual("undefined", typeof N);
    });

    it("should act as singleton", function() {
        assert.notEqual(undefined, N.get());
    });
});

describe('NumberphileReactor (API)', function() {
    it("should define stringToFormattedImport as a function", function() {
        assert.equal("function", typeof N.get().stringToFormattedImport);
    });

    it("should define stringToFloat as a function", function() {
        assert.equal("function", typeof N.get().sum);
    });

    it("should define sum as a function", function() {
        assert.equal("function", typeof N.get().sum);
    });
});

describe('NumberphileReactor', function() {    

    it("should return 123,00 for conversion input 123", function() {
        assert.equal("123,00", N.get().stringToFormattedImport("123"));
    });

    it("should return 123.125,10 for conversion input 123125,1", function() {
        assert.equal("123.125,10", N.get().stringToFormattedImport("123125,1"));
    });

    it("should return 123.125,00 for conversion input 123125,", function() {
        assert.equal("123.125,00", N.get().stringToFormattedImport("123125,"));
    });

    it("should return numeric 123125.1 for conversion input 123125,1", function() {
        assert.equal(123125.1, N.get().stringToFloat("123125,10"));
    });

    it("should return numeric 100.0 for sum on [30,30,40]", function() {
        assert.equal(100.0, N.get().sum([30,30,40]));
    });

    it("failed test for decimal precision for sum on [30.4,30.7,40.12]", function() {
        assert.equal(101.22, N.get().sum([30.4,30.7,40.12]));
    });

    it("failed test for conversion + decimal precision for sum on [\"30,4\",\"30,7\",\"40,12\"]", function() {
        assert.equal(101.22, N.get().sum(["30,4","30,7","40,12"]));
    });

    it("failed test for thousands conversion + decimal precision for sum on [\"30,4\",\"30,7\",\"40,12\"]", function() {
        assert.equal(100101.22, N.get().sum(["100.030,4","30,7","40,12"]));
    });
});