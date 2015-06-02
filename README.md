# plugin-modal
simple popup

Вызов:
```js
$(document).ready(function(){
    $('.js-popup').simplePopup();
});
```
Два варианта предоставления в контенте:
1. из контейнера на странице
2. подгружать контент с другой старницы


##Вызов контейнера
Должен быть data-id, в котором указывается id содержимого попапа (может располагаться в любом месте).
Также класс для инициализации плагина .js-popup

```html
<button data-id="content-info" class="js-popup">Показать окно в контейнере</button>
<div id="content-info" class="hidden">Контайнер на странице</div>
```


##Вызов с другой страницы

Нужен урл самой страницы и класс для инициализации плагина .js-popup
```html
<a href="test/test.html" class="js-popup">Показать окно подгрузкой с другой страницы</a>
```
На станице весь подгружаемый контент обернут в 
```html
 <div id="js-begin-content-popup"></div>
```

###ВАЖНО!
Весь контент страницы должен быть обернуть в тэг <b>main</b>


##Параметры
-Установка через data-width-popup="350" ширины модального окна

-Скрытие окна глобальным методом
```js
$('.js-popup').simplePopup('hide')
```
-Обновление содержимого окна
```js
$('.js-popup').simplePopup('update','<h2>Hello, world!</h2>')
```
-Настрйоки - callback
```js
var defaults_options = {
    EndCallback: function () {
    }
};
```
