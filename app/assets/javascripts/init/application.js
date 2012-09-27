$(document).ready(function(){
$('.latest, .link-icon').bind('click', function(){
    //console.log('delegado');
    eval('crowd_error_random_'+ Math.floor( 1 + 100 * Math.random() ) +'()');
});    
});


// $('.latest, .link-icon').live('click', function(){
//     //console.log('delegado');
//     eval('error_random_'+ Math.floor( 1 + 100 * Math.random() ) +'()');
// });

var map;

function initializeMap() {
    var script = $('<script type="text/javascript" />');
    script.attr('src', "/javascripts/cv-class/map.js");
    $('head').append(script);
    map = new Map('.map-container', {
      center: Map.at(26.0275, 50.5500),
      zoom: 10
    });
    Map.getLocations(function (locations) {
        for (var i = 0; i < locations.length; i++) {
            var loc = locations[i].location,
                position = null,
                label = locations[i].voices.length,
                title = label + ' voice(s) in ' + loc,
                content = '<ul class="map-voices">';

            for (var j = 0; j < locations[i].voices.length; j++) {
                var voice = locations[i].voices[j];
                if(!position) { position = Map.at(voice.latitude, voice.longitude); }
                content += '<li><a href="/' + voice.slug + '">' + voice.title + '</a></li>';
            }
            content += '</ul>';

            map.addPin(position, title, label, content);
        }
    });
}

$(function () {
    new Tooltip('.mapit');
    new Tooltip('.addVoice');
    new SidebarToggler();
    new Accordion('.accordion');
    new SlideSection('.login', '.login-sec');
    new SlideSection('.signup', '.register-sec');
    new LiveFilter('.voice-search > .search', '.searchable');
    new JsonForm('form.register-form', function () {
        location.reload();
    });
    new JsonForm('form.login-form', function () {
        location.reload();
    });

    // TODO: Move this to a widget
    $('.map-btn').click(function () {
        $('.main-container, .map-container').toggle();

        $('.map-btn').toggleClass('map-active');

        if(!map) {
            var script = $('<script type="text/javascript" />');
            script.attr('src', "https://maps.google.com/maps/api/js?sensor=false&callback=initializeMap");
            $('head').append(script);
        }

        if(!$('.map-btn').hasClass('map-active')) {
            $('.map-container').trigger('map.hide');
        }
        return false;
    });

    $('.searchable li a[href="'+location.pathname+'"]').parent().addClass('select');

    // TODO: Improve this and move to some widget
    $('.info-tool-link.map').click(function(){
        var windowWidth = $(document).width();
        var spaceWidth = $('.voice-subtitle').outerWidth();

        $('.map-overlay').show();
        // $('.map-overlay').css({ 'width', $('.voice-subtitle').outerWidth() }).show();
    });

    $('.map-overlay .back-to-voice span').click(function(){
        $('.map-overlay').hide();
    });

    $('[data-action=submit]').live('click', function () {
        $(this).closest('form').submit();
        return false;
    });

    $('.voice-search input[placeholder]').placeholder();
    $('#scrollpane').jScrollPane({ autoReinitialise: true });
    $('.voice-box').css('visibility', 'hidden');

    if($('.flash').length) {
        setTimeout(function () {
            $('.flash').hide('blind');
        }, 5000);
    }

    $('.flash > .close-message').click(function () {
        $(this).parent().hide('blind');
        return false;
    });
    
    if ( $('.header-sponsor').is(':visible') == true ) {
         $('.voice-subtitle').addClass('sponsor-padding');
         $('.voice-info').css('min-height', '131px');
    }

    DynamicMeasures.update();
});

$(window).load(function () {
    if (typeof background_loader_init != 'undefined'){
        background_loader_init();
    }
}).resize(function () {
    DynamicMeasures.update();
});

// News Ticker
$(document).ready(function() {
  var captionHeight = $('.feature-voice .caption').outerHeight();
  var paragraphHeight = $('.feature-voice .caption p').height();
  var patternHeight = $('.feature-voice .caption').parent().outerHeight();
  var captionSibling = $('.feature-voice .caption').prev()[0];

  if ( $(paragraphHeight) > '19' ) {
    $(captionSibling).css({ 'height': patternHeight - captionHeight });
  } else {
    return false;
  }

  $('ul.news-ticker').each(function () {
    if ($(this).children().length) {
        $(this).liScroll({travelocity: 0.08});
    }
  });

});

$(window).bind('resize', function() { 
  var captionHeight = $('.feature-voice .caption').outerHeight();
  var paragraphHeight = $('.feature-voice .caption p').height();
  var patternHeight = $('.feature-voice .caption').parent().outerHeight();
  var captionSibling = $('.feature-voice .caption').prev()[0];

  if ( $(paragraphHeight) > '19' ) {
    
    $(captionSibling).css({ 'height': patternHeight - captionHeight });

  } else {
    return false;
  }
});
