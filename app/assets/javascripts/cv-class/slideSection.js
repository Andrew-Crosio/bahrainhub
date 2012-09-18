Class('SlideSection')({
    slides: [],

    closeAll: function () {
        for (var i = 0; i < this.slides.length; i++) {
            this.slides[i].close();
        }
    },

    prototype: {
        init: function(element, section) {
            this.element = typeof element == "string" ? $(element) : element;
            this.section = typeof section == "string" ? $(section) : section;
            this._bindEvents();
            this.constructor.slides.push(this);
        },
        
        _bindEvents: function () {
            var that = this;
            this.element.click(function () {
                that.toggle();
                return false;
            });

            this.section.find('.cancel').click(function () {
                that.close();
                return false;
            });
        },
        
        open: function () {
            this.constructor.closeAll();
            this.section.slideDown('slow');
        },
        
        close: function () {
            this.section.slideUp('slow');
        },

        toggle: function () {
            this.section.is(':visible') ? this.close() : this.open();
        }
    }
});
