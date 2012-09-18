Class('Treshold')({
    prototype: {
        init: function (element, options) {
            this.options = {
                container: '#voiting-treshold',
                maxInput: '#max-value',
                minInput: '#min-value'
            };
            $.extend(this.options, options);
            this.element = typeof element == "string" ? $(element) : element;
            this.container = $(this.options.container);
            this.maxInput = $(this.options.maxInput);
            this.minInput = $(this.options.minInput);
            this.rangeSlider = $('<div></div>').slider({
                min: -10, 
                max: 10, 
                step: 1, 
                values: [this.minInput.val();, this.maxInput.val();], 
                range: true, 
                animate: true, 
                slide: function(e,ui) { 
                  $('#min') 
                    .val(minimo);
                  $('#max') 
                    .val(maximo);
                   
                  if (ui.values[0] > -1 || ui.values[1] < 1 ) {
                    ui.stop();
                  }
                  this.maxInput.val(ui.values[ 1 ]);
                  this.minInput.val(ui.values[ 0 ]);
                } 
             });
 
            this._bindEvents();
        },

        _bindEvents: function () {
         this.container.after(this.rangeSlider).hide();   
        }

    }
});


