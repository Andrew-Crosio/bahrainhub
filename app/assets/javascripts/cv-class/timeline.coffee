Class('Timeline')({
  currentPage: 1

  loadPage: (page) ->
    page = page or Timeline.currentPage;
    params = '?page=' + page
    if $.deparam.querystring().mod
      params += '&mod=1'
    
    if @startDate
      params += '&start=' + @startDate
    
    $.getScript(location.pathname + params)

  loadDate: (date, callback) ->
    params = '?start=' + date
    @startDate = date
    @currentPage = 1
    if $.deparam.querystring().mod
      params += '&mod=1'
    
    $.getScript location.pathname + params, ->
      $.isFunction(callback) and callback()
    
  checkScroll: ->
    if Timeline.nearBottom()
      Timeline.currentPage++
      Timeline.loadPage()
    else
      setTimeout(Timeline.checkScroll, 250)

  nearBottom: ->
    (Timeline.pageHeight() - $(window).height()) > 550 and (Timeline.pageHeight() - (window.pageYOffset + self.innerHeight)) <= 550

  pageHeight: ->
    Math.max(document.body.scrollHeight, document.body.offsetHeight, $(document).height())

  months: [0, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  build: (element, dates) ->
    @element = element
    @dates = dates
    @bottomScroller = $('.bottom-scroll')
    @topScroller = $('.top-scroll')
    @slider = @element.find('#slider-vertical')
    @scrollable = $.browser.mozilla or if $.browser.msie then 'html' else 'body'
    @_createYearSliders()
    @_setHeight()
    @_createSlider()
    @_hoverBind()
    @_bindMouseWheel()
    @updateSliderPosition()
    @_resizeWindow()

    setTimeout(Timeline.checkScroll, 2000)
    $('.flash-message').bind 'flash.close', =>
      @sliderTop -= 45
      @_setHeight()
    
  updateSliderPosition: ->
    visible = $.grep( $('.voices-container > .voice-box'), (n) =>
        n = $(n)
        y1 = $('.voices-container').offset().top
        y = $('body').height() - y1
        fromTop = n.offset().top - y1 - $(@scrollable).scrollTop()
        fromTop < y and fromTop > y1
      ).map( (n, i) ->
        $(n).data('created-at')
      )

    if visible.length
      date = visible.sort()[0]
      year = parseInt(/(\d{4})-\d{2}-\d{2}/.exec(date)[1], 10)
      if year isnt @current_year
        @_setYear(year, false)
      
      val = $.inArray(date, @currentYearDates())
      if val > -1
        @slider.slider('value', val)

  checkAnnouncement: ->
    msg = $('.flash-message')
    scrolledUp = $(@scrollable).scrollTop() > $('.flash-message').height()
    
    if msg.length and msg.is(':visible')
      if not msg.data('hidden') and scrolledUp
        @sliderTop -= 45
        msg.data('hidden', true)
        @_setHeight()
        @element.css('top', @sliderTop)
      else if msg.data('hidden') and not scrolledUp
        @sliderTop += 45
        msg.data('hidden', false)
        @_setHeight()
        @element.css('top', @sliderTop)
      
  _bindMouseWheel: ->
    $('.voices-container, #slider-vertical').bind 'mousewheel', (ev, delta, deltaX, deltaY) =>
      if not @sliding
        scrolltop = $(@scrollable).scrollTop() - deltaY * 10
        @_scroll(scrolltop)
      
  _scroll: (scrolltop) ->
    $(@scrollable).scrollTop(scrolltop)
    @updateSliderPosition()
    @checkAnnouncement()

  _createYearSliders: ->
    items = ''
    _this = this
    template = $('#timeline-deactivated').html()

    @min_year = 3000
    @max_year = 0

    if @dates?
        for year in @dates
          if @dates.hasOwnProperty(year)
            year = parseInt(year)
            if year > @max_year
              @max_year = year

            if year < @min_year
              @min_year = year

        for year in @dates
          if @dates.hasOwnProperty(year) and parseInt(year) isnt @max_year
            items = template.replace(/{{year}}/g, year) + items
      
    if items.length
      @element.append(items)
      @element.delegate '.disactivated-timeliner', 'click', ->
        _this._setYear($(this).data('year'))
        false
      
  _setYear: (year, scrollBody) ->
    console.log('year:');
    console.log(year);

    diff = @current_year - year
    parent = @slider.parent()

    if diff > 0 # bottom year selected
      parent.nextAll('.disactivated-timeliner').filter(':lt('+diff+')').each ->
        y = $(this).data('year') + 1
        $(this).data('year', y).find('.year-text').text(y).end().insertBefore(parent)

    else # top year selected
      diff *= -1
      parent.prevAll('.disactivated-timeliner').filter(':lt('+diff+')').each ->
        y = $(this).data('year') - 1
        $(this).data('year', y).find('.year-text').text(y).end().insertAfter(parent)
      
    @current_year = year
    @_updateSliderRanges()
    @_updateSlider()
    if scrollBody isnt false
      @scrollToDate(@currentYearDates()[@currentYearDates().length - 1], =>
        @checkAnnouncement()
      )

  _createSliderThicks: ->
    thicks = ''
    dates_length = @currentYearDates().length
    first_thick = if dates_length > 150 then -> false else -> i == 0

    for i in [dates_length-1..0] by -1
      date = @currentYearDates()[i]
      dateparts = (/\d{4}-(\d{2})-(\d{2})/).exec(date)
      month = parseInt(dateparts[1], 10)
      day = dateparts[2]
      percent = i / @slider_max * 100
      if i > 0
        next_month = parseInt((/\d{4}-(\d{2})-\d{2}/).exec(@currentYearDates()[i - 1])[1], 10)
      
      thicks += '<li style="bottom: ' + percent + '%">'
      if first_thick() or (next_month and month isnt next_month)
        thicks += '<span class="thick-mark"></span><span class="month-label" style="visibility:hidden">' + @months[month] + '</span>'
      else
        thicks += '<span class="minor-thick-mark" title="' + date + '"></span>'
      
      thicks += '</li>'
    
    @slider_tip.text(@months[month] + ' ' + day)
    @slider_thicks.html(thicks)
      .find('> li').addClass("value-dot").end()
      .find('ul > li').addClass("values-sep-dot")

  _onStop: (ui) ->
    @slider_tip.text(@parseDate(@currentYearDates()[ui.value]))
    @scrollToDate(@currentYearDates()[ui.value])

  _onChange: (ui) ->
    # console.log(ui.value)
    # console.log(@currentYearDates())
    @slider_tip.text(@parseDate(@currentYearDates()[ui.value]))

  parseDate: (date) ->
    dateparts = (/\d{4}-(\d{2})-(\d{2})/).exec(date)
    month = parseInt(dateparts[1], 10)
    day = dateparts[2]
    @months[month] + ' ' + day

  scrollToDate: (date, callback) ->
    @sliding = true

    ele = $('.voices-container > [data-created-at='+date+']')

    if ele.length
      $(@scrollable).animate({scrollTop: ele.position().top}, ->
        $.isFunction(callback) and callback()
      )
    else
      @loadDate(date, callback)

    @sliding = false
    @hide()

  _updateSlider: ->
    @_createSliderThicks()
    @slider.slider('option', 'max', @slider_max).slider('value', @slider_max)

  _updateSliderRanges: ->
    @slider_max = @currentYearDates().length - 1

  currentYearDates: ->
    Array.apply(null, @dates[@current_year.toString()]).reverse()

  _createSlider: ->
    @current_year = @max_year
    @_updateSliderRanges()

    @slider.slider({
      orientation: 'vertical',
      min: 0,
      max: 1,
      value: 1,
      range: 'max',
      slide: (e, ui) =>
        @_onChange(ui)
      ,
      stop: (e, ui) =>
        @_onStop(ui)
      ,
      change: (e, ui) =>
        @_onChange(ui)
    })
    @slider_thicks = $('<ul class="slider-values"/>').css({height: '100%'}).appendTo(@slider)
    @slider_tip = $('<span class="sl-month" id="slider-tip"/>').appendTo(@slider.find(".ui-slider-handle"))
    @_updateSlider()
    $('<div></div>', {"class": "slider-line", css: {height: @slider.height() - 12}}).appendTo(@slider)
    @topScroller.css({top: $('.main-header').height()})
    @bottomScroller.css({bottom: 35})
    @topScroller.hover(
      =>
        @autoScrollOn = true
        @_autoScroll(2)
      =>
        @autoScrollOn = false
    )
    @bottomScroller.hover(
      =>
        @autoScrollOn = true
        @_autoScroll(-2)
      =>
        @autoScrollOn = false
    )

  _autoScroll: (delta) ->
    if not @sliding
      scrolltop = $(@scrollable).scrollTop() - delta * 10
      @_scroll(scrolltop)
      if @autoScrollOn
        setTimeout( =>
          @_autoScroll(delta)
        , 50)

  _setHeight: ->
    @element.css("top", $('.voices-container').offset().top)
    @sliderTop = @sliderTop || @slider.offset().top
    deactivated = $('.timeliner.disactivated-timeliner', @element)
    h = $(window).height() - @sliderTop - ((deactivated.height()) * deactivated.length) - 30
    @slider.height(h)
    @slider.find('.slider-line').height(h - 12)

  show: ->
    toggleable = $('.disactivated-timeliner .year-label', @element).hide()
    @element.next().children('.voices-container').stop().animate({right: 30})
    @element.find('.slider-values .month-label').css({visibility: 'visible'})
    toggleable.show()

  hide: ->
    if not @sliding
      toggleable = $('.disactivated-timeliner .year-label', @element).hide()
      @element.next().children('.voices-container').stop().animate({right: 0})
      @element.find('.slider-values .month-label').css({visibility: 'hidden'})
      toggleable.hide()
    
  _hoverBind: ->
    toggleable = $('.disactivated-timeliner .year-label', @element).hide()
    $('> li:last', @element).addClass('last')
    @element.bind('mouseover', =>
      @show()
    ).bind('mouseleave', =>
      @hide()
    )

  _resizeWindow: ->
    $(window).bind('resize', =>
      @_setHeight()
      $('#slider-vertical').find('.slider-line').css({height: @slider.height() - 12})
    )
})