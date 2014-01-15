// Created by Andrea Coronese

var assert = require('assert');
var N = require('../dist/numberphile.min.js');

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