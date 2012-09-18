Class('Carousel')({
    prototype : {
        init : function (element, options) {
          this.options = {
              description : 'No description set.',
              title : 'No title set.',
              index : 0,
              images : [],
              picture: null,
              DEFAULT_IMAGE: "https://s3.amazonaws.com/crowdvoice-production/link-default.png"
            };
            $.extend(this.options, options);
            this.element = typeof element == "string" ? $(element) : element;
            this.picture = $(document.createElement("img"));
            this.picture.css({"float": "left", "width": 89});
            this.picture.attr({"id": "img_74dd65a7c6"});
            // this.picture.attr({"src": ""});
            $(".carousel-image").append(this.picture);
            this._bindEvents();
        },

        loadHash : function (hash) {
            this.index = 0;
            this.title = hash.title;
            this.description = hash.description;
            this.images = [];
            this.picture.attr("src", this.options.DEFAULT_IMAGE);
            //filter out the images that are useful
            var self = this;

            if(hash.error) {
                this.clear();
                tt_link.hide();
                $('.tooltip.notice .moderate-tooltip').html(hash.error)
                $('.tooltip.notice').show();
            } else {
                for (var i = 0; i < hash.images.length; i++) {
                   var imgurl = hash.images[i];
                   var img = new Image();
                   img.src = imgurl;

                   img.onload = function() {
                       if (this.width >= 50 && this.height >= 50) {
                           self.addImage(this.src);
                           if (self.images.length >= 1 && self.picture.attr("src") == self.options.DEFAULT_IMAGE) {
                               var src = self.current();

                               if (src != "") {
                                   self.picture.show();
                                   self.picture.attr("src", self.current());
                                   $("#link_image").val(self.current());
                                   self.update();
                               }
                           }
                       }
                   };
                }

                this.update(this.current());
                this.update_description();
            }
        },

        addImage : function(img_src) {
            this.images.push(img_src);
            this.update(this.current());
        },

        next : function () {
            this.index++;
            if (this.index >= this.images.length) { this.index = this.images.length -1 };
            return this.current();
        },

        prev : function () {
            this.index--;
            if (this.index < 0) { this.index = 0 };
            return this.current();
        },

        current : function () {
            return this.images.length == 0 ? this.options.DEFAULT_IMAGE : this.images[this.index] ;
        },

        label : function () {
            return this.images.length == 0 ? "no images found" : (this.index + 1) + " of " + this.images.length;
        },

        serialize : function () {
            return ({
                'description' : this.description,
                'title' : this.title,
                'images' : this.images,
                'current' : this.current()
            });
        },

        clear : function() {
          // $('.carousel-image img').attr('src', '');
          $('.carousel-counter').text('');
          $("#link_image").val('');
          $("#link_description").val('');
          this.hide();
        },

        show : function() {
          $('.tooltip-positioner.normal').hide();
          $('.tooltip-positioner.carousel').show();
        },

        hide : function() {
          $('.tooltip-positioner.carousel').hide();
          $('.tooltip-positioner.normal').show();
        },

        update : function(element) {
          $('.carousel-image img').attr('src', element);
          $('.carousel-counter').text(this.label());
          $("#link_image").val(this.current());
          $('#post_remote_image_url').val(element);
        },

        update_description: function(){
          $("#link_title").val(carousel.title);
          $("#link_description").val(carousel.description);
          $("#link_image").val(carousel.current() == $(".carousel-loader").attr("src") ? "" : carousel.current());
        },

        _bindEvents: function () {
          var self = this;

          $('#carousel_right_arrow').unbind();
          $('#carousel_right_arrow').click(function () {
            self.update(self.next());
          });

          $('#carousel_left_arrow').unbind();
          $('#carousel_left_arrow').click(function () {
              self.update(self.prev());
          });
        }
    }
});

