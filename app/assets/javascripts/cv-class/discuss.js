Class('Discuss')({
    prototype: {
        init: function (element, options) {
            this.options = {
                discussArea: '.discuss',
                tab: '.discuss-tab',
                discussContiner: '.discuss-container'
            };
            $.extend(this.options, options);
            this.element = typeof element == "string" ? $(element) : element;
            this.discussArea = $(this.options.discussArea);
            this.tabs = $(this.options.tab);
            this.discussContiner = $(this.options.discussContiner);
            this.open = false;
            this._bindEvents();
        },

        _bindEvents: function () {
            var that = this,
                area = this.discussArea;

            this.tabs.click(function () {
                if (!that.open) {
                    that.show();
                    that._showContainer($(this));
                } else {
                    if ($(this).parent().is('.front')) {
                        
                    } else {
                        that._showContainer($(this));
                    }
                }
            });

            this.discussContiner.hover(function () {
                $(this).prev().children().addClass("hover-tab");
            }, function () {
                $(this).prev().children().removeClass("hover-tab");
            });
            
            $('.close-discuss, .close-btn-control').click(function() {
                 that.hide();
            });
            
            $('.close-btn-control').hover(function () {
                $(this).prev().addClass("hover-close-bar");
            }, function () {
                $(this).prev().removeClass("hover-close-bar");
            });

            $('.close-discuss').hover(function () {
                $(this).next().addClass("hover-btn-control");
            }, function () {
                $(this).next().removeClass("hover-btn-control");
            });

            $('.tweets-list > li:odd').css('float', 'right')
            
        },

        show: function () {
            this.discussArea.animate({
                height: '250px'
            }, 300);
            $('.discuss').addClass('openTabs')
            $('.pagination').css('margin-bottom', '220px')
            this.open = true;
        },

        hide: function () {
            this.discussArea.animate({
                height: '35px'
            }, 300);
            $('.discuss').removeClass('openTabs')
            $('.pagination').css('margin-bottom', '0px')
            this.open = false;
        },

        _showContainer: function (tab) {
            if (!tab.hasClass('back')) {
                tab.parent().siblings().addClass('back');
            }
            tab.parent().siblings().removeClass('front');
            tab.parent().removeClass('back');
            tab.parent().addClass('front');
        }
    }
});

