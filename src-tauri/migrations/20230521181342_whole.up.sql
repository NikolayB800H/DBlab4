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
VALUES (1, 'client1', 'pass_client1', FALSE),
       (2, 'client2', 'pass_client2', FALSE),
       (3, 'client3', 'pass_client3', FALSE),
       (4, 'worker1', 'pass_worker1', TRUE ),
       (5, 'worker2', 'pass_worker2', TRUE ),
       (6, 'worker3', 'pass_worker3', TRUE );

SELECT SETVAL('public."users_id_seq"', COALESCE(MAX(id), 1)) FROM public."users";

INSERT INTO clients(id, name, registered_as)
VALUES (1, 'Игнат Клиентович', 1),
       (2, 'Борис Клиентович', 2),
       (3, 'Азат Клиентович' , 3);

SELECT SETVAL('public."clients_id_seq"', COALESCE(MAX(id), 1)) FROM public."clients";

INSERT INTO workers(id, name, registered_as)
VALUES (1, 'Иван Сотрудникович' , 4),
       (2, 'Тарас Сотрудникович', 5),
       (3, 'Пётр Сотрудникович' , 6);

SELECT SETVAL('public."workers_id_seq"', COALESCE(MAX(id), 1)) FROM public."workers";

INSERT INTO services(id, name, status, update_time, content)
VALUES (1, 'Анализы'     , 'Неначата', current_timestamp + '5 days' , 'Я, Игнат, веду ЗОЖ.'              ),
       (2, 'Больничный'  , 'Неначата', current_timestamp + '10 days', 'Я, Борис, приболел.'              ),
       (3, 'Справка'     , 'Неначата', current_timestamp + '20 days', 'Я, Азат, здоровее всех, наверное.'),
       (4, 'Обследование', 'Неначата', current_timestamp + '30 days', 'Я, Азат, хочу на работу.'         );

SELECT SETVAL('public."services_id_seq"', COALESCE(MAX(id), 1)) FROM public."services";

INSERT INTO applications(id, status, update_time, client_id, service_id)
VALUES (1, 'Обрабатывается', current_timestamp + '5 days' , 1, 1),
       (2, 'Обрабатывается', current_timestamp + '10 days', 2, 2),
       (3, 'Обрабатывается', current_timestamp + '15 days', 2, 2),
       (4, 'Обрабатывается', current_timestamp + '20 days', 3, 3),
       (5, 'Обрабатывается', current_timestamp + '25 days', 3, 3),
       (6, 'Обрабатывается', current_timestamp + '30 days', 3, 4);

SELECT SETVAL('public."applications_id_seq"', COALESCE(MAX(id), 1)) FROM public."applications";
