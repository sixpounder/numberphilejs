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
    #r.intPart = intPartFor(root)
    #r.decimalPart = decimalPartFor(root)
    r.value = smartParseFloat(root)

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

  intPartFor = (v) ->
    if typeof v is "string"
      v = smartParseFloat(v)
    return parseInt(v.toFixed(), 10)

  decimalPartFor = (v) ->
    if typeof v is "string"
      v = smartParseFloat(v)
    return (v % 1).toPrecision(decimalPrecision) * Math.pow(10,decimalPrecision)

  constructor: (v, opts = {}) ->
    @root = v
    decimalPrecision = opts.decimalPrecision || 2
    @repr = parse(@root)

  add: (something) ->
    @repr.value += smartParseFloat(something)
    @

  divide: (something) ->
    @repr.value = @repr.value / smartParseFloat(something)
    @

  mod: (something) ->
    @repr.value = @repr.value % smartParseFloat(something)
    @

  intPart: () ->
    intPartFor(@repr.value)

  decimalPart: () ->
    decimalPartFor(@repr.decimalPart)

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
      r = concat.toFixed(decimalPrecision).replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    
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

if exports?
  exports.Numberphiler = Numberphiler

if window?
  @N = (anyValue) ->
    return new Numberphiler(anyValue)