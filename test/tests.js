// Created by Andrea Coronese
var assert = require('assert');
var N = require('../dist/numberphile.js').NumberphileReactor;
var WrapperFunction = require('../dist/numberphile.js').N

var f = function(v) {
    return new N(v);
};

describe('NumberphileReactor', function() {
    it("symbol NumberphileReactor should be defined (whatch your exports!)", function() {
        assert.notEqual("undefined", typeof N);
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

    it("f('6000,00').divide(2.3) should return 2608.7 as value", function() {
        assert.equal(2608.7, f(6000.0).divide(2.3).val());
    });

    it("f(6000).val('currency') should return '6.000,00'", function() {
        assert.equal("6.000,00", f(6000).val('currency'));
    });

    it("f(6000).add('4.000,30').val('currency') should return '10.000,30'", function() {
        assert.equal("10.000,30", f(6000).add('4.000,30').val('currency'));
    });
});