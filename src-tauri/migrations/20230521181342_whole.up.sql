-- Add up migration script here

CREATE TYPE applicationStatus AS ENUM ('Принято', 'Отклонено', 'Закрыто', 'Обрабатывается');
CREATE TYPE serviceName AS ENUM ('Анализы', 'Больничный', 'Справка', 'Обследование');
CREATE TYPE serviceStatus AS ENUM ('Выполнена', 'Провалена', 'Неначата');

CREATE TABLE IF NOT EXISTS users (
    id bigserial NOT NULL PRIMARY KEY,
    login varchar(64) NOT NULL,
    password varchar(64) NOT NULL,
    is_worker boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
    id bigserial NOT NULL PRIMARY KEY,
    name varchar(64) NOT NULL,
    registered_as bigint NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS workers (
    id bigserial NOT NULL PRIMARY KEY,
    name varchar(64) NOT NULL,
    registered_as bigint NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS services (
    id bigserial NOT NULL PRIMARY KEY,
    name serviceName NOT NULL,
    status serviceStatus NOT NULL,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL,
    content varchar(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
    id bigserial NOT NULL PRIMARY KEY,
    status applicationStatus NOT NULL,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL,
    client_id bigint NOT NULL REFERENCES clients(id),
    service_id bigint NOT NULL
);

INSERT INTO users(id, login, password, is_worker)
VALUES (1 , 'client1', 'pass_client1', FALSE),
       (2 , 'client2', 'pass_client2', FALSE),
       (3 , 'client3', 'pass_client3', FALSE),
       (4 , 'worker1', 'pass_worker1', TRUE ),
       (5 , 'worker2', 'pass_worker2', TRUE ),
       (6 , 'worker3', 'pass_worker3', TRUE ),
       (7 , 'client4', 'pass_client4', FALSE),
       (8 , 'client5', 'pass_client5', FALSE),
       (9 , 'client6', 'pass_client6', FALSE),
       (10, 'client7', 'pass_client7', FALSE),
       (11, 'client8', 'pass_client8', FALSE),
       (12, 'client9', 'pass_client9', FALSE);

SELECT SETVAL('public."users_id_seq"', COALESCE(MAX(id), 1)) FROM public."users";

INSERT INTO clients(id, name, registered_as)
VALUES (1, 'Цивов Игнат Клиентович', 1 ),
       (2, 'Кивов Борис Клиентович', 2 ),
       (3, 'Нивов Азат Клиентович' , 3 ),
       (4, 'Гивов Пилат Клиентович', 7 ),
       (5, 'Шивов Денис Клиентович', 8 ),
       (6, 'Щивов Пётр Клиентович' , 9 ),
       (7, 'Зивов Тарас Клиентович', 10),
       (8, 'Хивов Макар Клиентович', 11),
       (9, 'Фивов Юрий Клиентович' , 12);

SELECT SETVAL('public."clients_id_seq"', COALESCE(MAX(id), 1)) FROM public."clients";

INSERT INTO workers(id, name, registered_as)
VALUES (1, 'Вивов Иван Сотрудникович' , 4),
       (2, 'Пивов Фёдор Сотрудникович', 5),
       (3, 'Ривов Пётр Сотрудникович' , 6);

SELECT SETVAL('public."workers_id_seq"', COALESCE(MAX(id), 1)) FROM public."workers";

INSERT INTO services(id, name, status, update_time, content)
VALUES (1, 'Анализы'     , 'Выполнена', current_timestamp - INTERVAL '30 days', 'Я, Игнат, веду ЗОЖ.'              ),
       (2, 'Больничный'  , 'Выполнена', current_timestamp - INTERVAL '28 days', 'Я, Борис, приболел.'              ),
       (3, 'Справка'     , 'Выполнена', current_timestamp - INTERVAL '26 days', 'Я, Азат, здоровее всех, наверное.'),
       (4, 'Обследование', 'Выполнена', current_timestamp - INTERVAL '25 days', 'Я, Азат, хочу на работу.'         ),
       (5, 'Анализы'     , 'Провалена', current_timestamp - INTERVAL '21 days', 'Я, Пилат, хочу анализ себя.'      ),
       (6, 'Больничный'  , 'Неначата' , current_timestamp - INTERVAL '18 days', 'Я, Пилат, плохо себя чувствую.'   ),
       (7, 'Обследование', 'Неначата' , current_timestamp - INTERVAL '16 days', 'Я Пилат, как вам такое?'          );

SELECT SETVAL('public."services_id_seq"', COALESCE(MAX(id), 1)) FROM public."services";

INSERT INTO applications(id, status, update_time, client_id, service_id)
VALUES (1 , 'Закрыто'       , current_timestamp - INTERVAL '30 days', 1, 1),
       (2 , 'Отклонено'     , current_timestamp - INTERVAL '29 days', 2, 2),
       (3 , 'Закрыто'       , current_timestamp - INTERVAL '28 days', 2, 2),
       (4 , 'Отклонено'     , current_timestamp - INTERVAL '27 days', 3, 3),
       (5 , 'Закрыто'       , current_timestamp - INTERVAL '26 days', 3, 3),
       (6 , 'Закрыто'       , current_timestamp - INTERVAL '25 days', 3, 4),
       (7 , 'Отклонено'     , current_timestamp - INTERVAL '24 days', 4, 5),
       (8 , 'Отклонено'     , current_timestamp - INTERVAL '23 days', 4, 5),
       (9 , 'Отклонено'     , current_timestamp - INTERVAL '22 days', 4, 5),
       (10, 'Отклонено'     , current_timestamp - INTERVAL '21 days', 4, 5),
       (11, 'Отклонено'     , current_timestamp - INTERVAL '20 days', 4, 6),
       (12, 'Отклонено'     , current_timestamp - INTERVAL '19 days', 4, 6),
       (13, 'Принято'       , current_timestamp - INTERVAL '18 days', 4, 6),
       (14, 'Отклонено'     , current_timestamp - INTERVAL '17 days', 4, 7),
       (15, 'Обрабатывается', current_timestamp - INTERVAL '16 days', 4, 7);

SELECT SETVAL('public."applications_id_seq"', COALESCE(MAX(id), 1)) FROM public."applications";
