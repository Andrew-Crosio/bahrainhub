Class('FacesPanel')({
    addAvatar: function(uid, url, name) {
        var item = $('<li />').attr('data-uid', uid).addClass('grid-item').append('<img src="' + url + '" title="' + name + '" />')
        $('.connections_grid').append(item);

        if ( $('.connections_grid li').length > 0 ){
            $('.facebook-container').removeClass('no-fb-face')
            $('.fb-arrow-cont').show();
            $('.connections_grid').show();
            $('.fb-button').show();
            $('.fb-btn-cont').hide();
        }
    },

    destroyAvatar: function(uid) {
        $('.connections_grid li[data-uid=' + uid + ']').remove();

        if ( $('.connections_grid li').length == 0 ) {
            $('.facebook-container').addClass('no-fb-face')
            $('.fb-arrow-cont').hide();
            $('.connections_grid').hide();
            $('.fb-button').hide();
            $('.fb-btn-cont').show();
        }
    },

    prototype: {
        init: function() {
            this.element = $('.connections_grid');
            this.fbContainer = $('.facebook-container');
            this.arrowContainer = $('.fb-arrow-cont');
            this.squareContainer = $('.fb-btn-cont');
            this.fbBtn = $('.fb-button');
            this.arrow = $('.fb-arrow');
            this.expanded = false;
            this._countFaces();
            this._bindEvents();
        },

        _bindEvents: function() {
            var that = this;
            this.arrow.click(function () {
                if ($('.connections_grid li').length > 0){
                    that.toggle();
                }
                return false;
            });
        },

        _countFaces: function() {
            var that = this;
            if ( this.element.children().size() == 0 ) {
                that.fbContainer.addClass('no-fb-face')
                that.arrowContainer.hide();
                that.element.hide();
                that.fbBtn.hide();
                that.squareContainer.show();
            } else {
                that.fbContainer.removeClass('no-fb-face')
                that.arrowContainer.show();
                that.element.show();
                that.fbBtn.show();
                that.squareContainer.hide();
            }
        },

        faceWidth: function() {
            var that = this;

        },

        toggle: function () {
            if(this.expanded) {
                this.element.css({ height: '' });
                this.expanded = false;

            } else {
                this.element.css({ height: 'auto' });
                this.expanded = true;
            }
            this.arrow.toggleClass('fb-arrow fb-arrow-open');
        }
    }
});