class Numberphiler

  _T_INT = "int"
  _T_FLOAT = "float"
  _T_NUMBER = "number"

  decimalPrecision = 2

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

  # intPartFor = (v) ->
  #   if typeof v is "string"
  #     v = smartParseFloat(v)
  #   return parseInt(smartToFixed(v), 10)

  # decimalPartFor = (v) ->
  #   if typeof v is "string"
  #     v = smartParseFloat(v)
  #   return (v % 1).toPrecision(decimalPrecision) * Math.pow(10,decimalPrecision)

  constructor: (v, opts = {}) ->
    @root = v
    decimalPrecision = opts.decimalPrecision || 2
    @repr = parse(@root)

  add: (something) ->
    @repr.set(@repr.value + NumberphileNumber.toFixed(smartParseFloat(something)))
    @

  divide: (something) ->
    @repr.set(@repr.value / NumberphileNumber.toFixed(smartParseFloat(something)))
    @

  mod: (something) ->
    @repr.set(@repr.value % NumberphileNumber.toFixed(smartParseFloat(something)))
    @

  multiply: (something) ->
    @repr.set(@repr.value * NumberphileNumber.toFixed(smartParseFloat(something)))
    @

  subtract: (something) ->
    @repr.set(@repr.value - NumberphileNumber.toFixed(smartParseFloat(something)))
    @

  # intPart: () ->
  #   intPartFor(@repr.value)

  # decimalPart: () ->
  #   decimalPartFor(@repr.decimalPart)

  # Alias for {Numberphiler#val}
  result: ->
    @val()

  # Alias for {Numberphiler#val}
  value: ->
    @val()

  # @return the current result of the computation
  val: (format = null) ->
    format ?= 'float'
    format = 'float' if format == ''
    # concat = @repr.intPart + (@repr.decimalPart * Math.pow(10, - decimalPrecision))
    concat = @repr.value
    
    if format == 'float'
      r = concat
    
    if format == 'import'
      r = smartToFixed(concat).replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    
    return r

class NumberphileOperation
  constructor: (@firstFactor = null, @secondFactor = null, @operator = null) ->
    @result = 0
    @remainder = null

class NumberphileNumber
  constructor: (@origin = 0) ->
    @value = @origin
    @type = "unknown"

  intPart: () ->

  decimalPart: () ->

  set: (v) ->
    fv = NumberphileNumber.toFixed(v)
    @value = parseFloat(fv)
    @value

  @toFixed: (value, precision) ->
    precision = precision || 2
    neg = value < 0
    power = Math.pow(10, precision)
    value = Math.round(value * power)
    integral = String(((if neg then Math.ceil else Math.floor))(value / power))
    fraction = String(((if neg then -value else value)) % power)
    padding = new Array(Math.max(precision - fraction.length, 0) + 1).join("0")
    if precision then parseFloat(integral + "." + padding + fraction) else parseFloat(integral)

if exports?
  exports.Numberphiler = Numberphiler

if window?
  @N = (anyValue) ->
    return new Numberphiler(anyValue)