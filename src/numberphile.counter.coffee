# A jQuery plugin to bind elements to triggers for step values
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
    @initialize()

  # Initializes the element based on passed options.
  # @private
  initialize: ->
    if not @settings.target?
      if @element.attr('data-target')? && @element.attr('data-target') != ""
        @settings.target = $(@element.attr('data-target'))
      else
        @settings.target = @element

    if @settings.autowire
      @element.on 'click', () ->
        $(this).numberphileCounter('step')
  
  # Increments the value/text of the receiver by settings.step
  step: ->
    stepVal = @settings.step
    $(@settings.target).each () ->
      $this = $(this)
      s = NumberphileReactor.get().sum([parseInt($this.val(), 10), stepVal])
      if $this.is('input')
        $(this).val(s)
      else
        $this.text(s)


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
    $(window).on 'load', () ->
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