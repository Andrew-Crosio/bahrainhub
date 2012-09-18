Class('Message')({
    prototype : {
        init : function (element, options) {
            this.options = {
                closeBtn : '.close-message',
                effect   : true
            };
            $.extend(this.options, options);
            this.element = typeof element == "string" ? $(element) : element;
            this.closeBtn = $(this.options.closeBtn);
            this._bindEvents();
        },

        _bindEvents: function () {
            var closeBtn = this.element.children().children(this.options.closeBtn),
                that = this;
            closeBtn.click(function () {
                that.hide();
                return false;
            });
        },

        hide: function () {
            var that = this;
            (this.options.effect ? this.element.fadeOut(function () {
                that.element.trigger('flash.close')
            }) : this.element.hide() && this.element.trigger('flash.close'));
        }
    }
});
