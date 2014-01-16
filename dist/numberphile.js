(function() {
  var _,
    __slice = [].slice;

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
      importNonTypableCharacters: /[^A-Za-z\d,]/g
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
      return parseFloat(repr.toString().replace(this.regexps.importNonTypableCharacters, "").replace(this.settings.importDecimalSeparator, this.settings.importThoudandsSeparator));
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

  if (typeof module !== "undefined" && module !== null) {
    module.exports = this.NumberphileReactor;
  }

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
      this.initialize();
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
        return this.element.on('click', function() {
          return $(this).numberphileCounter('step');
        });
      }
    };

    NumberphileCounter.prototype.step = function() {
      var stepVal;
      stepVal = this.settings.step;
      return $(this.settings.target).each(function() {
        var $this, s;
        $this = $(this);
        s = NumberphileReactor.get().sum([parseInt($this.val(), 10), stepVal]);
        if ($this.is('input')) {
          return $(this).val(s);
        } else {
          return $this.text(s);
        }
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
      return $(window).on('load', function() {
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
    }

    Numberphile.prototype.initialize = function() {
      if (this.settings.autowire) {
        if (this.element.attr('data-format') === 'import') {
          return this.element.on('blur', function() {
            return $(this).numberphile('formatImportToHumanReadableFormat');
          }).on('focusin', function() {
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
      return $(window).on('load', function() {
        return $('[data-numberphile="auto"]').numberphile();
      });
    })(window.jQuery);
  }

}).call(this);
