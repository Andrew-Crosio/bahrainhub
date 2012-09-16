window.initializeMap = ->
    script = $('<script type="text/javascript" />')
    script.attr('src', "/javascripts/cv-class/map.js")
    $('head').append(script)
    window.map = new Map('.map-container', {center: Map.at(26.0275, 50.5500)})
    Map.getLocations( (locations) ->
      for i in [0..locations.length]
        loc = locations[i].location
        position = null
        label = locations[i].voices.length
        title = label + ' voice(s) in ' + loc
        content = '<ul class="map-voices">'
        for j in [0..locations[i].voices.length]
          voice = locations[i].voices[j]
          if not position
            position = Map.at(voice.latitude, voice.longitude)
          content += '<li><a href="/' + voice.slug + '">' + voice.title + '</a></li>'

        content += '</ul>'

        window.map.addPin(position, title, label, content)
    )

$( ->
    new Tooltip('.mapit')
    new Tooltip('.addVoice')
    new SidebarToggler()
    new Accordion('.accordion')
    new SlideSection('.login', '.login-sec')
    new SlideSection('.signup', '.register-sec')
    new LiveFilter('.voice-search > .search', '.searchable')
    new JsonForm('form.register-form', ->
      location.reload()
    )
    new JsonForm('form.login-form', ->
      location.reload()
    )

    # TODO: Move this to a widget
    $('.map-btn').click( ->
      $('.main-container, .map-container').toggle()

      $('.map-btn').toggleClass('map-active')

      if not window.map
        script = $('<script type="text/javascript" />')
        script.attr('src', "http://maps.google.com/maps/api/js?sensor=false&callback=initializeMap")
        $('head').append(script)

      if not $('.map-btn').hasClass('map-active')
        $('.map-container').trigger('map.hide')

      false
    )

    $('.searchable li a[href="'+location.pathname+'"]').parent().addClass('select')

    # TODO: Improve this and move to some widget
    $('.info-tool-link.map').click ->
      windowWidth = $(document).width()
      spaceWidth = $('.voice-subtitle').outerWidth()

      $('.map-overlay').show()

    $('.map-overlay .back-to-voice span').click ->
      $('.map-overlay').hide()

    $('[data-action=submit]').live 'click', ->
      $(this).closest('form').submit()
      false

    $('.voice-search input[placeholder]').placeholder()
    $('.scroller').jScrollPane({ autoReinitialise: true })
    $('.voice-box').css('visibility', 'hidden')

    if $('.flash').length
      setTimeout( ->
        $('.flash').hide('blind')
      , 5000)

    $('.flash > .close-message').click ->
      $(this).parent().hide('blind')
      false
    
    if $('.header-sponsor').is(':visible') is true
      $('.voice-subtitle').addClass('sponsor-padding')
      $('.voice-info').css('min-height', '131px')

    DynamicMeasures.update()
)

$(window).load ->
  if typeof background_loader_init isnt 'undefined'
    background_loader_init()
.resize ->
    DynamicMeasures.update()

# News Ticker
$(document).ready ->
  captionHeight = $('.feature-voice .caption').outerHeight()
  paragraphHeight = $('.feature-voice .caption p').height()
  patternHeight = $('.feature-voice .caption').parent().outerHeight()
  captionSibling = $('.feature-voice .caption').prev()[0]

  if $(paragraphHeight) > '19'
    $(captionSibling).css({ 'height': patternHeight - captionHeight })
  else
    false

  $('ul.news-ticker').each ->
    if $(this).children().length
        $(this).liScroll({travelocity: 0.08})

$(window).bind 'resize', ->
  captionHeight = $('.feature-voice .caption').outerHeight()
  paragraphHeight = $('.feature-voice .caption p').height()
  patternHeight = $('.feature-voice .caption').parent().outerHeight()
  captionSibling = $('.feature-voice .caption').prev()[0]

  if $(paragraphHeight) > '19'
    $(captionSibling).css({ 'height': patternHeight - captionHeight })
  else
    false