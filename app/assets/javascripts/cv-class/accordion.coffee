Class('Accordion')({
  prototype:{

    init: (element) ->
      @element = if typeof element is 'string' then $(element) else element
      @_bindEvents()

    _bindEvents: ->
      @element.parent().click =>
        @toggle @element.children

    toggle: (panel) ->
      panel.parent().next('ul').stop(false,true).slideToggle 'fast'
      panel.toggleClass 'down-arrow'
  }
})