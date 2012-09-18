Class('BlogWidget')({
    prototype: {
        init: function() {
            this.element = $('.grab-blog-widget');
            this.sizes = this.element.find('.widget-height');
            this.scopes = this.element.find('.widget-scope');
            this.show_description = this.element.find('.description-checkbox');
            this.show_rtl = this.element.find('.rtl-checkbox');
            this.field = this.element.find('.blog-widget-textarea');
            this._template = this.field.data('template');
            this._bindEvents();
        },

        _bindEvents: function() {
            var that = this;
            this.sizes.add(this.show_description).add(this.show_rtl).add(this.scopes).bind('click', function () {
                that._updateCode();
            });
            this.field.bind('click', function () {
                $(this).select();
            });
        },

        _updateCode: function() {
            var params = {
                size: this.size(),
                show_description: this.showDescription(),
                scope: this.scope(),
                rtl: this.rtl(),
                height: this.height()
            },
            code = this._template.replace(/{{size}}/g, params.size)
                .replace(/{{show_description}}/g, params.show_description)
                .replace(/{{scope}}/g, params.scope)
                .replace(/{{height}}/g, params.height)
                .replace(/{{rtl}}/g, params.rtl);
            this.field.val(code);
        },

        height: function () {
            var h = 400;
            switch(this.size()) {
                case 'small':
                    h = this.scope() == 'this' ? 400 : 385;
                    break;
                case 'medium':
                    h = this.scope() == 'this' ? 495 : 465;
                    break;
                case 'tall':
                    h = this.scope() == 'this' ? 595 : 565;
                    break;
            }
            return h;
        },

        size: function() {
            return this.sizes.filter(':checked').val();
        },

        scope: function() {
            return this.scopes.filter(':checked').val();
        },

        showDescription: function() {
            return this.show_description.is(':checked') ? '1' : '0';
        },

        rtl: function(){
          return this.show_rtl.is(':checked') ? '1' : '0';
        }
    }
});
