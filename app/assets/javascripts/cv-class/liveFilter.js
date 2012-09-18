Class('LiveFilter')({
    prototype: {
        init: function(input, container) {
            this.input = typeof input == 'string' ? $(input) : input;
            this.container = typeof container == 'string' ? $(container) : container;
            this.originalContent = this.container.html();
            this.itemsContainer = $('<ul />').insertAfter(this.container).hide();
            this.items = this.container.find('li').clone().appendTo(this.itemsContainer);
            this.clearBtn = this.input.next('.clear-search')
            this._bindEvents();
        },

        _bindEvents: function () {
            var that = this;
            this.input.bind('keyup', function () {
                that.filter($(this).val());
                if ( $(this).val() === "" ) {
                  that.clearBtn.hide();
                }
                else {
                  that.clearBtn.show();
                }; 
            });
            
            this.input.focusout(function () {
                that.clearBtn.addClass('invisible');
            });
            
             this.input.focus(function () {
                 if ( $(this).val() === "" ) {
                   that.clearBtn.hide();
                   that.clearBtn.removeClass('invisible');
                 }
                 else {
                   that.clearBtn.show();
                   that.clearBtn.removeClass('invisible');
                 };
            });
            
            this.clearBtn.click(function (){
                that.input.focus();
                that.input.val('');
                that.filter($(this).val());
                $(this).hide();
            });
        },

        filter: function (value) {
            var that = this;

            if(value == '') {
                this.container.html(this.originalContent);
                new Accordion('.accordion');
            } else {
                var match = $.grep(this.items.clone(), function(item) {
                    var regex = new RegExp(value, 'i');
                    return regex.test( that.removeAccents($(item).text()) );
                });
                $('.accordion').parent().unbind('click');
                this.container.html('').append($('<ul/>').append(match));
            }
        },

        removeAccents: function (value){
            strArr = value.split('');
            strOut = new Array();
            var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
            var accentsOut = ['A','A','A','A','A','A','a','a','a','a','a','a','O','O','O','O','O','O','O','o','o','o','o','o','o','E','E','E','E','e','e','e','e','e','C','c','D','I','I','I','I','i','i','i','i','U','U','U','U','u','u','u','u','N','n','S','s','Y','y','y','Z','z'];
            for (var y = 0; y < strArr.length; y++) {
                if (accents.indexOf(strArr[y]) != -1) {
                    strOut[y] = accentsOut[accents.indexOf(strArr[y])];
                }
                else
                    strOut[y] = strArr[y];
            }
            strOut = strOut.join('');
            return strOut;
        }
    }
});
