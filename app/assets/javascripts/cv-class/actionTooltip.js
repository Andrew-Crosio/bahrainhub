Class('ActionTooltip')({
    prototype: {
        init: function (element, options) {
            var that = this;
            this.element = typeof element == "string" ? $(element) : element;
            this.tooltip = this.element.find('.tooltip');
            this._get_tooltip_name(this.element);
            this._hoverTooltip();
        },

        _get_tooltip_name: function(element){
            this.tooltip_name = '';

            if (element.find('.flag-tip').attr('data-post-id') !== undefined ){
                this.tooltip_name = element.find('.flag-tip').attr('data-post-id')
            }

            if ((this.tooltip_name == '') && (element.find('.thumb-tip').attr('data-post-id') !== undefined )){
                this.tooltip_name = element.find('.thumb-tip').attr('data-post-id')
            }
        },

        _hoverTooltip: function () {
            var that = this;
            this.element.hover(function (e) {
                that._get_tooltip_name($(e.currentTarget));
                that.show();
            }, function () {
                that.hide();
            });
        },

        show: function() {
            isUnmoderated = this.tooltip.filter('.tooltip[data-post-id='+this.tooltip_name+']').parent().parent().parent().hasClass('voice-unmoderated');

            if (isUnmoderated){
                this.tooltip.filter('.thumb-tip[data-post-id='+this.tooltip_name+']').show();
            } else {
                if (!this.tooltip.filter('.flags-tip[data-post-id='+this.tooltip_name+']').siblings('a').hasClass('flag-pressed') && !isUnmoderated){
                    this.tooltip.filter('.flags-tip[data-post-id='+this.tooltip_name+']').siblings('a').addClass('flag-over').removeClass('flag');
                }

                this.tooltip.filter('.flag-tip[data-post-id='+this.tooltip_name+']').show();
            }

            this.tooltip.filter('.tooltip[data-post-id='+this.tooltip_name+']').parent().parent().parent().addClass('bring-up').parent().addClass('bring-up');
        },

        hide: function() {
            var element = this.tooltip.filter('.tooltip[data-post-id='+this.tooltip_name+']').siblings('a'),
                parent = this.tooltip.filter('.tooltip[data-post-id='+this.tooltip_name+']').parent().parent().parent(),
                isUnmoderated = parent.hasClass('voice-unmoderated');

            if (!element.hasClass('flag-pressed') && !isUnmoderated){
                this.tooltip.filter('.tooltip[data-post-id='+this.tooltip_name+']').siblings('a').addClass('flag').removeClass('flag-over');
            }

            if (this.tooltip.filter('.tooltip[data-post-id='+this.tooltip_name+']').find('.flag-tooltip span').html() == 'Thank you for your vote!'){
                this.tooltip.filter('.tooltip[data-post-id='+this.tooltip_name+']').find('.flag-tooltip span').html("Vote already cast");
            }

            this.tooltip.hide();
            parent.removeClass('bring-up').parent().removeClass('bring-up');
        }
    }
});
