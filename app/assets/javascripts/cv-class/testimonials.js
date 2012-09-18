Class('Testimonial')({
    prototype: {
        init: function (element, options) {
            this.options = {
                step: 1,
                current: 0,
                visible: 3,
                speed: 500,
                liSize: 219,
                carouselHeight: 276
            };
            $.extend(this.options, options);
            this.element = typeof element == "string" ? $(element) : element;
            this.container = this.element;
            this.list = this.element.children('ul');
            this.listSize = this.list.children('li').size();
            this.ulSize = this.options.liSize * this.listSize;
            this.divSize = this.options.liSize * this.options.visible;
            this.carouselHeight = this.options.carouselHeight;
            this.step = this.options.step;
            this.current = this.options.current;
            this.visible = this.options.visible;
            this.speed = this.options.speed;
            this.liSize = this.options.liSize;
            this._bindEvents();
        },

        _bindEvents: function () {
          var that = this,
              container = this.container,
              list = this.list,
              listSize = this.listSize,
              ulSize = this.ulSize,
              divSize = this.divSize,
              carouselHeight = this.carouselHeight,
              current = this.current,
              liSize = this.liSize
          
          container.css("width", "625px").css("margin", "0px auto").css("height", carouselHeight+"px").css("visibility", "visible").css("overflow", "hidden").css("position", "relative");
          list.css("width", ulSize+"px").css("left", -(current * liSize)).css("position", "absolute");
         
         
         this.element.prev().children('.cite-slide-right-arrow').click(function() {
          that._moveRight();
         });

         this.element.prev().prev().children('.cite-slide-left-arrow').click(function() {
          that._moveLeft();
         });

        },

        _moveRight: function () {
         if (this.current + this.step < 0 || this.current + this.step > this.listSize - this.visible) {
            return;
          }
          else {
            this.current = this.current + this.step;
            this.list.animate({left: -(this.liSize * this.current)}, this.speed, null);
          }
          return false;
        },

        _moveLeft: function () {
          if(this.current - this.step < 0 || this.current - this.step > this.listSize - this.visible) {
            return; 
          }
          else {
            this.current = this.current - this.step;
            this.list.animate({left: -(this.liSize * this.current)}, this.speed, null);
          }
          return false;
        },
    }
});
