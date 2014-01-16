###
A jQuery plugin to bind elements to triggers for step values
###
class @NumberphileCounter
  # Default options
  # @private
  defaults:
    debug: false
    autowire: true
    step: 1
    target: null

  # @param {Object} element wrapped jQuery.fn element to extend
  # @param {Object} options plugin options
  # @option options {Boolean} autowire set to true if you want Numberphile to autowire a bunch of events on the element (such as blur, keydown...) - default true
  # @option options {Integer} step the step for increment and decrements operations
  constructor: (@element, options) ->
    @settings = $.extend @defaults, options
    @settings.step = parseInt(@settings.step, 10)
    return @initialize()

  # Initializes the element based on passed options.
  # @private
  initialize: ->
    if not @settings.target?
      if @element.attr('data-target')? && @element.attr('data-target') != ""
        @settings.target = $(@element.attr('data-target'))
      else
        @settings.target = @element

    if @settings.autowire
      @element.bind 'click', () ->
        $(this).numberphileCounter('step')

    return @
  
  # Increments the value/text of the receiver by settings.step (can be negative).
  # This is automatically binded to matched elements click event
  # by default (see autowire property)
  # @example Manual plugin method call
  #   $('button').numberphileCounter('step')
  step: ->
    stepVal = @element.attr('data-step')
    targets = $(@element.attr('data-target'))
    targets.each () ->
      $this = $(this)
      base = parseFloat($this.val())
      s = parseFloat(stepVal)
      s = s + base
      if $this.is('input')
        $(this).val(s)
      else
        $this.text(s)

      $this.trigger('numberphile:step')

if window? && $?
  (($, window) ->
    $.fn.extend
      numberphileCounter: (options, args...) ->
        @each ->
          $this = $(this)
          data = $this.data('numberphileCounter-class')
          if !data
            $this.data 'numberphileCounter-class', (data = new NumberphileCounter($this, options))
          if typeof options is 'string'
            data[options].apply(data, args)
  ) window.jQuery, window

  !(($) ->
    $(window).bind 'load', () ->
      $('[role="counter-trigger"]').each () ->
        $this = $(this)
        try
          data = $this.data()
          if data?
            $this.numberphileCounter(data)
        catch e
          # Maybe there's an old jQuery version
          $this.numberphileCounter
            step: $this.attr('data-step') || 1
            target: $this.attr('data-target') || ''
  ) window.jQuery