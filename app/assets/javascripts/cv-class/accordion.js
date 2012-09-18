Class('Accordion')({
    prototype: {
        init: function(element) {
            this.element = typeof element == "string" ? $(element) : element;
            this._bindEvents();
        },

        _bindEvents: function () {
            var that = this;
            this.element.parent().click(function () {
                that.toggle($(this).children('span'));
            });
        },
        
        toggle: function (panel) {
            panel.parent().next("ul").stop(false, true).slideToggle('fast');
            panel.toggleClass('down-arrow')
        }
    }
});
