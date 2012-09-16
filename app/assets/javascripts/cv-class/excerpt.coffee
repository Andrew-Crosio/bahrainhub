Class('Excerpt')({
  prototype: {
    
    init: (element, options) ->
      @options = {
        showChar     : 114
        ellipsestext : '...'
        moreText     : '.more-quote'
      }

      $.extend(@options, options)

      @element = if typeof element is 'string' then $(element) else element
      @quote = @element.children('em')
      @button = @element.children('em').next('a')
      @moreText = $(@options.moreText)
      @_bindEvents()

    _bindEvents: ->
      characters = @options.showChar
      quote = @quote
      quoteCont = @quote.html()
      if quoteCont?
        quoteSize = quoteCont.length
      else
        quoteSize = 0

      ellipsestext = @options.ellipsestext

      if quoteSize > @options.showChar
        c = quoteCont.substr(0, characters)
        h = quoteCont.substr(characters, quoteSize - characters)
        quote.html(c + '<span class="ellipsestext">' + ellipsestext + '</span><span class="more-quote">' + h + '</span>')
        $('.more-quote').hide()
      else
        @button.hide()

      @button.click =>
        if $('.more-quote').is(':hidden')
          $('.more-quote').toggle()
          $('.ellipsestext').hide()
          $(this).children('span').html("Less")
          @element.trigger('excerpt.toggle')
        else
          $('.more-quote').toggle()
          $('.ellipsestext').show()
          $(this).children('span').html("More")
          @element.trigger('excerpt.toggle')
  }
})

