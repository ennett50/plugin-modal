/**
 * @author ennet
 * @uri    https://github.com/ennett50/plugin-modal
 */
(function($) {

    // значени по умолчанию
    var defaults = {
        fixedElements: '.js-fixed',
        afterLoader: function($el){}

    };
    var methods = {},
        $el = this;

    methods.$el = this;

    methods = {
        __init:function(params) {
            // актуальные настройки, будут индивидуальными при каждом запуске
            var options = $.extend({}, defaults, params);


            // инициализируем один раз
            var init = $(this).data('simplePopup');

            if (init) {
                return this;
            } else {
                $(this).data('simplePopup', true);
                this.each(function (e) {
                    $(this).attr('data-id-pop', 'id-' + (e + 1));
                });


                return this.on("click.simplePopup",function(){

                    methods._show(this);
                    options.afterLoader.call(this)
                    return false;
                });
            }
        },

        // генерация попапа для окна из загрузки с другой страницы (ajax)
        _generatePopup: function (data_popup) {
            $('body').append('<div class="pop js-pop" data-id-container="' + data_popup + '">' +
                '<div class="pop-bg js-pop-close"></div><div class="pop-box">' +
                '<div class="pop-btn-close js-pop-close"></div>' +
                '<div class="popup-content"></div>' +
                '</div>' +
                '</div>');


        },
        //оборачивание контента 
        _wrapPopup: function (contentPop, data_popup) {
            contentPop.wrap('<div class="pop js-pop" data-id-container="' + data_popup + '">' +
                '<div class="pop-box">' +
                '<div class="popup-content"></div>' +
                '</div>' +
                '</div>');
            containerPopup = $('.js-pop[data-id-container="' + data_popup + '"]');
            containerPopup.prepend('<div class="pop-bg js-pop-close"></div>');
            containerPopup.find('.pop-box').prepend('<div class="pop-btn-close js-pop-close"></div>');
            contentPop.removeClass('hidden');
        },
        //расчет справа ширины скролла браузера
        _fixBody : function($this){
            var $body = $('body');
            $body.css({'overflow': 'auto'});

            var $beforePadding = $body.outerWidth();
            $body.css({'overflow': 'hidden'});

            var $isPadding = $body.outerWidth() - $beforePadding;
            return $isPadding;
        },
        // установка дополнительных параметров попапа 
        _isVisible: function($this, $callback){
            var $this = $($this),
                $thisId = $this.attr('data-id-pop'),

                $dopFunction = $this.attr('data-function'),

                $dopWidth = $this.attr('data-width-popup'),

                $dopClass = $this.attr('data-class'),
                containerPopup = $('.js-pop[data-id-container="' + $thisId + '"]');

                

            var padding = methods._fixBody();

            $('body').css({'padding-right': padding});
            var $fixed = $(defaults.fixedElements);

            $fixed.css('width', $fixed.outerWidth() - padding);

            if ($dopWidth) {
                containerPopup.find('.pop-box').css('width', $dopWidth);
                
            }
            if ($dopClass) {
                containerPopup.find('.pop-box').addClass($dopClass);
            }
            if ($dopFunction) {
               currentFunction = eval($dopFunction);              
            }

            containerPopup.show();   


        },
        // показ попапа в зависимости от типа
        _show : function($this, $callback){
            var $this = $($this),
                $body = $('body'),
                $thisId = $this.attr('data-id-pop'),
                $conatinerId = $this.attr('data-id') || null,
                $conatinerVal = $('#' + $conatinerId) || null,
                $dataPopup = $this.attr('data-id'),
                $hrefVal = $this.attr('href') || null;

            methods._hide();

            if ($hrefVal && $hrefVal !== "#"){
                methods._generatePopup($thisId);
                var containerPopup = $('.js-pop[data-id-container="' + $thisId + '"]').find('.popup-content');

                $body.append('<div class="preloader"></div>');                
                containerPopup.load($hrefVal + ' #js-begin-content-popup', function (responseText, textStatus, req) {
                    if (textStatus == "error") {
                        console.log('Error: link not found')
                    }                               
                    $('.preloader').remove();
                    methods._isVisible($this);                   
                });
            
                return false

            } else {

                var sectionPop = $this.parents('body').find('#' + $dataPopup);
                methods._wrapPopup(sectionPop, $thisId);
                methods._isVisible($this);
            }

        },

        _hide : function() {
            $('body').on('click', '.js-pop-close', function () {
                methods.onHide();
            });
            $(document).keydown(function (eventObject) {
                if (eventObject.which == 27)
                    methods.onHide();
            });
        },

        onHide : function(){
            var $jsPop = $('.js-pop'),
                $containerPopup = $jsPop.attr('data-id-container'),
                $dataIdPopup = $('[data-id-pop="' +  $containerPopup + '"]'),
                $currentPopup = $('#' + $dataIdPopup.attr('data-id')),
                $hrefVal = $dataIdPopup.attr('href') || null;

            if ( $hrefVal && $hrefVal !== "#" ) {
                $jsPop.hide().remove();
            }
            else {
                $jsPop.hide();
                $('.js-pop-close').remove();
                $currentPopup.unwrap().unwrap().unwrap().addClass('hidden');
            }

            $('body').css({'padding-right': '', 'overflow': ''});
            $(defaults.fixedElements).css('width', '');


        },
        onUpdate : function(content){
            $('.js-pop:visible .popup-content').html(content);
        },
        destroy:function() {
            methods.reset.apply(this);
            $(this).unbind(".simplePopup");
        }
    };



    $.fn.simplePopup = function(method){

        // немного магии
        if ( methods[method] ) {
            // если запрашиваемый метод существует, мы его вызываем
            // все параметры, кроме имени метода прийдут в метод
            // this так же перекочует в метод
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            // если первым параметром идет объект, либо совсем пусто
            // выполняем метод init
            return methods.__init.apply( this, arguments );
        } else {
            // если ничего не получилось
            $.error( 'Метод "' +  method + '" не найден в плагине jQuery.simplePopup' );
        }



        //return this;
    };
})(jQuery);