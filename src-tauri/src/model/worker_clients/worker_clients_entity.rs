use chrono::prelude::*;
use serde::Serialize;
use sqlx::FromRow;

/* clients                 | users                          */
/* id, name, registered_as | id, login, password, is_worker */
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct WorkerClientsEntity {
    pub clients_id: i64,
    pub clients_name: String,
    pub clients_registered_as: i64,
    pub users_id: i64,
    pub users_login: String,
    pub users_password: String,
    pub users_is_worker: bool,
}
