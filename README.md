# JQuery.Model-Block-Controller plugin

Plugin for yet another MVC on client-side

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

## License
Licensed under the MIT license. 

## ©
2013 "maetchkin" Bogdan Maetchkin (maetchkin@gmail.com) 
2013 Yandex
