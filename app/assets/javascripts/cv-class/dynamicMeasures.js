Class('DynamicMeasures')({

    _measure: function () {
        var wh = $(window).height(),
            ww = $(window).width(),
            sw = $('.voice').width(),
            hh = $('header').height(),
            cw = $('.voices-container').width(),
            sh = $('.jspDrag').height();
        return {
            scroller: wh - 148,
            tab: (wh / 2) - 21,
            postInput: ww - (sw + 214),
            headerHeight: hh,
            discussTweeter: (cw / 2) - 128,
            discussFB: (cw / 2) - 43
        };
    },

    update: function () {
        var m = this._measure();
        $('.scroller').height(m.scroller);
        $('.tab-controller').css('top', m.tab);
        $('.post > input').width(m.postInput);
        $('.header-sep').css('margin-top', m.headerHeight);
        $('.tweets').css('left', m.discussTweeter); 
        $('.fbcomments').css('left', m.discussFB);

        if ($('.grid-item:first').outerWidth(true) * $('.grid-item').length > $('.connections_grid').width() ){
            $('.fb-arrow').show();
        } else {
            $('.fb-arrow').hide();
        }
    },

    setTopFaces: function () {
        $('.header-sep').css('margin-top', $('header').height());
    }

});
