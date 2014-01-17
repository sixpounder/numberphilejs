###
jQuery plugin object to encapsulate methods and stuff
It delegates math and conversions to {NumberphileReactor}
@example Initialize plugin via javascript
  $('input.import').numberphile();
@example Auto init the plugin by adding data attributes
  <input data-numberphile="auto" data-format="import" value="123"/>
@copyright Andrea Coronese
###
class @Numberphile

  # @private
  _f_selectors:
    numberInput: 'input[type=text], input[type=number]'

  # @private
  _regexps =
    thousandsMatch: /\B(?=(\d{3})+(?!\d))/g
    importTypableCharacter: /[0-9,\.]/g

  # Default options
  # @private
  defaults:
    debug: false
    autowire: true
    autofocus: false
    importMaxDecimalDigits: 2
    importDecimalSeparator: ','
    importThoudandsSeparator: '.'

  # @param {Object} element wrapped jQuery.fn element to extend
  # @param {Object} options plugin options
  # @option options {Boolean} autowire set to true if you want Numberphile to autowire a bunch of events on the element (such as blur, keydown...) - default true
  # @option options {Boolean} importmaxDecimalDigits maximum number of decimal digits for imports - default 2
  # @option options {Boolean} importDecimalSeparator decimal separator for imports - default ','
  # @option options {Boolean} importThoudandsSeparator thousands separator for imports - default '.'
  constructor: (@element, options) ->
    @settings = $.extend @defaults, options
    @initialize()

    return @

  # Initializes the element based on passed options.
  # @private
  initialize: ->
    if @element.attr('data-autofocus') == "true"
      @settings.autofocus = true

    if @settings.autowire

      if @element.attr('data-format') is 'import'
        @element.bind 'blur', () ->
          $(this).numberphile('formatImportToHumanReadableFormat')
        .bind 'focus', () ->
          $(this).numberphile('editModeForImport')
        .keydown (event) ->
          if !eventKeyCodeFitsImport(event)
            event.preventDefault()
        .val( N(@element.val()).val('import') )

    if @settings.autofocus
      @element.bind 'focus', () ->
        this.select()

  # Call this to format matched element value in a simple numeric format
  # @example
  #   $('input.import').numberphile('humanReadableImportToNumber')
  humanReadableImportToNumber: ->
    if @element.is(@_f_selectors.numberInput)
      @element.val(@SToNumber(@element.val()))

  # Call this to format matched element value in a way that can be edited by
  # a user. If autowire is true this is automatically attached to element focusin event
  # @example
  #   $('input.import').numberphile('editModeForImport')
  editModeForImport: ->
    if @element.is(@_f_selectors.numberInput)
      @element.val(@SToNumber(@element.val()).toString().replace('.', @settings.importDecimalSeparator))

  # Call this to format matched element value in a human readable import format.
  # If autowire is true this is automatically attached to element blur event
  # @example
  #   $('input.import').numberphile('formatImportToHumanReadableFormat')
  formatImportToHumanReadableFormat: ->
    if @element.is(@_f_selectors.numberInput)
      @element.val(@numberToS(@element.val()))

  # See if an event keyCode is fit for an import value
  # @private
  eventKeyCodeFitsImport = (event)->
    if (
      event.keyCode == 188 ||
      event.keyCode == 46 ||
      event.keyCode == 8 ||
      event.keyCode == 9 ||
      event.keyCode == 27 ||
      event.keyCode == 13 ||
      (event.keyCode == 65 && event.ctrlKey == true) ||
      (event.keyCode >= 35 && event.keyCode <= 39)
    )
      return true
    else
      if (
        event.shiftKey ||
        (event.keyCode < 48 || event.keyCode > 57) &&
        (event.keyCode < 96 || event.keyCode > 105)
      )
        return false
      else
        return true

  # Gets the typed char out of a DOM event
  # @private
  charFromEvent = (evt)->
    evt = evt || window.event
    charCode = evt.which || evt.keyCode
    charTyped = String.fromCharCode(charCode)
    charTyped

  # Simple log method
  # @private
  log: (m) ->
    if @settings
      if console?.log && @settings.debug
        console.log(m)

  # Converts a string to a number
  # @private
  SToNumber: (value)->
    N(value).val()

  # Converts a number to a formatted import
  # @private
  numberToS: (number)->
    N(number).val('import')

# Only extend jQuery if jQuery is present
if $? && window?
  (($, window) ->
    $.fn.extend
      numberphile: (options, args...) ->
        @each ->
          $this = $(this)
          data = $this.data('numberphile-class')
     
          if !data
            $this.data 'numberphile-class', (data = new Numberphile($this, options))
          if typeof options is 'string'
            data[options].apply(data, args)
  ) window.jQuery, window

if window? && $?
  !(($) ->
    $(window).bind 'load', ()->
      $('[data-numberphile="auto"]').numberphile()
  ) window.jQuery