-- Add down migration script here

DROP TABLE applications CASCADE;
DROP TABLE services CASCADE;
DROP TABLE workers CASCADE;
DROP TABLE clients CASCADE;
DROP TABLE users CASCADE;
DROP TYPE serviceStatus;
DROP TYPE serviceName;
DROP TYPE applicationStatus;
