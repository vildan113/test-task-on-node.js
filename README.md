# Тестовое задание на разработку отчета по занятиям

### Краткое описание

Требуется создать веб-сервер на базе KoaJS или ExpressJS, который будет работать с данными по занятиям. Данные хранятся в СУБД PostgreSQL.
Предлагается сделать 2 задачи. Первая - запрос данных, вторая - манипуляция с данными.

### Общие требования

- Язык: JavaScript
- Веб-сервер: KoaJS или ExpressJS
- Версия NodeJS: 12 или выше
- Работа с СУБД через knex или pg (sql-запросы)
- Используемый Content-Type при работе - application/json
- Код должен быть выложен на GitHub или GitLab, система контроля версий - git

### Задача 1. Запрос данных

Сделать корневой метод “/”, который осуществляет поиск по данным и возвращает массив объектов - занятий.

Метод принимает параметры фильтра. Все параметры не обязательные. Все параметры должны учитываться одновременно. С помощью параметров должна работать пагинация.

#### Параметры фильтра:

- date: Либо одна дата в формате YYYY-MM-DD, либо две в таком же формате через запятую (например, «2019-01-01,2019-09-01»). Если указана одна дата, выбираются занятия на эту дату. Если указаны 2 даты, то выбираются занятия за период, включая указанные даты.
- status: Статус занятия. Принимается либо 0 (не проведено), либо 1 (проведено).
- teacherIds: ID учителей через запятую. Выбираются все занятия, которые ведет хотя бы один из указанных учителей.
- studentsCount: Количество записанных на занятия учеников. Либо одно число (тогда выбирается занятие с точным числом записанных), либо 2 числа через запятую, тогда они рассматриваются как диапазон и выбираются занятия с количеством записанных, попадающих в диапазон включительно.
- page: Номер возвращаемой страницы. По умолчанию - 1.
- lessonsPerPage: Количество занятий на странице. По умолчанию - 5 занятий.

В случае некорректных данных метод должен возвращать ошибку 400 с описанием ошибки (формат на выбор исполнителя).

В нормальном случае возвращается массив объектов-занятий. Каждый объект должен иметь вид:

```json
{
  "id": 9, // id занятия
  "date": "2019-09-01", // Дата занятия
  "title": "Orange", // Тема занятия
  "status": 1, // Статус занятия
  "visitCount": 3, // Количество учеников, посетивших занятие (по полю visit)
  "students": [ // Массив учеников, записанных на занятие
    {
      "id": 1, // id ученика
      "name": "Ivan", // имя
      "visit": true
    }
  ],
  "teachers": [ // Массив учителей, ведущих занятие
    {
      "id": 1, // id учителя
      "name": "Tanya" // имя
    }
  ]
}
```

### Задача 2. Создание занятий
Сделать метод /lessons, который будет создавать одно или несколько занятий.

Входные данные в виде JSON-объекта:

```json
{
  "teacherIds": [1, 2], // ID учителей, ведущих занятия
  "title": "Blue Ocean", // Тема занятия. Одинаковая на все создаваемые занятия
  "days": [0, 1, 3, 6], // Дни недели, по которым нужно создать занятия, где 0 - это воскресенье
  "firstDate": "2019-09-10", // Первая дата, от которой нужно создавать занятия
  "lessonsCount": 9, // Количество занятий для создания
  "lastDate": "2019-12-31" // Последняя дата, до которой нужно создавать занятия
}
```

Параметры lessonsCount и lastDate взаимоисключающие, то есть должен использоваться только один из этих параметров.
Если указан lessonsCount, то нужно создавать занятия по указанным дням недели, начиная с firstDate, пока не создастся lessonsCount занятий.
Если указан lastDate, то нужно создавать занятия по указанным дням недели, начиная с firstDate и до даты lastDate.
Установить ограничение по количеству занятий - 300, и по дате - 1 год. Например, если мы указываем период 1 год и занятия каждый день, то должно создаться только 300 занятий. Другой пример: Если мы указываем занятия только по понедельникам и количество 300, то занятия должны создастся только на год вперед (их будет около 50).
В случае некорректных данных метод должен возвращать ошибку 400 с описанием ошибки (формат на выбор исполнителя).
При успешном создании занятий должен возвращаться массив с id созданных занятий.

