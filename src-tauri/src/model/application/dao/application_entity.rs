use chrono::prelude::*;
use serde::Serialize;
use sqlx::FromRow;
//use chrono::NaiveDate;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct ApplicationEntity {
    pub id: i64,
    pub description: String,
    pub done: bool,
    pub due_time: DateTime<Utc>/*NaiveDate*/,
    pub created_by: i64,
}
