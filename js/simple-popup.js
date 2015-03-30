(function ($) {

    // значение по умолчанию
    var defaults_options = {
        EndCallback: function () {
        }
    };

// наши публичные методы
    var methods = {
        // инициализация плагина
        init: function (params) {
            // актуальные настройки, будут индивидуальными при каждом запуске
            var options = $.extend({}, defaults_options, params);


            // инициализируем один раз
            var init = $(this).data('simplePopup');

            if (init) {
                return this;
            } else {
                $(this).data('simplePopup', true);

                return this.each(function (e) {
                    $(this).attr('data-id-pop', 'id_' + (e + 1));
                    var $this = $(this),
                        data_popup = $this.attr('data-id-pop');

                    $this.bind("click.simplePopup", function (event) {
                        methods.showPopup(data_popup, $this, options.EndCallback);
                        event.preventDefault();
                    });
                });
            }
        },

        generatePopup: function (data_popup) {
            $('body').append('<div class="pop js-pop" data-id-container="' + data_popup + '">' +
                '<div class="pop-bg js-pop-close"></div><div class="pop-box">' +
                '<div class="pop-btn-close js-pop-close"></div>' +
                '<div class="popup-content"></div>' +
                '</div>' +
                '</div>');


        },
        showPopup: function (data_popup, $this, $callback) {

            methods.generatePopup(data_popup);
            var containerPopup = $('.js-pop[data-id-container="' + data_popup + '"]'),
                $href = $this.attr('href'),
                $body = $('body'),
                $dop_width = $this.attr('data-width-popup');
            if ($dop_width) {
                containerPopup.find('.pop-box').css('width', $dop_width);
            }
            methods.hidePopup();

            if ($href) {
                $body.append('<div class="preloader"></div>');

                containerPopup.find('.popup-content').load($href + ' #js-begin-content-popup', function () {
                    $('.preloader').remove();
                    containerPopup.show();
                    $callback.call($this);
                });

            } else {
                var content_visible22 = $this.next('.js-pop-container').clone().html(),
                    $this_id = $this.attr('data-id'),
                    content_visible = $this.parents('body').find('#' + $this_id).clone().html();
                containerPopup.find('.popup-content').append(content_visible);
                containerPopup.show();
                $callback.call($this);
            }
            var $mainHeight = $(document).outerHeight(),
                $windowHeight = $(window).outerHeight(),
                $topPanel = $('.fixed-header').outerHeight(),
                $scrollTop = $(document).scrollTop();
            $("main").wrapInner("<div class='pop-locker' />");
            var $popLocker = $('.pop-locker');


            $popLocker.css({
                'height': $mainHeight,
                'padding-top': $topPanel,
                'margin-top': -$scrollTop
            });
            if ($mainHeight == $windowHeight) $popLocker.css('overflow', 'auto');


        },
        hidePopup: function () {
            $('body').on('click', '.js-pop-close', function () {
                methods.hide()
            });
            $(document).keydown(function (eventObject) {
                if (eventObject.which == 27)
                    methods.hide()
            });
        },

        hide: function () {
            $('.js-pop').hide().remove();
            var defaultScrollTop = $('.pop-locker').css('margin-top');
            var top = (parseFloat(defaultScrollTop.replace('px','')))*-1;
            methods.unwraper($('main'), '.pop-locker');
            $(document).scrollTop(top);



        },

        destroy: function () {
//            methods.reset.apply(this);
            //удаляются все обработчики событий
            return this.each(function () {
                $(window).unbind('.simplePopup');
            })
        },
        update: function (content) {
            $('.js-pop:visible .popup-content').html(content);
        },
        unwraper: function ($this, selector) {
            return $this.each(function () {
                var $that = this,
                    $selector = (typeof selector !== 'undefined') ? $($that).find(selector) : $($that).children().first();
                if ($selector.length === 1) {
                    $selector.contents().appendTo($that);
                    $selector.remove();
                }
            });
        }

    };


    $.fn.simplePopup = function (method) {
        var $body = $('body');
        // если запрашиваемый метод существует, мы его вызываем
        // все параметры, кроме имени метода прийдут в метод
        // this так же перекочует в метод
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            // если первым параметром идет объект, либо совсем пусто
            // выполняем метод init
            return methods.init.apply(this, arguments);
        } else {
            // если ничего не получилось
            $.error('Метод с именем ' + method + ' не существует для jQuery.simplePopup');
        }
    };
})(jQuery);