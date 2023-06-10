-- Add up migration script here

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

CREATE TABLE IF NOT EXISTS applications (
    id bigserial NOT NULL PRIMARY KEY,
	description varchar(64) NOT NULL,
	done boolean NOT NULL,
	due_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by bigint NOT NULL REFERENCES clients(id)
);

INSERT INTO users(id, login, password, is_worker)
VALUES (1, 'user_first' , 'password_first' , FALSE),
       (2, 'user_second', 'password_second', FALSE),
       (3, 'user_third' , 'password_third' , FALSE),
       (4, 'user_4'     , 'password_4'     , TRUE ),
       (5, 'user_5'     , 'password_5'     , TRUE ),
       (6, 'user_6'     , 'password_6'     , TRUE );

SELECT SETVAL('public."users_id_seq"', COALESCE(MAX(id), 1)) FROM public."users";

INSERT INTO clients(id, name, registered_as)
VALUES (1, 'Клиент Первый Иванович', 1),
       (2, 'Клиент Второй Иванович', 2),
       (3, 'Клиент Третий Иванович', 3);

SELECT SETVAL('public."clients_id_seq"', COALESCE(MAX(id), 1)) FROM public."clients";

INSERT INTO workers(id, name, registered_as)
VALUES (1, 'Сотрудник Первый Фёдорович', 4),
       (2, 'Сотрудник Второй Фёдорович', 5),
       (3, 'Сотрудник Третий Фёдорович', 6);

SELECT SETVAL('public."workers_id_seq"', COALESCE(MAX(id), 1)) FROM public."workers";

INSERT INTO applications(id, description, done, due_time, created_by)
VALUES (1, 'task_1', FALSE, current_timestamp + '5 days' , 1),
       (2, 'task_2', FALSE, current_timestamp + '10 days', 2),
       (3, 'task_3', TRUE , current_timestamp + '15 days', 2),
       (4, 'task_4', FALSE, current_timestamp + '20 days', 3),
       (5, 'task_5', TRUE , current_timestamp + '25 days', 3),
       (6, 'task_6', FALSE, current_timestamp + '30 days', 3);

SELECT SETVAL('public."applications_id_seq"', COALESCE(MAX(id), 1)) FROM public."applications";
