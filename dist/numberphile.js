(function() {
  var NumberphileNumber, NumberphileOperation, Numberphiler, _,
    __slice = [].slice;

  Numberphiler = (function() {
    var decimalPrecision, parse, smartParseFloat, _T_FLOAT, _T_INT, _T_NUMBER;

    _T_INT = "int";

    _T_FLOAT = "float";

    _T_NUMBER = "number";

    decimalPrecision = 2;

    parse = function(root) {
      var r;
      r = new NumberphileNumber();
      if (typeof root === "string") {
        r.type = _T_FLOAT;
        r.origin = smartParseFloat(root);
      } else if (typeof root === "number") {
        r.type = _T_NUMBER;
        r.origin = root;
      }
      r.set(smartParseFloat(root));
      return r;
    };

    smartParseFloat = function(v) {
      var commas, dots;
      if (typeof v === "string") {
        dots = v.match(/\./g);
        commas = v.match(/,/g);
        if (commas != null) {
          commas = commas.length;
        } else {
          commas = 0;
        }
        if (dots != null) {
          dots = dots.length;
        } else {
          dots = 0;
        }
        if (commas > 0 || (commas === 0 && dots > 1)) {
          if (dots > 0) {
            v = v.replace(/\./g, '');
          }
        }
        v = v.replace(/,/g, '.');
      }
      return parseFloat(v);
    };

    function Numberphiler(v, opts) {
      if (opts == null) {
        opts = {};
      }
      this.root = v;
      decimalPrecision = opts.decimalPrecision || 2;
      this.repr = parse(this.root);
    }

    Numberphiler.prototype.add = function(something) {
      this.repr.set(this.repr.value + NumberphileNumber.toFixed(smartParseFloat(something)));
      return this;
    };

    Numberphiler.prototype.divide = function(something) {
      this.repr.set(this.repr.value / NumberphileNumber.toFixed(smartParseFloat(something)));
      return this;
    };

    Numberphiler.prototype.mod = function(something) {
      this.repr.set(this.repr.value % NumberphileNumber.toFixed(smartParseFloat(something)));
      return this;
    };

    Numberphiler.prototype.multiply = function(something) {
      this.repr.set(this.repr.value * NumberphileNumber.toFixed(smartParseFloat(something)));
      return this;
    };

    Numberphiler.prototype.subtract = function(something) {
      this.repr.set(this.repr.value - NumberphileNumber.toFixed(smartParseFloat(something)));
      return this;
    };

    Numberphiler.prototype.result = function() {
      return this.val();
    };

    Numberphiler.prototype.value = function() {
      return this.val();
    };

    Numberphiler.prototype.val = function(format) {
      var concat, r;
      if (format == null) {
        format = null;
      }
      if (format == null) {
        format = 'float';
      }
      if (format === '') {
        format = 'float';
      }
      concat = this.repr.value;
      if (format === 'float') {
        r = concat;
      }
      if (format === 'import') {
        r = smartToFixed(concat).replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      return r;
    };

    return Numberphiler;

  })();

  NumberphileOperation = (function() {
    function NumberphileOperation(firstFactor, secondFactor, operator) {
      this.firstFactor = firstFactor != null ? firstFactor : null;
      this.secondFactor = secondFactor != null ? secondFactor : null;
      this.operator = operator != null ? operator : null;
      this.result = 0;
      this.remainder = null;
    }

    return NumberphileOperation;

  })();

  NumberphileNumber = (function() {
    function NumberphileNumber(origin) {
      this.origin = origin != null ? origin : 0;
      this.value = this.origin;
      this.type = "unknown";
    }

    NumberphileNumber.prototype.intPart = function() {};

    NumberphileNumber.prototype.decimalPart = function() {};

    NumberphileNumber.prototype.set = function(v) {
      var fv;
      fv = NumberphileNumber.toFixed(v);
      this.value = parseFloat(fv);
      return this.value;
    };

    NumberphileNumber.toFixed = function(value, precision) {
      var fraction, integral, neg, padding, power;
      precision = precision || 2;
      neg = value < 0;
      power = Math.pow(10, precision);
      value = Math.round(value * power);
      integral = String((neg ? Math.ceil : Math.floor)(value / power));
      fraction = String((neg ? -value : value) % power);
      padding = new Array(Math.max(precision - fraction.length, 0) + 1).join("0");
      if (precision) {
        return parseFloat(integral + "." + padding + fraction);
      } else {
        return parseFloat(integral);
      }
    };

    return NumberphileNumber;

  })();

  if (typeof exports !== "undefined" && exports !== null) {
    exports.Numberphiler = Numberphiler;
  }

  if (typeof window !== "undefined" && window !== null) {
    this.N = function(anyValue) {
      return new Numberphiler(anyValue);
    };
  }

  if (typeof window !== "undefined" && window !== null) {
    if (typeof $ !== "undefined" && $ !== null) {
      _ = $;
    } else {
      throw new Error("jQuery is required by NumberphileJS when running in a browser");
    }
  } else {
    _ = require('underscore');
  }

  /*
  Numberphile engine for conversions & math.
  @example Instantiate and retrieve via
    NumberphileReactor.get()
  See {NumberphileReactor.get} for more details
  @copyright Andrea Coronese
  */


  this.NumberphileReactor = (function() {
    var instance;

    function NumberphileReactor() {}

    instance = null;

    NumberphileReactor.get = function() {
      if (this.instance == null) {
        instance = new this();
        instance.init("NumberphileReactor");
      }
      return instance;
    };

    NumberphileReactor.prototype.regexps = {
      thousandsMatch: /\B(?=(\d{3})+(?!\d))/g,
      importTypableCharacter: /[0-9,\.]/g,
      importNonValidCharacters: /[^A-Za-z\d,]/g
    };

    NumberphileReactor.prototype.defaults = {
      debug: false,
      importDecimalSeparator: ",",
      importThoudandsSeparator: ".",
      importMaxDecimalDigits: 2
    };

    NumberphileReactor.prototype.init = function(name, options) {
      if (name == null) {
        name = "unknown";
      }
      if (options == null) {
        options = {};
      }
      this.settings = _.extend(this.defaults, options);
      return this.log("" + name + " initialized");
    };

    NumberphileReactor.prototype.setup = function(options) {
      if (options != null) {
        this.settings = _.extend(this.defaults, options);
      }
      return this.settings;
    };

    NumberphileReactor.prototype.log = function(m) {
      if ((typeof console !== "undefined" && console !== null ? console.log : void 0) && this.settings.debug) {
        return console.log(m);
      }
    };

    NumberphileReactor.prototype.stringToFloat = function(repr) {
      return parseFloat(repr.toString().replace(this.regexps.importNonValidCharacters, "").replace(this.settings.importDecimalSeparator, this.settings.importThoudandsSeparator));
    };

    NumberphileReactor.prototype.numberToFormattedImport = function(number) {
      return this.stringToFormattedImport(number.toString());
    };

    NumberphileReactor.prototype.stringToFormattedImport = function(repr) {
      var decimalPart, intPart, j, out, p, remainingChars, _i;
      out = "";
      if (typeof repr === 'string') {
        p = repr.indexOf(this.settings.importDecimalSeparator);
        if (p === -1) {
          this.log("No decimals found by character " + this.settings.importDecimalSeparator);
          out = repr + this.settings.importDecimalSeparator + "00";
        } else {
          intPart = repr.split(this.settings.importDecimalSeparator)[0];
          decimalPart = repr.split(this.settings.importDecimalSeparator)[1];
          if (decimalPart.length > this.settings.importMaxDecimalDigits) {
            decimalPart = decimalPart.substring(0, this.settings.importMaxDecimalDigits);
          } else {
            if (decimalPart.length > this.settings.importMaxDecimalDigits) {
              remainingChars = 0;
            } else {
              remainingChars = this.settings.importMaxDecimalDigits - decimalPart.length;
            }
          }
          if (remainingChars !== 0) {
            for (j = _i = 1; 1 <= remainingChars ? _i <= remainingChars : _i >= remainingChars; j = 1 <= remainingChars ? ++_i : --_i) {
              decimalPart += "0";
            }
          }
          this.log("int part: " + intPart + " decimal part: " + decimalPart);
          out = intPart + this.settings.importDecimalSeparator + decimalPart;
        }
        out = out.replace(this.regexps.thousandsMatch, this.settings.importThoudandsSeparator);
        this.log("final representation: " + out);
        return out;
      } else {
        return repr;
      }
    };

    NumberphileReactor.prototype.add = function(values) {
      var s, v, _i, _len;
      if (values == null) {
        values = [];
      }
      s = 0;
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        v = values[_i];
        if (typeof v === "string") {
          v = this.stringToFloat(v);
        }
        s += v;
      }
      return s;
    };

    NumberphileReactor.prototype.sum = function(reprs) {
      if (reprs != null) {
        if (Object.prototype.toString.call(reprs) === '[object Array]') {
          return this.sumImpl(reprs);
        } else if (typeof reprs === "string") {
          return this.sumImpl(reprs.split("|"));
        } else {
          return 0;
        }
      } else {
        return null;
      }
    };

    NumberphileReactor.prototype.sumImpl = function(arr) {
      var n, number, s, _i, _len;
      s = 0;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        number = arr[_i];
        n = number;
        if (typeof n === "string") {
          n = this.stringToFloat(n);
        }
        s += n;
      }
      return parseFloat(s.toFixed(this.settings.importMaxDecimalDigits));
    };

    return NumberphileReactor;

  })();

  if (typeof exports !== "undefined" && exports !== null) {
    exports.NumberphileReactor = this.NumberphileReactor;
  }

  /*
  A jQuery plugin to bind elements to triggers for step values
  */


  this.NumberphileCounter = (function() {
    NumberphileCounter.prototype.defaults = {
      debug: false,
      autowire: true,
      step: 1,
      target: null
    };

    function NumberphileCounter(element, options) {
      this.element = element;
      this.settings = $.extend(this.defaults, options);
      this.settings.step = parseInt(this.settings.step, 10);
      return this.initialize();
    }

    NumberphileCounter.prototype.initialize = function() {
      if (this.settings.target == null) {
        if ((this.element.attr('data-target') != null) && this.element.attr('data-target') !== "") {
          this.settings.target = $(this.element.attr('data-target'));
        } else {
          this.settings.target = this.element;
        }
      }
      if (this.settings.autowire) {
        this.element.bind('click', function() {
          return $(this).numberphileCounter('step');
        });
      }
      return this;
    };

    NumberphileCounter.prototype.step = function() {
      var stepVal, targets;
      stepVal = this.element.attr('data-step');
      targets = $(this.element.attr('data-target'));
      return targets.each(function() {
        var $this, base, s;
        $this = $(this);
        base = parseFloat($this.val());
        s = parseFloat(stepVal);
        s = s + base;
        if ($this.is('input')) {
          $(this).val(s);
        } else {
          $this.text(s);
        }
        return $this.trigger('numberphile:step');
      });
    };

    return NumberphileCounter;

  })();

  if ((typeof window !== "undefined" && window !== null) && (typeof $ !== "undefined" && $ !== null)) {
    (function($, window) {
      return $.fn.extend({
        numberphileCounter: function() {
          var args, options;
          options = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return this.each(function() {
            var $this, data;
            $this = $(this);
            data = $this.data('numberphileCounter-class');
            if (!data) {
              $this.data('numberphileCounter-class', (data = new NumberphileCounter($this, options)));
            }
            if (typeof options === 'string') {
              return data[options].apply(data, args);
            }
          });
        }
      });
    })(window.jQuery, window);
    !(function($) {
      return $(window).bind('load', function() {
        return $('[role="counter-trigger"]').each(function() {
          var $this, data, e;
          $this = $(this);
          try {
            data = $this.data();
            if (data != null) {
              return $this.numberphileCounter(data);
            }
          } catch (_error) {
            e = _error;
            return $this.numberphileCounter({
              step: $this.attr('data-step') || 1,
              target: $this.attr('data-target') || ''
            });
          }
        });
      });
    })(window.jQuery);
  }

  /*
  jQuery plugin object to encapsulate methods and stuff
  It delegates math and conversions to {NumberphileReactor}
  @example Initialize plugin via javascript
    $('input.import').numberphile();
  @example Auto init the plugin by adding data attributes
    <input data-numberphile="auto" data-format="import" value="123"/>
  @copyright Andrea Coronese
  */


  this.Numberphile = (function() {
    var charFromEvent, eventKeyCodeFitsImport, _regexps;

    Numberphile.prototype._f_selectors = {
      numberInput: 'input[type=text], input[type=number]'
    };

    _regexps = {
      thousandsMatch: /\B(?=(\d{3})+(?!\d))/g,
      importTypableCharacter: /[0-9,\.]/g
    };

    Numberphile.prototype.defaults = {
      debug: false,
      autowire: true,
      importMaxDecimalDigits: 2,
      importDecimalSeparator: ',',
      importThoudandsSeparator: '.'
    };

    function Numberphile(element, options) {
      this.element = element;
      this.settings = $.extend(this.defaults, options);
      this.initialize();
      return this;
    }

    Numberphile.prototype.initialize = function() {
      if (this.settings.autowire) {
        if (this.element.attr('data-format') === 'import') {
          return this.element.bind('blur', function() {
            return $(this).numberphile('formatImportToHumanReadableFormat');
          }).bind('focusin', function() {
            return $(this).numberphile('editModeForImport');
          }).keydown(function(event) {
            if (!eventKeyCodeFitsImport(event)) {
              return event.preventDefault();
            }
          }).val(NumberphileReactor.get().numberToFormattedImport(this.element.val()));
        }
      }
    };

    Numberphile.prototype.humanReadableImportToNumber = function() {
      if (this.element.is(this._f_selectors.numberInput)) {
        return this.element.val(this.SToNumber(this.element.val()));
      }
    };

    Numberphile.prototype.editModeForImport = function() {
      if (this.element.is(this._f_selectors.numberInput)) {
        return this.element.val(this.SToNumber(this.element.val()).toString().replace('.', this.settings.importDecimalSeparator));
      }
    };

    Numberphile.prototype.formatImportToHumanReadableFormat = function() {
      if (this.element.is(this._f_selectors.numberInput)) {
        return this.element.val(this.numberToS(this.element.val()));
      }
    };

    eventKeyCodeFitsImport = function(event) {
      if (event.keyCode === 188 || event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || event.keyCode === 13 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
        return true;
      } else {
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
          return false;
        } else {
          return true;
        }
      }
    };

    charFromEvent = function(evt) {
      var charCode, charTyped;
      evt = evt || window.event;
      charCode = evt.which || evt.keyCode;
      charTyped = String.fromCharCode(charCode);
      return charTyped;
    };

    Numberphile.prototype.log = function(m) {
      if (this.settings) {
        if ((typeof console !== "undefined" && console !== null ? console.log : void 0) && this.settings.debug) {
          return console.log(m);
        }
      }
    };

    Numberphile.prototype.SToNumber = function(value) {
      return NumberphileReactor.get().stringToFloat(value);
    };

    Numberphile.prototype.numberToS = function(number) {
      return NumberphileReactor.get().stringToFormattedImport(number);
    };

    return Numberphile;

  })();

  if ((typeof $ !== "undefined" && $ !== null) && (typeof window !== "undefined" && window !== null)) {
    (function($, window) {
      return $.fn.extend({
        numberphile: function() {
          var args, options;
          options = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return this.each(function() {
            var $this, data;
            $this = $(this);
            data = $this.data('numberphile-class');
            if (!data) {
              $this.data('numberphile-class', (data = new Numberphile($this, options)));
            }
            if (typeof options === 'string') {
              return data[options].apply(data, args);
            }
          });
        }
      });
    })(window.jQuery, window);
  }

  if ((typeof window !== "undefined" && window !== null) && (typeof $ !== "undefined" && $ !== null)) {
    !(function($) {
      return $(window).bind('load', function() {
        return $('[data-numberphile="auto"]').numberphile();
      });
    })(window.jQuery);
  }

}).call(this);
