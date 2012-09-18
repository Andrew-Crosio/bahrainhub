Class('JsonForm')({
    prototype: {
        init: function(element, onSuccess) {
            this.element = typeof element == 'string' ? $(element) : element;
            this.onSuccess = onSuccess;
            this._bindEvents();
        },

        _bindEvents: function () {
            var that = this;
            this.element.bind('submit', function () {
                that.submit($(this));
                return false;
            });
        },

        submit: function (form) {
            var that = this;
            this.clearErrors();
            $.ajax({
                url: form.attr('action'),
                data: form.serialize(),
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    that.handleSuccess(data, form);
                },
                error: function (xhr) {
                    that.clearErrors();
                    that.handleError(eval('(' + xhr.responseText + ')'));
                }
            });
        },

        clearErrors: function () {
            this.element.find('tr.error').remove();
            this.element.find('.error').removeClass('error');
        },

        handleSuccess: function (data, form) {
            if(this.onSuccess) {
                this.onSuccess(data, form);
            }
        },

        handleError: function (errors) {
            var tpl = '<tr class="error"><td></td><td><span>%s</span></td></tr>';
            for (var attr in errors) {
                if(errors.hasOwnProperty(attr)) {
                    if(attr == 'base') {
                        this.element.find('tbody').append(
                            tpl.replace(/%s/g, errors[attr])
                        );
                    } else {
                        this.element.find('[data-attribute=' + attr + ']')
                            .addClass('error').closest('tr').after(
                                tpl.replace(/%s/g, attr + ' ' + errors[attr][0])
                            );
                    }
                }
            }
        }
    }
});
