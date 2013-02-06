# JQuery.Model-Block-Controller plugin

Plugin for yet another MVC on client-side.

## Getting Started
install module


In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.mbc.min.js"></script>
<script>
jQuery(function($) {
  $.awesome(); // "awesome"
});
</script>
```

## Documentation

====
Model Block Controler
----

Overview: MVC - MVP - MVVM
http://outcoldman.com/ru/blog/show/184

#### Введение
MBC - вариант реализации паттерна MVC для браузера, в котором <a href="./model.view.md">View's</a> - это динамические фабрики блоков с <a href=./block.md>асинхронным коструктором</a>. Остальные уровни паттерна - Модель и Контроллер - более-менее соотвествуют классическому пониманию MVC.

Активная модель предоставляет произвольным объектам бизнес-логики интерфейсы внутреннего хранилища <a href="./model.set.md">Set</a>, <a href="./model.obj.md">Object</a>, <a href="./model.prop.md">Property</a> предоставлющих доступы к записи и чтению состояния. При создании, изменении и удалении объектов модель <a href=./model.events.md>генерирует события</a> на которые можно подписаться.

Соответствующие данным модули контроллера могут содержать фукнциональные прототипы объектов модели, поддерживать конситентность данных клиента и сервера, работать с DOM и прочими доступными ресурсами, создавать блоки представления и манипулировать ими в асинхронном режиме обеспечивая разделение формы и содержимого.

Независимые блоки - строительные кирпичи из которого состоит приложение

Инициализация модулей контроллера образовывает рантайм на клиенте  

Также как и другие варианты известной трехчаcтной архитектуры, паттерн Model-Block-Controller разделяет уровни данных, представления и управления связью между данными и представлением с целью увеличения управляемости, прозрачности и тестируемости кода приложения.

Предлагаемая реализация паттерна содержит соотвествующие части:

Активная модель - хранит данные, определяет интерфейс доступа к данным, подписки на изменения данных, методы создания, удаления, модификации объектов с данными.

==== 
Блок на уровне данных - объект c блочным интерфейсом - абстрагирующий аспекты, связанные с ресурсами, поведением и зависимостями блока. 
В качестве реализации блочной модели, можно избрать описанную этим документом ( ссылка на методолию ) или выбрать из вариантов:



- использовать встроенный блочный интерфейс 
( logic-less data-binded bem-compatible xml-based xsl-like make-builded deb-packaged holy shit ) 

- использовать bem-интерфейс ( ссылка на bem-spec ).

- смешанный блочный интерфейс на примере b-highcharts.

- реализация фабрики блоков интерфейса своими силами, с пощью молотка и ножовки.

- применение произвольной шаблонизации

// use jQuery method for listening to obj
$( 
// create object
    mvc .obj("example")
// set properties
        .json({"name":"John Smith"})
).on( 
    "mvc:prop:value", // event-name ( ./model.events.md )
     render() // any templating inside
)

- произвольная файловая структура

## License
Copyright (c) 2013 "maetchkin" Bogdan Maetchkin (maetchkin@ya.ru) 
Licensed under the MIT license.  



## Хоас

котроллер
, используя jQuery.on( "mvc:event:name",  )
медленно доставал
до шкафа

mvc model 

is

    - active,
    - observable,

has

    - set, 
    - obj, 
    - prop,

contains
    - data,
    - structure,

can
    - methods,
    - mods,
    - events,
    - bulk-methods,
    - silence and paused for writing eventflow


controller: module, init, cast

view: block, slot


data.block( template, slot )
возвращает обещание вставить результат наложения шаблона на данные в соответсвующий слот по готовности.

- data: mbc.obj или mbc.set, данные (модель) блока;
- template: композитный объект асбстрагирующий html-шаблон, js-поведение, стилевую спецификацию, картинки, ресурсы и прочую реализацию.
- slot: jQuery object, DOM node -- куда вставить
    

// Create data instance
mbc .obj ( "object-id" )
    // fill object by json
    .json(
        {
            propString: "value",
            propNumber: 0,
            propBoolean: false
        }
    )
    // asynchronous block operation 
    .block(

        // mvc шаблон
        mvc .view( "b-view" ).template( "template-name" ),

        // jQuery object, DOM node 
        $slot
    )
    
    // jQuery promise API
    .done().fail().pipe().always()
    
    // jQuery event subscriber API
    .on(
        // event name
        "mvc:action:action-name",
        function(){
            // Block object
            var block = this; 
        }
    )



===

yet another incarnation of mvc ( https://svn.yandex.ru/mvc/branches/2.3.3 )

TODO:
 - method 'has' nahern , 2 pl
 ? merge set and obj
 ? new mvc() - отдельные хранилища, неймспейс данных, подумать о блоках и ваще


====
DOC
----

Model Block Controller  1.0

Introduction
    What is [B]?

MBC is MVC-like pattern, where View object called Block and provide api for data-binding on client.

Dependencies
JQuery, make, ant, xscript (saxon?), ycssjs

Getting Started

Compare 
...to Backbone, Knockout ...etc

Reference
    mvc
        .set
            .obj
                .prop
            .json
            .each
            .first
            .last
            .del
            .empty
            .mod
                .filter
                .sort
                .pager
        
        .obj
            .prop
            .json
            .html

        .view
            .template

        .module
            .cast
            .load

        .util
        
            .getByID
            .getI18N
            .log

        .data

Blocks
    Definitions guide
    Structure
    Example
    XML Syntax
    CSStyling
    Block's logic
    Promise API

Configuration
    default
    customization

JQuery API
    $( mvc.obj ).on( callback )
    block( mvc.view ).done( ctx ).fail( ctx ).on( mvc:event, callback )

Frontend integration

Build system




MVC - Фреймворк, набор совместимых между собой клиент-серверных решений для разработки фронтенда веб приложений в рамках паттерна Модель-Вид-Контроллер. Включает в себя клиентскую и серверную части.

на сервере решаются задачи:
    * Маппинга данных с сервера на клиент
    * Сборки и хранения статики
    * Упрощения и унификации построения целых страниц и прикладных компонент

задачи, решаемые на клиенте:
    * Организация хранения и управления данными
    * Построение приложений с большим количеством клиентской логики
    * Разделение кода на модули
    * Организация смешанной компонентной среды 
    * Клиентсткая шаблонизация
    * Интеграция с инфраструктурой Яндекса
    * Локализация

Зависимости.
    Серверная часть: 
        Xscript,
        ycssjs,
        ant,
        make
    
    Клиентская часть
        jQuery

Модель
    Модель хранит состояние приложения. Модель в MVC оборудованна унифицированными методами доступа к содержимому (Аксессоры), механизмами оповещения об изменениях (События).

Контроллер
    Набор модулей с бизнес-логикой. Оборудован механизмами асинхронной загрузки, инициализации и исполнения методов. Доступ к контроллеру, так же, как и к любому объекту в MVC осуществляется через метод-аксессор.

Вид
    Набор объектов для отображения
    -------------
    Фреймворк также предоставляет средства для покомпонентной организации наборов шаблонов. Вид нужен для создания блоков на клиенте и автоматического поддержания состояния блоков в соответствии с состоянием модели. Каждый блок реализован в виде директории со всеми необходиммыми файлами - css, js, img, xml с шаблонной разметкой. Поддерживает локализацию через форматы Танкера.


Создание приложения
    Создание любого приложения должно начинаться с анализа данных и построения соответствующей модели. На этом этапе в случае необходимости пишутся соответствующие <a href="XScript-XSL-mapping.md">XScript\XSL-мапперы</a> ( PHP - PERL - Node - Python - <a href="SQL.md">SQL</a>- ORM - OMG - мапперы ) - описания структур данных модели с помощью XML-разметки. XML-Мапперы нужны для пробрасывания данных из xml-ной выдачи серванта в js-хранилище на клиенте.

    Затем подготавливаются модули отвечающие за бизнес-функционал и объединение данных с соответствующим представлением через шаблоны.

    MVC-Шаблоны могут использоваться как готовые из различных общих библиотек, либо проектно-специфические. Возможно также использование любой другой шаблонной\компонентной системы (например, Лего).


Для построения Модели используются три основных стуктуры данных - Множество (set), Объект (obj), Свойство (prop).

    * Почему так мало?
    * Все объекты одного типа?
    * Как создать множество, объект? Как задать свойство?
    * Как проверить существует ли множество, объект, свойство?
    * Как удалить множество, объект, свойство?
    * как проверить существовали ли такие множество, объект или свойство ранее;

Множество используется для хранения объектов. Множество может быть пустым. Множество не может содержать другое множество. 
    * Допускаются ли вложенные множества? (нет)

Объект объединяет свои свойства и предоставлет доступ к ним. Объект может не иметь свойств. Объект может принадлежать множеству либо являться  одиночкой. Объект может принадлежать только одному множеству.

Свойство предназначено для хранения конкретных значений. Свойство может не иметь значения (null - значение по умолчанию). Свойство может принадлежать только одному объекту

Доступ к данным производится через аксессоры - специальные методы доступа (get/set)
    * почему используются функции, а не нативные getter\setter ( потому что IE http://msdn.microsoft.com/en-us/library/dd229916.aspx, можно также использовать ES6.Proxy.Object.create )

Все типы данных являются Observable - можно подписаться на их изменения.


Использование шаблонизации на клиенте

Простой вариант
  - определить данные
  - создать блок

// mvc data object "obj-id"
mvc .obj( "obj-id" )
    
    // set data
    .json( 
        {
            prop : "value",
               a : 0,
               b : false
        }
    )

    // create block
    .block(
        // with template "item" from view "my-view"
        mvc.view( "my-view" ).template("item"),
        
        // slot for block
        $("#slot")
    )
    
    // $.on for event "mvc:action:actionName" on block.promise()
    .on( 
        "mvc:action:actionName",
        function() {
            mvc.log("actionName!");
        }
    )

С подгрузкой внешних данных
  - сходить за данными
  - создать блок

// load data
mvc .data(  
        // $.ajax config object
        { url : "gate.xml?param=value" } 
    )
    .done(
        // callback onDataLoadOk
        function () { 

            mvc.log("dataload ok");

            // mvc data set to templating
            mvc .set( "set-id" ) 
                
                // create block
                .block(
                    // with template "object-list" from view "my-view"
                    mvc.view( "my-view" ).template("object-list"),
                    
                    // slot for block
                    $("#slot")
                )
                
                // callback onBlockReady
                .done(
                    function(){ 
                        mvc.log("block created");
                    }
                )
                
                // callback onBlockFailed
                .fail( 
                    function(){
                        mvc.log("block failed");
                    }
                )
                
                // listener for event "mvc:action:actionName" from block
                .on( 
                    "mvc:action:actionName",
                    function() {
                        mvc.log("actionName!");
                    }
                )
        }
    )
    
    // callback onDataLoadFailed
    .fail( 
        function () {
            mvc.log("dataload failed");
        }
    )



Встраивание
    Зависимости
    Подключение
    Сборка

фантом на Люсю 86_64
- собрать по http://yoodey.com/comment/10803
    Ubuntu 11.10 have several updates and seems it might have problem with PhantomJS. But don't worry, i will show you the way to install and run PhantomJS without problem here.

    1. Install dependency
    sudo apt-get install xvfb git build-essential gtk2-engines-pixbuf xfonts-100dpi x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic
    sudo apt-get install libqt4-dev libqtwebkit-dev qt4-qmake python-qt4


    2. Install PhantomJS
    cd ~/
    git clone git://github.com/ariya/phantomjs.git && cd phantomjs
    qmake-qt4 && make
    sudo cp bin/phantomjs /usr/local/bin/


    3. Testing PhantomJS
    Create this website screenshots :
    DISPLAY=:0 phantomjs ~/phantomjs/examples/rasterize.js http://yoodey.com screenshot.png

- локально 

    1. выясняем архитектуру 64 или 32
    uname -a;

    2. создаем tmp в хомяке если еще нет
    mkdir tmp;
    cd tmp; 

    3. выясням соответственно нужный урл на http://phantomjs.org/download.html и скачиваем архив,
    wget http://phantomjs.googlecode.com/files/phantomjs-1.8.1-linux-x86_64.tar.bz2;

    3. распаковываем
    bzip2 -d  phantomjs-1.8.1-linux-x86_64.tar.bz2;
    tar -xf  phantomjs-1.8.1-linux-x86_64.tar;

    4. копируем в локальный bin
    mv ~/tmp/phantomjs-1.8.1-linux-x86_64/bin ~/bin;

    5 прописываем локальный bin в .bashrc
    export PATH=$PATH:~/bin;
    . ~/.bashrc;








