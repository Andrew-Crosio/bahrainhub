#important, compile with -b modifier
tt_image = tt_video = tt_link = tt_flag = posts_filter = overlays = votes = voice_loaded = ''

$(->
  tt_image = new Tooltip('.tool-image')
  tt_video = new Tooltip('.tool-video')
  tt_link = new Tooltip('.tool-link')
  carousel = new Carousel()
  tt_moderate = new Tooltip('.mod')
  tt_public = new Tooltip('.public')
  tt_flag = new ActionTooltip('.flag-div')
  posts_filter = new Filters('.filters', '.voice-box')
  votes = new Votes('.vote-post')

  new Tooltip('.widget', { hover: true })
  new Message('.flash-message')
  new Post('.post')
  new Excerpt('.voice-subtitle')
  new Discuss('.discuss')
  new BlogWidget()

  $('.tab-controller').bind 'sidebar.toggle', ->
    $('.voices-container').isotope('reLayout')

  $('.map-container').bind 'map.hide', ->
    $('.voices-container').isotope('reLaout')

  $('.voice-subtitle').bind 'excerpt.toggle', ->
    DynamicMeasures.setTopFaces()

  load_votes()
  load_tweets()

  DynamicMeasures.setTopFaces()

  $('.voices-container').height($(window).height() - $('.voices-container').position().top)
  $('body').css('overflow', 'hidden')
)

$(window).load ->
  overlays = new Overlay('.voice-box')
  gazaOverlay = new VideoOverlay('.view-video li')

  if $.deparam.querystring().post
    link = $('.source-url.post-' + $.deparam.querystring().post)
    if link.length
      overlays.buildOverlay(link)

  Timeline.build($('.timeliner-group'), window.timeline_dates)

load_votes = ->
  $.each window.posts_votes, (i, val) ->
   ele = $(".voice-box[data-post-id='"+val.id+"']")

   ele.find('a.source-url').attr('data-voted', true)


   ele.find('.voice-unmoderated li.flag-div .vote-post').toggleClass('flag flag-pressed')
   ele.find('.voice-unmoderated li.flag-div .flag-tooltip span').html('Vote already cast')

   if val.positive
     ele.find('.voice-unmoderated li.up').addClass('up_hover')
     ele.find('.voice-unmoderated li.down').remove()
   else
     url = ele.find('.voice-action li.flag-div .vote-post').attr('href').split('?')
     ele.find('.voice-action li.flag-div .vote-post').attr('href', [url[0], 'rating=1'].join('?'))
     ele.find('.voice-action li.flag-div .vote-post').toggleClass('flag flag-pressed')
     ele.find('.voice-unmoderated li.down').addClass('down_hover')
     ele.find('.voice-unmoderated li.up').remove()
     ele.find('.voice-action li.flag-div .flag-tooltip span').html('Unflag Content')

background_loader_init = ->
  $('.updating-wrapper').parent().css({position: 'relative'})
  
  loader = $('.updating-wrapper')

  if loader.data('background-loading-image')
    $('<img/>').load ->
      $('.voice-box').find('img').imagesLoaded (e) ->
        isotope_init()
        voice_loaded = true

      setTimeout( ->
        if not voice_loaded
          isotope_init()
      , 5000)
    .attr('src', loader.data('background-loading-image'))
    
  else
    isotope_init()

  if $('.voice-box').length is 0
    $('.voice-box').css('visibility', 'visible')
    $('.updating-wrapper').hide()

isotope_init = ->
  engine = 'jquery'
  $('.voices-container').isotope({
    animationEngine: engine,
    itemSelector: '.voice-box',
    masonry: {
      columnWidth: 230
    },
    callback: ->
      $('.voice-box').css('visibility', 'visible')
      $('.updating-wrapper').hide()
      $('body').css('overflow', 'hidden')
  })

load_tweets = ->
  query = $('.twitter-tweets').data('search')

  if query isnt ''
    $.ajax({
      url: 'https://search.twitter.com/search.json?q='+query,
      dataType: "jsonp",
      success: (data) ->
        results = data.results
        if results.length > 0
          $('ul.tweets-list').html('')
          $.each(results, (index, value) ->
            tmp_li = '<li class="tweet"> <blockquote cite="@{{USER}}" class="tweet-text"> <q lang="en-us">{{TEXT}}</q> </blockquote> <cite class="tweet-author">@{{FROM_USER}}, {{TIME}}</cite> </li>'
            tmp_li = tmp_li.replace(/{{USER}}/g, '')
            tmp_li = tmp_li.replace(/{{TEXT}}/g, this.text)
            tmp_li = tmp_li.replace(/{{FROM_USER}}/g, this.from_user)
            tmp_li = tmp_li.replace(/{{TIME}}/g, moment(this.created_at).fromNow())

            if index%2 is 1
              tmp_li = $(tmp_li).css('float', 'right')

            $('ul.tweets-list').append(tmp_li)
          )
    })
