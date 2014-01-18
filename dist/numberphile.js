(function() {
  var NumberphileNumber, NumberphileOperation, NumberphileReactor,
    __slice = [].slice;

  NumberphileReactor = (function() {
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
        if (v === "") {
          v = 0;
        } else {
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
      }
      return parseFloat(v);
    };

    function NumberphileReactor(v, opts) {
      if (opts == null) {
        opts = {};
      }
      this.root = v;
      decimalPrecision = opts.decimalPrecision || 2;
      this.repr = parse(this.root);
    }

    NumberphileReactor.prototype.add = function(something) {
      this.repr.set(this.repr.value + NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision));
      return this;
    };

    NumberphileReactor.prototype.divide = function(something) {
      this.repr.set(this.repr.value / NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision));
      return this;
    };

    NumberphileReactor.prototype.mod = function(something) {
      this.repr.set(this.repr.value % NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision));
      return this;
    };

    NumberphileReactor.prototype.multiply = function(something) {
      this.repr.set(this.repr.value * NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision));
      return this;
    };

    NumberphileReactor.prototype.subtract = function(something) {
      this.repr.set(this.repr.value - NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision));
      return this;
    };

    NumberphileReactor.prototype.result = function() {
      return this.val();
    };

    NumberphileReactor.prototype.value = function() {
      return this.val();
    };

    NumberphileReactor.prototype.val = function(format) {
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
        r = NumberphileNumber.toFixed(concat, decimalPrecision).replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      return r;
    };

    return NumberphileReactor;

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

    NumberphileNumber.prototype.set = function(v) {
      var fv;
      fv = NumberphileNumber.toFixedNumber(v);
      this.value = fv;
      return this.value;
    };

    NumberphileNumber.toFixedNumber = function(value, precision) {
      return parseFloat(NumberphileNumber.toFixed(value, precision));
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
        return integral + "." + padding + fraction;
      } else {
        return integral;
      }
    };

    return NumberphileNumber;

  })();

  this.N = function(anyValue) {
    return new NumberphileReactor(anyValue);
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.NumberphileReactor = NumberphileReactor;
    exports.N = function(anyValue) {
      return new NumberphileRector(anyValue);
    };
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
      autofocus: false,
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
      if (this.element.attr('data-autofocus') === "true") {
        this.settings.autofocus = true;
      }
      if (this.element.attr('data-autowire') === "true") {
        this.settings.autowire = true;
      }
      if (this.settings.autowire) {
        if (this.element.attr('data-format') === 'import') {
          this.element.bind('blur', function() {
            return $(this).numberphile('formatImportToHumanReadableFormat');
          }).bind('focus', function() {
            return $(this).numberphile('editModeForImport');
          }).keydown(function(event) {
            if (!eventKeyCodeFitsImport(event)) {
              return event.preventDefault();
            }
          }).val(N(this.element.val()).val('import'));
        }
      }
      if (this.settings.autofocus) {
        return this.element.bind('focus', function() {
          return this.select();
        });
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
      if (this.element.is(this._f_selectors.numberInput) && this.element.val() !== "") {
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
      return N(value).val();
    };

    Numberphile.prototype.numberToS = function(number) {
      return N(number).val('import');
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
        return $('[data-numberphile="auto"]').each(function() {
          var $this, data, e;
          $this = $(this);
          try {
            data = $this.data();
            if (data != null) {
              return $this.numberphile(data);
            }
          } catch (_error) {
            e = _error;
            return $this.numberphile({
              autowire: $this.attr('data-autowire') === "true" ? true : false,
              autofocus: $this.attr('data-autofocus') === "true" ? true : false,
              importMaxDecimalDigits: $this.attr('data-importMaxDecimalDigits'),
              importDecimalSeparator: $this.attr('data-importDecimalSeparator'),
              importThoudandsSeparator: $this.attr('data-importThoudandsSeparator')
            });
          }
        });
      });
    })(window.jQuery);
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
        return $this.trigger('numberphile:change');
      });
    };

    NumberphileCounter.prototype.set = function(v) {
      var targets;
      targets = $(this.element.attr('data-target'));
      return targets.each(function() {
        var $this, s;
        $this = $(this);
        s = parseFloat(v);
        if ($this.is('input')) {
          $(this).val(s);
        } else {
          $this.text(s);
        }
        return $this.trigger('numberphile:change');
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

}).call(this);
