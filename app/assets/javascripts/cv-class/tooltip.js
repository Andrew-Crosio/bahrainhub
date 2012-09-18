Class('Tooltip')({
    prototype: {
        init: function (element, options) {
            var that = this;
            this.element = typeof element == "string" ? $(element) : element;
            this.tooltip = this.element.find('.tooltip');
            this._get_tooltip_name();
            this._hoverTooltip();
            this._mapClick();
            this._moderatorClick();
            this._publicClick();
            this._hide_extra_data();
        },

        _get_tooltip_name: function(){
            this.tooltip_name = '';

            if (this.element.find('a.media-type').attr('title') !== undefined ){
                this.tooltip_name = this.element.find('a.media-type').attr('title').toLowerCase()
            }
        },

        _hoverTooltip: function () {
            var that = this;
            this.element.hover(function (e) {
                if ( $(this).is('.selected') ) {
                 that.tooltip.hide();
                } else if ( $(this).is('.addVoice') ) {
                  $(this).find('.tooltip').show();
                }
                that.show();
            }, function () {
                that.detectContent();
            });
            this.tooltip.children().children('.media-type-info').mouseleave(function () {
               that.detectContent();
            });
            this.tooltip.children().children('form').mouseleave(function () {
               that.detectContent();
            });
        },

        _hide_extra_data: function() {
            switch(this.tooltip_name) {
                case 'image':
                    this.element.find('.with-image').hide();
                    this.element.find('.without-image').show();
                    break;
                case 'link':
                    this.element.find('.without-link').show();
                    this.element.find('.with-link').hide();
                    break;
            }
        },

        _show_extra_data: function() {
            if ($('#post_source_url').val() != ''){
                switch(this.tooltip_name) {
                    case 'image':
                        this.element.find('.without-image').hide();
                        this.element.find('.with-image').show();
                        break;
                    case 'link':
                        this.element.find('.without-link').hide();
                        this.element.find('.with-link').show();
                        break;
                }
            }
        },

        _mapClick: function () {
          var that = this
          this.element.children('a').click(function (){
             if ( $(this).is('.map-btn') ) {
                 that.hide();
                 that.tooltip.children().children().children('strong').text('Hide Voices on the Map');
             }
             if ( $(this).is('.map-active') ) {
                  that.hide();
                  that.tooltip.children().children().children('strong').text('Show Voices on the Map');
              }
          });
        },

        _moderatorClick: function () {   //functionality for moderate public items view
          var that = this
          this.element.children().children('a').click(function (){
              if ( $(this).parent().parent().is('.mod') ) {
                  that.tooltip.children().children().children('strong').text('');
                  that.tooltip.children().children().children('p').html('<span>Thank you! The page is refreshing with unmoderated posts!</span>');
              }
          });
        },

        _publicClick: function () {   //functionality for moderate public items view
          var that = this
          this.element.children().children('a').click(function (){
              if ( $(this).parent().parent().is('.public') ) {
                that.tooltip.hide();
                tt_moderate.tooltip.children().children().children('strong').text('Participate!');
                tt_moderate.tooltip.children().children().children('p').html('<span>Help us approve images, videos and external links.</span> Flag any content that you feel should not be posted here.');  
              }
          });
        },

        detectContent: function() {
          if ( $.inArray(this.tooltip_name, ['image','video','link'] ) >= 0 && $('#post_source_url').val() != '' && $('.media > a.active').length == 1 && !$('.tooltip.notice').is(':visible')) {
            this.tooltip.parent().css('z-index', 10)
          } else {
            this.hide();
          }
        },

        show: function() {
            $('a', this.element).addClass('active');

            if (typeof(Post) != 'undefined') {

              if (Post.isVideo($('#post_source_url').val()) && $('a', this.element).hasClass('active') && this.tooltip_name == 'video' ){
                  return false;
              }

              if ((Post.isImage($('#post_source_url').val()) || ($('#post_source_url').val() != '')) && $('#post_source_url').val() != '' && $('a', this.element).hasClass('active') && this.tooltip_name == 'image'){
                  this._show_extra_data();
              }

              if (Post.isLink($('#post_source_url').val()) && $('#post_source_url').val() != '' && $('a', this.element).hasClass('active') && this.tooltip_name == 'link'){
                  this._show_extra_data();
              }

            }

            this.tooltip.show();

        },

        hide: function() {
            this.tooltip.hide();

            if ($('.media > a.active').length == 1 && $.inArray(this.tooltip_name, ['image','video','link'] ) >= 0){
                this._hide_extra_data();
                this.tooltip.parent().css('z-index', 5)
            }

            $('a', this.element).removeClass('active');
        }
    }
});
