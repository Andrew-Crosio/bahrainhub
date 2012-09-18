Class('Overlay')({
    prototype: {
        init: function (element, options) {
            this.options = {
                overlay : '#overlay',
                overlayContainer : '.overlay-container',
                linkOverlayContainer : '.link-overlay',
                arrows : '.arrows',
                closeBtn : '.close-voice-container',
                content : { }
            };
            $.extend(this.options, options);
            this.overlay = $(this.options.overlay);
            this.overlayContainer = $(this.options.overlayContainer);
            this.linkOverlayContainer = $(this.options.linkOverlayContainer);
            this.overlayTemplate = this.overlayContainer.html();
            this.linkOverlayTemplate = this.linkOverlayContainer.html();
            this.win = $(window);
            this._elementSelector = element;
            this._initZeroClipboard();
            this._bindEvents();
            this._alignMagnifier();
        },

        _initZeroClipboard: function() {
            var that = this;
            ZeroClipboard.setMoviePath( '/javascripts/ZeroClipboard10.swf' );
            this.zeroclip = new ZeroClipboard.Client();
            this.zeroclip.addEventListener('onMouseDown', function() {
              that.zeroclip.setText( $('.link-overlay iframe').attr('src') );
            });
            this.zeroclip.addEventListener('complete',function(client,text) {
              alert('copied!');
            });
        },

        unbindEvents: function(){
            var that = this;
            this.element.find('.voice-cont').unbind('click');
            this.element.find('.comments').unbind('click');
            return that;
        },

        bindEvents: function(){
            var that = this;
            this.element = $(this._elementSelector);
            this.element.find('.voice-cont').click(function () {
                that.buildOverlay($(this).find('.source-url'));
                return false;
            });

            this.element.find('.comments').click(function () {
                that.buildOverlay($(this).parent().prev().find('.source-url'));
                return false;
            });
        },

        _bindEvents: function () {
            var that = this;

            this.bindEvents();

            $(this.options.closeBtn).live('click', function () {
                that.hide();
                return false;
            });

            this.overlay.click(function () {
                that.hide();
            });

            $('body').bind('keydown', function (ev) {
                if(ev.keyCode == 27 && that.visible) {
                    that.hide();
                }
            });

            $('.voice-cont').css('margin-top', '0', 'margin-left', '0');

            $('.voice-arrow').live('mouseover', function () {
                $(this).next('.tooltip-arrow').show();
            }).live('mouseout', function () {
                $(this).next('.tooltip-arrow').hide();
            }).live('click', function () {
                that.buildOverlay($('.source-url.post-' + $(this).data('id')));
                return false;
            });

            $('.back-to-voice span').live('click', function () {
                that._hideLinkOver();
            });

            $('.toggle-comments').live('click', function () {
                that._toggleComments();
            });

        },

        _showLinkOver: function () {
            var that = this
            var winHeight = $('body').height();
            $('body').css('overflow-y', 'hidden').css({position: 'fixed', width: '100%'}).delay(500).animate({marginTop: winHeight + 'px'}, 500);
            $('.link-overlay').delay(200).slideDown(function (){
                that.zeroclip.glue('d_clip_button', 'd_clip_container');
                $('.copy-url div').hover(
                  function () {
                    $(this).css('cursor', 'pointer');
                    $(this).prev('a').addClass('clipboard-btn');
                  }, 
                  function () {
                    $(this).prev('a').removeClass('clipboard-btn');
                  }
                );
            });

            $('.voice').css({position: 'relative'});
            $('.tab-controller').hide();
        },

        _hideLinkOver: function (callback) {
            $('.link-overlay').slideUp('1000');
            $('body').animate({marginTop: '0px'}, 500, function() {
                $(this).css('overflow-y', 'hidden').css({position: 'relative', width: '100%'})
                $('.voice').css({position: 'fixed'});
                $('.tab-controller').show();
                if($.isFunction(callback)) { callback(); }
            });
        },

        _toggleComments: function () {
            var messages = $('.comment-zone-border');

            if ( messages.height() == 0 ) {
                 messages.animate({
                     height: '170px'
                   }, 500);
             }
             else {
                 messages.animate({
                     height: '0px'
                   }, 500);
             }
        },

        _alignMagnifier: function () {
            this.element.each(function() {
                var hover = $(this).children().children().children('span'),
                    imageHeight = $(this).find('.thumb-preview').height(),
                    imageWidth = $(this).find('.thumb-preview').width();
                hover.css({
                    'margin-top' : ( imageHeight / 2 ) - 21,
                    'margin-left' : ( imageWidth / 2 ) - 21
                });
            });
        },

        _getData: function(e) {
            var data = {},
                index = $('.voice-box:not(.isotope-hidden)').index(e.closest('.voice-box')),
                prev = $('.voice-box:not(.isotope-hidden):lt('+index+')').last(),
                next = $('.voice-box:not(.isotope-hidden):gt('+index+')').first();

            data.title = e.data('title');
            data.ago = e.data('ago');
            data.href = e.attr('href');
            data.voice_slug = window.currentVoice.slug;
            data.post_id = e.data('id');
            data.type = e.data('type');
            data.permalink = e.data('permalink');
            data.voted = e.data('voted');
            data.service = e.data('service');

            if(prev.length) {
                data.prev = {
                    image: prev.find('.voice-cont > a > img').attr('src'),
                    title: prev.find('.voice-cont > a').data('title'),
                    id: prev.find('.voice-cont > a').data('id')
                };
            }
            if(next.length) {
                data.next = {
                    image: next.find('.voice-cont > a > img').attr('src'),
                    title: next.find('.voice-cont > a').data('title'),
                    id: next.find('.voice-cont > a').data('id')
                };
            }
            return data;
        },

        buildOverlay: function (e) {
            var data = this._getData(e);
            $('body').css('overflow-y', 'hidden');
            this.showTopOverlay();
            this._replaceContent(data);
        },

        _replaceContent: function (data) {
            var content = unescape(data.type == 'link' ? this.linkOverlayTemplate : this.overlayTemplate),
                that = this,
                width = 0,
                maxWidth = parseInt($(document).width() * 0.80),
                maxHeight = parseInt($(window).height() * 0.80) - 150;

            content = content.replace(/{{title}}/g, data.title);
            content = content.replace(/{{escaped_title}}/g, encodeURIComponent(data.title));
            content = content.replace(/{{time_ago}}/g, data.ago);
            content = content.replace(/{{source_url}}/g, data.href);
            content = content.replace(/{{voice_slug}}/g, data.voice_slug);
            content = content.replace(/{{post_id}}/g, data.post_id);
            content = content.replace(/{{rating}}/g, data.voted ? 1 : -1);

            if(data.type == 'link') {
                var that = this,
                    winHeight = $('body').height();

                that.hide();
                this._onContentLoaded(content, $(document).width(), data);
                //that._showLinkOver();
            } else {
                this.timeoutRequest = setTimeout(function(){
                    $.post('/notify_js_error', { e: 'There were a problem loading an embedly resource.', data: data }, function(data) {
                    });
                }, 60000);

                $.embedly(data.href, {
                        key: 'a7a764a2bbc511e0902d4040d3dc5c07', // TODO: Use Esra'a key
                        maxWidth: maxWidth,
                        maxHeight: maxHeight,
                        urlRe: new RegExp(window.embedlyURLre.source.substring(0, embedlyURLre.source.length-1) + "|(:?.*\\.(jpe?g|png|gif)(:?\\?.*)?$))", 'i')
                    }, function(oembed, dict){

                    clearTimeout(that.timeoutRequest);

                    if(oembed.html) {
                        content = content.replace(/{{content}}/g, oembed.html);
                        width = oembed.width;
                    } else {
                        if (oembed.type == 'link' && oembed.width == undefined){
                            content = content.replace(/{{content}}/g, '<a href="' + oembed.url + '"><img src="' + oembed.thumbnail_url + '" width="' + oembed.thumbnail_width + '" height="' + oembed.thumbnail_height + '" /></a>');
                             width = oembed.thumbnail_width;
                        } else {
                            content = content.replace(/{{content}}/g, '<img src="' + oembed.url + '" style="max-height: '+ maxHeight +'px" />');
                             
                             // i = new Image();
                             // i.src = oembed.url;
                             // i.onload = function() { console.log('Image Width: ' + i.width); };

                             // width = i.width;
                             width = Math.round((oembed.width/oembed.height) * maxHeight);                             

                             if (data.service == 'Flickr'){
                                 width = oembed.width;
                             }
                        }

                    }

                    if (width < 310){
                        width = 310;
                    }

                    that._onContentLoaded(content, width, data);

                });
            }
        },

        _onContentLoaded: function (content, width, data) {
            var that = this;

            content = content.replace(/{{content_width}}/g, width-11);
            content = content.replace(/{{voice_width}}/g, width);
            content = content.replace(/{{post_permalink}}/g, data.permalink);
            if(data.prev) {
                content = content.replace(/{{prev_title}}/g, data.prev.title);
                content = content.replace(/{{prev_id}}/g, data.prev.id);
                content = content.replace(/{{prev_image}}/g, '<img src="' + data.prev.image + '" width="61">');
            }
            if(data.next) {
                content = content.replace(/{{next_title}}/g, data.next.title);
                content = content.replace(/{{next_id}}/g, data.next.id);
                content = content.replace(/{{next_image}}/g, '<img src="' + data.next.image + '" width="61">');
            }

            $('.overlay-vote-post').unbind('click');
            content = this.update_flag_status($(content), data.voted);

            if (data.type == 'link') {
                if(this.zeroclip) {
                    this.zeroclip.destroy();
                }
                this.linkOverlayContainer.html('').append(content);
                this.linkOverlayContainer.find('iframe').attr('src', data.href);
            } else {
                this.overlayContainer.html('').append(content);

            }

            new Votes('.overlay-vote-post');

            if(!data.prev) {
                this.linkOverlayContainer.find('.arrows .prev').remove();
                this.overlayContainer.find('.arrows.prev').remove();
            }
            if(!data.next) {
                this.linkOverlayContainer.find('.arrows .next').remove();
                this.overlayContainer.find('.arrows.next').remove();
            }

            if (data.type == 'link'){
                this._showLinkOver();
            } else {
                this._hideLinkOver(function() {

                    if (data.type == 'image'){
                        that.overlayContainer.find('.voice-over-info > div > img').imagesLoaded(function (e) {
                            that.show();
                            that.show(); // Need to call it twice because when showing iframe, it measures the top wrong the first time.

                            // reset the Image container to take the same width of the image

                            if ( $('.voice-container .voice-over-info img').length > 0 ){
                                var ImgElement = $(this),
                                    imgWidth = $(this).width();

                                if ( imgWidth < 310 ) {
                                    $(ImgElement).closest('.voice-container').css({width: 310});
                                } else {
                                    $(ImgElement).closest('.voice-container').css({width: imgWidth}).addClass('imgContainerWidth');
                                }
                            }

                            var top = ( $(window).height() - $('.overlay-container').height() ) / 2,
                                left = ( $(window).width() - $('.overlay-container').width() ) / 2,
                                arrowPosition = ( ( $('.overlay-container').height() / 2 ) - 30);

                            $('.overlay-container').css({
                                'top': top + $(document).scrollTop(),
                                'left': left
                            });

                            $('.overlay-container .arrows').css({
                                'margin-top': arrowPosition
                            });

                        });
                    } else {
                        that.show();
                        that.show(); // Need to call it twice because when showing iframe, it measures the top wrong the first time.
                    }

                });
            }

        },

        showTopOverlay: function () {
            this.overlay.css('top', $(document).scrollTop()).fadeIn();
        },

        update_flag_status: function (ele, voted){
            if (voted == true){
                ele.find('.flag-div a').toggleClass('flag flag-pressed');
                ele.find('.flag-tooltip span').html('Unflag Content');
            }
            return ele;
        },

        show: function () {

            var top = (this.win.height() - this.overlayContainer.height()) / 2,
                left = (this.win.width() - this.overlayContainer.width()) / 2,
                arrowPosition = ((this.overlayContainer.height() / 2) - 30);

            $('body').css('overflow-y', 'hidden');
            //this.overlay.css('top', $(document).scrollTop()).fadeIn();
            this.overlayContainer.css({
                'top': top + $(document).scrollTop(),
                'left': left
            }).show();

            $(this.options.arrows).css({
                'margin-top': arrowPosition
            });

            this.visible = true;

        },

        hide: function () {
            $('body').css('overflow-y', 'hidden');

            $('.voice-over-info object, .voice-over-info iframe').remove();
            this.overlay.fadeOut('slow');
            this.overlayContainer.fadeOut('slow');
            this.visible = false;
        }

    }
});
