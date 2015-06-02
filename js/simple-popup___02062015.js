(function ($, undefined) {
    var defaults = {
        width: 800,
        onShow: function ($el) {},
        onHide: function ($el) {},
        onUpdate: function ($el) {},
       // onBeforeStart: function ($el) {},
        onAfterStart: function ($el) {},
        onLoad: function ($el) {}
    };
    $.fn.simplePopup = function (options) {
        this.each(function (e) {
            $(this).attr('data-id-pop', 'id-' + (e + 1)); 
        });
        if (this.length == 0){
            return this;
        }
        if (this.length > 1) {
            this.each(function () {
                $(this).simplePopup(options);
            });
            return this;
        }

        var plugin = {},
            settings = $.extend(true, {}, defaults, options),
            settingsTemp = {},
            $el = this;
        plugin.$el = this;

        

        plugin = {

            _initialStyle: function(){
                var $this = this;
                if (settings.width){
                    $('.popup').css('width', settings.width)
                }
                // settings.onBeforeStart.call(this, $el);
                settings.onAfterStart.call(this, $el);
            },      

            _wrapPopup: function(contentPopup, dataPopup){
                 contentPopup.wrap('<div class="pop js-pop" data-id-container="' + dataPopup + '">' +
                    '<div class="pop-box">' +
                        '<div class="popup-content"></div>' +
                    '</div>' +
                '</div>');
                containerPopup = $('.js-pop[data-id-container="' + dataPopup + '"]');
                containerPopup.prepend('<div class="pop-bg js-pop-close"></div>');
                containerPopup.find('.pop-box').prepend('<div class="pop-btn-close js-pop-close"></div>');
                contentPopup.removeClass('hidden');



            },
            _show: function(){
                var $this = $(this),
                    $conatinerId = $this.attr('data-id') || undefined,
                    $conatinerVal = $('#' + $conatinerId) || undefined,
                    $dopWidth = $this.attr('data-width-popup'),
                    $dataPopup = $this.attr('data-id'),
                    $hrefVal = $this.attr('href') || undefined;


console.log($this);


                if ($hrefVal && $hrefVal !== "#"){
                    //edit
                } else {
                    $dataPopup = $this.attr('data-id'),
                    


                    plugin._wrapPopup($conatinerVal, $dataPopup);
                    var $popUp = $('.js-pop[data-id-container="' + $dataPopup + '"]');
                    $popUp.show();
                     
                }


            },
            _setClickBtn: function(){
                $('body').on('click', '.js-popup', function(e){
                  
                    plugin._show();
                });
            },


            _build : function(){
                var $this = this;
                $this._initialStyle();
                $this._setClickBtn();                         
            }
        };

        plugin._build();

        $el.onShow = function() {
           plugin._show();
        };

        // setTimeout(function () {
        //     settings.onLoad.call(this, $el);
        // }, 10);

        return this;
    };
}(jQuery));