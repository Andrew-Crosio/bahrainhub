Class('Timeline')({
    currentPage: 1,

    loadPage: function (page) {
        page = page || Timeline.currentPage;
        var params = '?page=' + page;
        if ($.deparam.querystring().mod) {
            params += '&mod=1';
        }
        if (this.startDate) {
            params += '&start=' + this.startDate;
        }
        $.getScript(location.pathname + params);
    },

    loadDate: function (date, callback) {
        var params = '?start=' + date;
        this.startDate = date;
        this.currentPage = 1;
        if ($.deparam.querystring().mod) {
            params += '&mod=1';
        }
        $.getScript(location.pathname + params, function () {
            $.isFunction(callback) && callback();
        });
    },

    checkScroll: function() {
        if (Timeline.nearBottom()) {
            Timeline.currentPage++;
            Timeline.loadPage();
        } else {
            setTimeout(Timeline.checkScroll, 250);
        }
    },

    nearBottom: function () {
        return (Timeline.pageHeight() - $(window).height()) > 550 && (Timeline.pageHeight() - (window.pageYOffset + self.innerHeight)) <= 550;
    },

    pageHeight: function () {
        return Math.max(document.body.scrollHeight, document.body.offsetHeight, $(document).height());
    },

    months: [0, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    build: function (element, dates) {
        var that = this;
        this.element = element;
        this.dates = dates;
        this.bottomScroller = $('.bottom-scroll');
        this.topScroller = $('.top-scroll');
        this.slider = this.element.find('#slider-vertical');
        this.scrollable = $.browser.mozilla || $.browser.msie ? 'html' : 'body';
        this._createYearSliders();
        this._setHeight();
        this._createSlider();
        this._hoverBind();
        this._bindMouseWheel();
        this.updateSliderPosition();
        this._resizeWindow();
        setTimeout(Timeline.checkScroll, 2000);
        $('.flash-message').bind('flash.close', function () {
            that.sliderTop -= 45;
            that._setHeight();
        });
    },

    updateSliderPosition: function () {
        var y, y1, fromTop, date, year, val, that = this,
            visible = $.grep($('.voices-container > .voice-box'), function (n) {
                n = $(n);
                y1 = $('.voices-container').offset().top;
                y = $('body').height() - y1;
                fromTop = n.offset().top - y1 - $(that.scrollable).scrollTop();
                return fromTop < y && fromTop > y1;
            }).map(function (n, i) {
                return $(n).data('created-at');
            });
        if (visible.length) {
            date = visible.sort()[0];
            year = parseInt(/(\d{4})-\d{2}-\d{2}/.exec(date)[1], 10);
            if (year != this.current_year) {
                this._setYear(year, false);
            }
            val = $.inArray(date, this.currentYearDates());
            if (val > -1) {
                this.slider.slider('value', val);
            }
        }
    },

    checkAnnouncement: function() {
        var msg = $('.flash-message'),
            scrolledUp = $(this.scrollable).scrollTop() > $('.flash-message').height();
        if (msg.length && msg.is(':visible')) {
            if (!msg.data('hidden') && scrolledUp) {
                this.sliderTop -= 45;
                msg.data('hidden', true);
                this._setHeight();
                this.element.css('top', this.sliderTop);
            } else if (msg.data('hidden') && !scrolledUp) {
                this.sliderTop += 45;
                msg.data('hidden', false);
                this._setHeight();
                this.element.css('top', this.sliderTop);
            }
        }
    },

    _bindMouseWheel: function() {
        var that = this;
        $('.voices-container, #slider-vertical').bind('mousewheel', function (ev, delta, deltaX, deltaY) {
            if (!that.sliding) {
                var scrolltop = $(that.scrollable).scrollTop() - deltaY * 10;
                that._scroll(scrolltop);
            }
        });
    },

    _scroll: function (scrolltop) {
        $(this.scrollable).scrollTop(scrolltop);
        this.updateSliderPosition();
        this.checkAnnouncement();
    },

    _createYearSliders: function() {
        var items = '',
            that = this,
            template = $('#timeline-deactivated').html(),
            year;
        this.min_year = 3000;
        this.max_year = 0;

        for (year in this.dates) {
            if (this.dates.hasOwnProperty(year)) {
                year = parseInt(year);
                if (year > this.max_year) {
                    this.max_year = year;
                }
                if (year < this.min_year) {
                    this.min_year = year;
                }
            }
        }
        for (year in this.dates) {
            if (this.dates.hasOwnProperty(year) && parseInt(year) != this.max_year) {
                items = template.replace(/{{year}}/g, year) + items;
            }
        }
        if (items.length) {
            this.element.append(items);
            this.element.delegate('.disactivated-timeliner', 'click', function () {
                that._setYear($(this).data('year'));
                return false;
            });
        }
    },

    _setYear: function(year, scrollBody) {
        var y, movers, filter,
            diff = this.current_year - year,
            parent = this.slider.parent(),
            that = this;

        if (diff > 0) { // bottom year selected
            parent.nextAll('.disactivated-timeliner').filter(':lt('+diff+')').each(function () {
                y = $(this).data('year') + 1;
                $(this).data('year', y).find('.year-text').text(y).end().insertBefore(parent);
            });
        } else { // top year selected
            diff *= -1;
            parent.prevAll('.disactivated-timeliner').filter(':lt('+diff+')').each(function () {
                y = $(this).data('year') - 1;
                $(this).data('year', y).find('.year-text').text(y).end().insertAfter(parent);
            });
        }

        this.current_year = year;
        this._updateSliderRanges();
        this._updateSlider();
        if (scrollBody !== false) {
            this.scrollToDate(this.currentYearDates()[this.currentYearDates().length - 1], function () {
                that.checkAnnouncement();
            });
        }
    },

    _createSliderThicks: function() {
        var thicks = '',
            date, percent, month, next_month, dateparts, day,
            dates_length = this.currentYearDates().length,
            first_thick = dates_length > 150 ? function () { return false; } : function () { return i == 0 };

        for (var i = dates_length - 1; i >= 0; i--) {
            date = this.currentYearDates()[i];
            dateparts = (/\d{4}-(\d{2})-(\d{2})/).exec(date);
            month = parseInt(dateparts[1], 10);
            day = dateparts[2];
            percent = i / this.slider_max * 100;
            if (i > 0) {
                next_month = parseInt((/\d{4}-(\d{2})-\d{2}/).exec(this.currentYearDates()[i - 1])[1], 10);
            }
            thicks += '<li style="bottom: ' + percent + '%">'; 
            if (first_thick() || (next_month && month != next_month)) {
                thicks += '<span class="thick-mark"></span><span class="month-label" style="visibility:hidden">' + this.months[month] + '</span>';
            } else {
                thicks += '<span class="minor-thick-mark" title="' + date + '"></span>';
            }
            thicks += '</li>';
        }
        this.slider_tip.text(this.months[month] + ' ' + day);
        this.slider_thicks.html(thicks)
            .find('> li').addClass("value-dot").end()
            .find('ul > li').addClass("values-sep-dot");
    },

    _onStop: function(ui) {
        this.slider_tip.text(this.parseDate(this.currentYearDates()[ui.value]));
        this.scrollToDate(this.currentYearDates()[ui.value]);
    },

    _onChange: function(ui) {
        this.slider_tip.text(this.parseDate(this.currentYearDates()[ui.value]));
    },

    parseDate: function(date) {
        var dateparts = (/\d{4}-(\d{2})-(\d{2})/).exec(date),
            month = parseInt(dateparts[1], 10);
            day = dateparts[2];
        return this.months[month] + ' ' + day;
    },

    scrollToDate: function (date, callback) {
        this.sliding = true;

        ele = $('.voices-container > [data-created-at='+date+']');

        if (ele.length) {
            $(this.scrollable).animate({scrollTop: ele.position().top}, function () {
                $.isFunction(callback) && callback();
            });
        } else {
            this.loadDate(date, callback);
        }

        this.sliding = false;
        this.hide();
    },

    _updateSlider: function() {
        this._createSliderThicks();
        this.slider.slider('option', 'max', this.slider_max).slider('value', this.slider_max);
    },

    _updateSliderRanges: function() {
        this.slider_max = this.currentYearDates().length - 1;
    },

    currentYearDates: function() {
        return Array.apply(null, this.dates[this.current_year.toString()]).reverse();
    },

    _createSlider: function() {
        var that = this;
        this.current_year = this.max_year;
        this._updateSliderRanges();

        this.slider.slider({
            orientation: 'vertical',
            min: 0,
            max: 1,
            value: 1,
            range: 'max',
            slide: function (e, ui) {
                that._onChange(ui);
            },
            stop: function (e, ui) {
                that._onStop(ui);
            },
            change: function (e, ui) {
                that._onChange(ui);
            }
        });
        this.slider_thicks = $('<ul class="slider-values"/>').css({height: '100%'}).appendTo(this.slider);
        this.slider_tip = $('<span class="sl-month" id="slider-tip"/>').appendTo(this.slider.find(".ui-slider-handle"));
        this._updateSlider();
        $('<div></div>', {"class": "slider-line", css: {height: this.slider.height() - 12}}).appendTo(this.slider);
        this.topScroller.css({top: $('.main-header').height()});
        this.bottomScroller.css({bottom: 35});
        this.topScroller.hover(function () {
            that.autoScrollOn = true;
            that._autoScroll(2);
        }, function () {
            that.autoScrollOn = false;
        });
        this.bottomScroller.hover(function () {
            that.autoScrollOn = true;
            that._autoScroll(-2);
        }, function () {
            that.autoScrollOn = false;
        });
    },

    _autoScroll: function (delta) {
        var that = this;
        if (!this.sliding) {
            var scrolltop = $(this.scrollable).scrollTop() - delta * 10;
            this._scroll(scrolltop);
            if (this.autoScrollOn) {
                setTimeout(function () {
                    that._autoScroll(delta);
                }, 50);
            }
        }
    },

    _setHeight: function() {
        this.element.css("top", $('.voices-container').offset().top);
        this.sliderTop = this.sliderTop || this.slider.offset().top;
        var deactivated = $('.timeliner.disactivated-timeliner', this.element),
            h = $(window).height() - this.sliderTop - ((deactivated.height()) * deactivated.length) - 30;
        this.slider.height(h);
        this.slider.find('.slider-line').height(h - 12);
    },

    show: function () {
        var toggleable = $('.disactivated-timeliner .year-label', this.element).hide();
        this.element.next().children('.voices-container').stop().animate({right: 30});
        this.element.find('.slider-values .month-label').css({visibility: 'visible'});
        toggleable.show();
    },

    hide: function () {
        if (!this.sliding) {
            var toggleable = $('.disactivated-timeliner .year-label', this.element).hide();
            this.element.next().children('.voices-container').stop().animate({right: 0});
            this.element.find('.slider-values .month-label').css({visibility: 'hidden'});
            toggleable.hide();
        }
    },

    _hoverBind: function() {
        var that = this,
            toggleable = $('.disactivated-timeliner .year-label', this.element).hide();
        $('> li:last', this.element).addClass('last');
        this.element.bind('mouseover', function () {
            that.show();
        }).bind('mouseleave', function () {
            that.hide();
        });
    },

    _resizeWindow: function() {
        var that = this;
        $(window).bind('resize', function() {
            that._setHeight();
            $('#slider-vertical').find('.slider-line').css({height: that.slider.height() - 12});
        });
    }

});
