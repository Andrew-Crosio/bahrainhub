Class('SidebarToggler')({
    prototype: {
        init: function() {
            this.element = $('.tab-controller');
            this.closeWidth = 5;
            this.openWidth = 268;
            this.open = true;
            this.postInput = $('.post > input');
            this.aside = $('.voice');
            this._bindEvents();
        },

        _bindEvents: function () {
            var that = this;
            $('.tab-controller').click(function () {
                that.toggle();
            });
        },

        toggle: function () {
            this.open ? this.hide() : this.show();
        },

        show: function () {
            var tcurrentLeft = parseInt($('.tweets').css('left')) - 169,
                fbcurrentLeft = parseInt($('.fbcomments').css('left')) - 169,
                excerpt = parseInt( $('.voice-subtitle').css('padding-right') ) + 268;
            var postWidth = this.postInput.width(),
                postOpen = postWidth - this.openWidth + this.closeWidth;
            $('.voice').animate({ width: this.openWidth }, 300);
            $('hgroup').animate({ width: this.openWidth - 1 }, 300);
            $('.tweets').css("left", tcurrentLeft); 
            $('.fbcomments').css("left", fbcurrentLeft);           
            $('.panel-padding').animate({ marginLeft: this.openWidth }, 300);
            $('.voice-subtitle').css('padding-right', excerpt + 'px');
            this.postInput.animate({ width: postOpen }, 300);
            this.element.animate({ left: this.openWidth }, 300, function () {
                $(this).removeClass('close-control');
                $(this).trigger('sidebar.toggle');
                DynamicMeasures.update();
            });
            this.open = true; 
        },

        hide: function () {
            var tcurrentLeft = parseInt($('.tweets').css('left')) + 169,
                fbcurrentLeft = parseInt($('.fbcomments').css('left')) + 169,
                excerpt = parseInt( $('.voice-subtitle').css('padding-right') ) - 268;
            var postWidth = this.postInput.width(),
                postClose = postWidth + this.openWidth - this.closeWidth;
            $('.voice').animate({ width: this.closeWidth }, 300);
            $('hgroup').animate({ width: this.closeWidth - 1}, 300);
            $('.tweets').css("left", tcurrentLeft); 
            $('.fbcomments').css("left", fbcurrentLeft)           
            $('.panel-padding').animate({ marginLeft: this.closeWidth }, 300);
            $('.voice-subtitle').css('padding-right', excerpt + 'px');
            this.postInput.animate({ width: postClose }, 300);
            this.element.animate({ left: this.closeWidth }, 300, function () {
                $(this).addClass('close-control');
                $(this).trigger('sidebar.toggle');
                DynamicMeasures.update();
            });
            this.open = false;
            var tcurrentLeft = parseInt($('.tweets').css('left')) + 169,
                fbcurrentLeft = parseInt($('.fbcomments').css('left')) + 169;
        }
    }
});