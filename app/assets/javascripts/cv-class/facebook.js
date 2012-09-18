Class('Facebook')({
    prototype: {
        init: function() {
            var that = this;

            FB.init({
                appId: '101972966529938',
                xfbml: true
            });
            this.element = $('.fb-button, .fb-button-square');
            this._bindEvents();

            this.isLoggedIn(function(session){
                if (session) {
                    that._updateLabel(session.uid);
                }
            });
        },

        _updateLabel: function(uid){
            if ( uid != '' && uid !== undefined && $('.connections_grid li[data-uid=' + uid + ']').length > 0 ){
                $('.fb-button span span').html('Stop Supporting');
            } else {
                $('.fb-button span span').html('Support This');
            }
        },

        _bindEvents: function() {
            var that = this;
            this.element.bind('click', function () {
                if ( $('.fb-button span span').html() == 'Stop Supporting' && $('.connections_grid li').length > 0 ){
                    that.login( function(uid){ that.destroyAvatar(uid); });
                } else {
                    that.login( function(uid){ that.saveAvatar(uid); });
                }
                return false;
            });
        },

        saveAvatar: function(uid) {
            $.ajax({
                url: '/' + window.currentVoice.id + '/supporters.json',
                type: 'post',
                dataType: 'json',
                data: { uid: uid },
                context: this,
                success: function (data) {
                    FacesPanel.addAvatar(uid, data.url, data.username);
                    $('.fb-button span span').html('Stop Supporting');
                }
            });
        },

        destroyAvatar: function(uid) {
            $.ajax({
                url: '/' + window.currentVoice.id + '/supporters/' + uid,
                type: 'post',
                dataType: 'json',
                data: { _method: 'delete' },
                context: this,
                success: function (data) {
                    FacesPanel.destroyAvatar(data.uid);
                    $('.fb-button span span').html('Support This');
                }
            });
        },

        isLoggedIn: function(callback){
            FB.getLoginStatus(function (response) {
                callback(response.session);
            });
        },

        login: function (callback) {
            var that = this;
            FB.getLoginStatus(function (response) {
                if(response.session) {
                    callback(response.session.uid);
                } else {
                    FB.login(function (response) {
                        if (response.session) {
                            callback(response.session.uid);
                        }
                    });
                }
            });
        }
    }
});
