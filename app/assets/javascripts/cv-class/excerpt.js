Class('Excerpt')({
    prototype: {
        init: function (element, options) {
            this.options = {
                showChar     : 114,
                ellipsestext : "...",
                moreText     : '.more-quote'
            };
            $.extend(this.options, options);
            this.element = typeof element == "string" ? $(element) : element;
            this.quote = this.element.children('em');
            this.button = this.element.children('em').next('a');
            this.moreText = $(this.options.moreText);
            this._bindEvents();
        },

        _bindEvents: function () {
            var that = this,
                characters = this.options.showChar,
                quote = this.quote,
                quoteCont = this.quote.html(),
                quoteSize = quoteCont.length,
                ellipsestext = this.options.ellipsestext;

            if (quoteSize > this.options.showChar) {
                var c = quoteCont.substr(0, characters),
                    h = quoteCont.substr(characters, quoteSize - characters);
                quote.html(c + '<span class="ellipsestext">' + ellipsestext + '</span><span class="more-quote">' + h + '</span>');
                $('.more-quote').hide();
            } else {
                this.button.hide();
            }

            this.button.click(function () {
                if ($('.more-quote').is(':hidden')) {
                    $('.more-quote').toggle();
                    $('.ellipsestext').hide();
                    $(this).children('span').html("Less");
                    that.element.trigger('excerpt.toggle');
                } else {
                    $('.more-quote').toggle();
                    $('.ellipsestext').show();
                    $(this).children('span').html("More");
                    that.element.trigger('excerpt.toggle');
                }
            });

        }

    }
});

