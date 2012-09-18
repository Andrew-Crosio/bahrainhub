var landing_voices_loaded;

$(function () {
    new Testimonial('.peopleSay')
    new Testimonial('.testimonials');
    new Testimonial('.news');
    new FeatureSlider('.home-slider');

    $('.tab-controller').hide();
    $('hgroup').css('top', '50px');
    $('.voice').css('top', '113px');

    $('.welcome .close-message').click(function (){
        $('.welcome').slideUp('1500');
        $('hgroup').animate({
            top: 0
        }, 300);
        $('.voice').animate({
            top: 63
        }, 300);
        $('.welcome-padding').animate({
            paddingTop: 0
        }, 300);
    });
    
    $('.mapit a').click(function (){
        $('.welcome').slideUp('1500');
        $('hgroup').css('top', '0px');
        $('.voice').css('top', '63px');
        $('.welcome-padding').css('padding-top', '0px');
    });
    // Home Columns
    var columnsContainer = $('.home-columns'),
        columnsContainerWidth = $(columnsContainer).width();
    
    $(columnsContainer).children().each(function() {
        $(this).css({width: (columnsContainerWidth / 3) - 15 + 'px'})
    });

    $(window).resize(function() {
        var columnsContainer = $('.home-columns'),
            columnsContainerWidth = $(columnsContainer).width();
    
        $(columnsContainer).children().each(function() {
            $(this).css({width: (columnsContainerWidth / 3) - 15 + 'px'})
        });

    });

    $('.home-columns .voice-list img').each(function() {
        var imgWidth = $(this).width(),
            imgHeight = $(this).height(),
            aspectRatio = imgWidth / imgHeight,
            parentWidth = $(this).parent().width();

            $(this).css({
                width: parentWidth,
                height: parentWidth / aspectRatio
            });
        
    });

    $(window).resize(function() {
        $('.home-columns .voice-list img').each(function() {
            var imgWidth = $(this).width(),
                imgHeight = $(this).height(),
                aspectRatio = imgWidth / imgHeight,
                parentWidth = $(this).parent().width();

            $(this).css({
                width: parentWidth,
                height: parentWidth / aspectRatio
            });
        });

    });

    $('.vTooltip').bind({
        mouseover: function() {
            var vTip = $('.voice-count-tooltip').show();
            var data = eval($(this).data('counts'));
            vTip.find('.photo-count').next('span').text(data.image);
            vTip.find('.video-count').next('span').text(data.video);
            vTip.find('.link-count').next('span').text(data.link);
            var elementOffset = $(this).offset();
            var elementWidth  = $(this).width();
            var elementHeight = $(this).height();
            var toolTipoffset = $(vTip).offset();
            var toolTipWidth  = $(vTip).children().width();
            var toolTipHeight = $(vTip).height();

            vTip.css({width: vTip.children().width() + 8, 'left': (elementOffset.left - toolTipWidth + 10) + 'px', 'top': (elementOffset.top - toolTipHeight - 10) + 'px' });
        },
        mouseout: function() {
            $('.voice-count-tooltip').attr('style', '');
            $('.voice-count-tooltip').hide();
        }
    });

});
