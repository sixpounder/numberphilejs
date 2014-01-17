# Numberphile engine for conversions & math.
class NumberphileReactor

  _T_INT = "int"
  _T_FLOAT = "float"
  _T_NUMBER = "number"

  decimalPrecision = 2

  # Parses a root value, see {NumberphileReactor#smartParseFloat} for details
  # @param {Number|String} root the root value to parse
  # @private
  parse = (root) ->
    r = new NumberphileNumber()

    if typeof root is "string"
      r.type = _T_FLOAT
      r.origin = smartParseFloat(root)
    else if typeof root is "number"
      r.type = _T_NUMBER
      r.origin = root
    r.set(smartParseFloat(root))

    return r

  # Parses a float checking if passed value is a string. If it is,
  # applies currency protocol first
  # @param {Number} v the value to conver
  # @private
  smartParseFloat = (v)->
    if typeof v is "string"
      dots = v.match(/\./g)
      commas = v.match(/,/g)

      if commas?
        commas = commas.length
      else
        commas = 0
      if dots?
        dots = dots.length
      else
        dots = 0

      if commas > 0 || (commas == 0 && dots > 1)
        # Only if a comma is present treat dots as thousands seprarators
        if dots > 0
          # Treat as thousands marker, remove everything
          v = v.replace(/\./g, '')
      v = v.replace(/,/g, '.')

    return parseFloat(v)

  # Builds a new math engine
  # @param {Number|String} v initial value
  # @param {Object} options options for this instance
  # @option options {Number} decimalPrecision the decimal precision to use (default 2)
  constructor: (v, opts = {}) ->
    @root = v
    decimalPrecision = opts.decimalPrecision || 2
    @repr = parse(@root)

  # Adds a value to the current one
  # @param {Number|String} something
  # @return {NumberphileReactor} self for chainability
  add: (something) ->
    @repr.set(@repr.value + NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision))
    @

  # Divide current value by something
  # @param {Number|String} something
  # @return {NumberphileReactor} self for chainability
  divide: (something) ->
    @repr.set(@repr.value / NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision))
    @

  # Mod operator for current value
  # @param {Number|String} something
  # @return {NumberphileReactor} self for chainability
  mod: (something) ->
    @repr.set(@repr.value % NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision))
    @

  # Multiply current value by something
  # @param {Number|String} something
  # @return {NumberphileReactor} self for chainability
  multiply: (something) ->
    @repr.set(@repr.value * NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision))
    @

  # Subtract a value from the current one
  # @param {Number|String} something
  # @return {NumberphileReactor} self for chainability
  subtract: (something) ->
    @repr.set(@repr.value - NumberphileNumber.toFixedNumber(smartParseFloat(something), decimalPrecision))
    @

  # Alias for {NumberphileReactor#val}
  result: ->
    @val()

  # Alias for {NumberphileReactor#val}
  value: ->
    @val()

  # @return {Number|String} the current result of the computation. If a format is specified conversion will take place (currently supporting 'import', 'float' or nothing)
  val: (format = null) ->
    format ?= 'float'
    format = 'float' if format == ''
    concat = @repr.value
    
    if format == 'float'
      r = concat
    
    if format == 'import'
      r = NumberphileNumber.toFixed(concat, decimalPrecision).replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    
    return r

# Represents an operation
class NumberphileOperation
  # Constructor for this class
  constructor: (@firstFactor = null, @secondFactor = null, @operator = null) ->
    @result = 0
    @remainder = null

# Represents a number with an origin and a precision
class NumberphileNumber
  # @param origin the origin of the number (will be stored for debug purposes)
  constructor: (@origin = 0) ->
    @value = @origin
    @type = "unknown"

  # Sets a value for this instance. It gets fixed with {NumberphileNumber.toFixed}
  # prior to assignment
  # @param v the value to set
  set: (v) ->
    fv = NumberphileNumber.toFixedNumber(v)
    @value = fv
    @value

  # Same as {NumberphileNumber.toFixed} but returns a number instead
  # of a string
  @toFixedNumber: (value, precision) ->
    parseFloat(NumberphileNumber.toFixed(value, precision))

  # Converts a value with a precision to a string representing it
  # @param value the value to fix
  # @param precision the decimal precision to use (default 2)
  @toFixed: (value, precision) ->
    precision = precision || 2
    neg = value < 0
    power = Math.pow(10, precision)
    value = Math.round(value * power)
    integral = String(((if neg then Math.ceil else Math.floor))(value / power))
    fraction = String(((if neg then -value else value)) % power)
    padding = new Array(Math.max(precision - fraction.length, 0) + 1).join("0")
    if precision then integral + "." + padding + fraction else integral


# Wrapper function to instantiate a new reactor object
# allowing syntax like N(42).add(...) ...
@N = (anyValue) ->
  return new NumberphileReactor(anyValue)

if exports?
  exports.NumberphileReactor = NumberphileReactor
  exports.N = (anyValue) ->
    return new NumberphileRector(anyValue)