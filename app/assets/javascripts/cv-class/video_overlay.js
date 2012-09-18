Class('VideoOverlay')({
    prototype: {
        init: function (element, options) {
            this.options = {
                overlay : '#overlay',
                overlayContainer : '.vide-overlay-container',
                closeBtn : '.close-voice-container'
            };
            this.element = typeof element == "string" ? $(element) : element;
            this.overlay = $(this.options.overlay);
            this.overlayContainer = $(this.options.overlayContainer);
            this.win = $(window);
            this.closeBtn = $(this.options.closeBtn);
            this._bindEvents();
        },

        _bindEvents: function(){
            var that = this;
            this.element.click(function () {
                that.buildOverlay();
            });
            this.overlay.click(function () {
                that.hide();
            });
            this.closeBtn.click(function () {
                that.hide();
            });
        },

        buildOverlay: function () {
            var that = this;
            $('body').css('overflow-y', 'hidden');
            that.showTopOverlay();
        },
        
        showTopOverlay: function () {
            var that = this;
            this.overlay.css('top', $(document).scrollTop()).fadeIn();
            that.show();
        },
                
        show: function () {
            var top = (this.win.height() - this.overlayContainer.height()) / 2,
                left = (this.win.width() - this.overlayContainer.width()) / 2
            this.overlayContainer.css({
                'top': top + $(document).scrollTop(),
                'left': left
            }).show();
        },

        hide: function () {
            $('body').css('overflow-y', 'auto');
            this.overlayContainer.fadeOut('slow');            
            this.overlay.fadeOut('slow');
        }

    }
});