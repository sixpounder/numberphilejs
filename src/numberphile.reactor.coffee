if window?
  if $?
    _ = $
  else
    throw new Error("jQuery is required by NumberphileJS when running in a browser")
else
  _ = require 'underscore'

###
Numberphile engine for conversions & math.
@example Instantiate and retrieve via
  NumberphileReactor.get()
See {NumberphileReactor.get} for more details
@copyright Andrea Coronese
###
class @NumberphileReactor
  instance = null

  # Get the {NumberphileReactor} instance
  # @return [NumberphileReactor] the singleton instance for the NumberphileReactor
  @get: ->
    if not @instance?
      instance = new @
      instance.init("NumberphileReactor")
    instance

  # A set of regular expressions for internal use
  regexps:
    thousandsMatch: /\B(?=(\d{3})+(?!\d))/g
    importTypableCharacter: /[0-9,\.]/g
    importNonTypableCharacters: /[^A-Za-z\d,]/g

  # Default options when not specified
  defaults:
    debug: false
    importDecimalSeparator: ","
    importThoudandsSeparator: "."
    importMaxDecimalDigits: 2

  # Initializes the reactor. This is automatically called for you.
  # @param {String} name a name for the instance
  # @param {Object} options options for the instance
  # @private
  init: (name = "unknown", options = {}) ->
    @settings = _.extend(@defaults, options)
    @log "#{name} initialized"

  # Set options for the instance
  # @param {Object} options options to set
  setup: (options)->
    @settings = _.extend(@defaults, options) if options?

  # Utility log method
  # @private
  log: (m) ->
    if console?.log && @settings.debug
      console.log(m)

  # Converts a string with optional thousands and decimal separators
  # into a float with settings.importMaxDecimalDigits precision
  # @param {String} repr representation of the number as a String
  # @return {Float} a float with settings.importMaxDecimalDigits precision
  stringToFloat: (repr)->
    return parseFloat(repr.toString().replace(@regexps.importNonTypableCharacters, "").replace(@settings.importDecimalSeparator, @settings.importThoudandsSeparator))

  # Converts a number into a string with settings.importMaxDecimalDigits decimals
  # and settings.importThoudandsSeparator each thousand digit
  # @param {Number} number the numeric value to convert
  # @return {String} a string representation of the number
  numberToFormattedImport: (number) ->
    @stringToFormattedImport(number.toString())

  # Converts a string into a string with settings.importMaxDecimalDigits decimals
  # and settings.importThoudandsSeparator each thousand digit
  # @param {String} repr representation of the numeric value to convert
  # @return {String} a string representation of the number
  stringToFormattedImport: (repr) ->
    out = ""
    if typeof repr is 'string'
      p = repr.indexOf @settings.importDecimalSeparator
      if p == -1
        @log "No decimals found by character " + @settings.importDecimalSeparator
        out = repr + @settings.importDecimalSeparator + "00"
      else
          
        intPart = repr.split(@settings.importDecimalSeparator)[0]
        decimalPart = repr.split(@settings.importDecimalSeparator)[1]

        if decimalPart.length > @settings.importMaxDecimalDigits
          
          decimalPart = decimalPart.substring 0, @settings.importMaxDecimalDigits

        else
          if decimalPart.length > @settings.importMaxDecimalDigits
            remainingChars = 0
          else
            remainingChars = @settings.importMaxDecimalDigits - decimalPart.length
        
        # Fill decimals
        if remainingChars != 0
          for j in [1..remainingChars]
            decimalPart += "0"

        @log "int part: " + intPart + " decimal part: " + decimalPart
        out = intPart + @settings.importDecimalSeparator + decimalPart
      
      out = out.replace @regexps.thousandsMatch, @settings.importThoudandsSeparator
      @log "final representation: " + out
      return out
      
    else
      return repr

  # Sums an array of numbers or string representation of numbers
  # mantaining a precision of settings.importMaxDecimalDigits
  # @param {Array} reprs array of numbers or string representation of numbers
  # @return {Float} the sum of the numbers in the array
  sum: (reprs) ->
    if reprs?
      if Object.prototype.toString.call( reprs ) is '[object Array]'
        return @sumImpl(reprs)
      else if typeof reprs is "string"
        return @sumImpl(reprs.split("|"))
      else
        return 0
    else
      return null
  
  # Implementation of the sum in an array of objects
  # @private
  sumImpl: (arr)->
    s = 0
    for number in arr
      n = number
      if typeof n is "string"
        n = @stringToFloat(n)
      s += n
    parseFloat(s.toFixed(@settings.importMaxDecimalDigits))

# NodeJS exports if node env and exports defined (see node modules)
if module?
  module.exports = @NumberphileReactor