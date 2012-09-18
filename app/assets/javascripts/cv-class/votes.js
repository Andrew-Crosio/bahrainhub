Class('Votes')({
    prototype: {
        init: function(element) {
            this._elementSelector = element;
            this.bindEvents();
        },

        bindEvents: function () {
            var that = this;
            this.element = $(this._elementSelector);
            this.element.bind('click', function (e) {
                var self = $(this);

                if ($(this).parent().parent().find('.flag-tooltip span').html() == 'Vote already cast'){
                    return false;
                }

                $.ajax({
                    url: this.href,
                    data: $.extend({ authenticity_token : $('meta[name=csrf-token]').attr('content')}, $(this).data('params')),
                    type: $(this).data('method'),
                    dataType: 'json',
                    success: function (data) {
                        that._handleSuccess(data, self);

                        post_id = $(e.target).siblings().attr('data-post-id');
                        flag = $('div[data-post-id=' + post_id + ']');

                        //Logic for flags
                        if ($(e.target).hasClass('flag')){
                          flag.find('.flag-tooltip span').html('Unflag Content');
                          $('a[data-id=' + post_id.split('_')[1] + ']').attr('data-voted', true)
                          flag.siblings('a').toggleClass('flag flag-pressed').attr('href', [$(e.target).attr('href').split('?')[0], 'rating=1'].join('?') );
                        } else if ($(e.target).hasClass('flag-pressed')){
                          flag.find('.flag-tooltip span').html('Flag Inappropiate Content');
                          $('a[data-id=' + post_id.split('_')[1] + ']').attr('data-voted', false)
                          flag.siblings('a').toggleClass('flag flag-pressed').attr('href', [$(e.target).attr('href').split('?')[0], 'rating=-1'].join('?') );
                        }

                        //Logic for thumbs
                        if ($(e.target).hasClass('thumb')){

                          parent_target = $(e.target).parent().parent()
                          if ( parent_target.hasClass('down') ){
                              parent_target.addClass('down_hover')
                          } else {
                              parent_target.addClass('up_hover')
                              parent_target.parent().css('margin-right', '22px')
                          }

                          $(e.target).parent().siblings('div').find('.flag-tooltip span').html('Thank you for your vote!');
                          parent_target.siblings('li').hide();
                        }
                    },
                    error: function (xhr) {
                        that._handleError(xhr, self);
                    }
                });

                return false;
            });
        },

        unbindEvents: function(){
            var that = this;
            this.element.unbind('click');
            return that;
        },

        _handleSuccess: function (data, anchor) {
            if(data.post.approved) {
                anchor.closest('.unmoderated').removeClass('unmoderated')
                    .find('.voice-cont').effect('highlight', 2000).end()
                    .find('.voice-action').show().siblings('.voice-unmoderated')
                    .find('li > span > a').unbind('click').end().remove();
            } else {
                anchor.closest('.voice-unmoderated').effect('highlight', 2000);
            }
        },

        _handleError: function (xhr, anchor) {
            anchor.closest('li').stop(true, true).effect('pulsate');
        }
    }
});