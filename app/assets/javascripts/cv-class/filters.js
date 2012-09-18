Class('Filters')({
    prototype: {
        init: function(element, items) {
            this.element = typeof element == "string" ? $(element) : element;
            this.filters = this.element.find('input:checkbox');
            this.items = typeof items == "string" ? $(items) : items;
            this.toggleModerate = $('.mode-button');
            this._bindEvents();
            if (!$.deparam.querystring().mod) {
                this.deactivateModerator();
            }
        },

        _bindEvents: function () {
            var that = this;

            this.filters.click(function () {
                var self = this;
                var checked = that.filters.filter(':checked');
                var href = '';

                //$('.voice-box').css('visibility', 'hidden');
                //$('.updating-wrapper').fadeIn('slow');

                if(checked.length > 0) {
                    var filters = $('.filters input:checkbox:checked').map(function(){ return $(this).attr('name')}).get().join(',');
                    href = location.href.split('?')[0].replace('#', '') + '/?filters=' + filters;
                } else {
                    href = location.href.split('?')[0].replace('#', '');
                }
                $.getScript(href, function(){
                    that.filter(self.name, $(self).is(':checked'));
                });
            });

            // this.toggleModerate.find('a').bind('click', function () {
            //     var parent = $(this).closest('.mode-button');
            //     if(!parent.hasClass('selected')) {
            //         that.toggleModerator(parent.hasClass('mod'));
            //     }
            //     return false;
            // });
        },

        toggleModerator: function (on) {
            on ? this.activateModerator() : this.deactivateModerator();
        },

        activateModerator: function () {
            this.moderator = true;
            this.toggleModerate.filter('.public').removeClass('selected');
            this.toggleModerate.filter('.mod').addClass('selected');
            $('.voices-container').isotope({ filter: this._buildFilterSelector() });
        },

        deactivateModerator: function() {
            this.moderator = false;
            this.toggleModerate.filter('.public').addClass('selected');
            this.toggleModerate.filter('.mod').removeClass('selected');
            $('.voices-container').isotope({ filter: this._buildFilterSelector() });
        },

        filter: function (filter, show) {
            $('.voices-container').isotope({ filter: this._buildFilterSelector() });
        },

        _buildFilterSelector: function () {
            var checked = this.filters.filter(':checked'),
                selector = '*',
                that = this;
            if(checked.length == 0) {
                checked = this.filters.attr('checked', true);
            }
            selector = checked.map(function () {
                if(that.moderator) {
                    return '.voice-box.' + this.name;
                } else {
                    return '.voice-box:not(.unmoderated).' + this.name;
                }
            }).get().join(', ');

            return selector;
        },

        _fetchPage: function(href) {
            $.getScript(href);
        }

    }
});
