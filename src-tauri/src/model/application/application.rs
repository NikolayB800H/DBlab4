use chrono::prelude::*;
use getset::{Getters, Setters};
use serde::{Deserialize, Serialize};
//use chrono::NaiveDate;

use super::dao::application_entity::ApplicationEntity;

#[derive(Debug, Clone, Serialize, Deserialize, Getters, Setters)]
#[getset(get = "pub", set = "pub")]
pub struct Application {
    id: Option<i64>, // None if created manually, Some(id) if retrieved from db
    description: String,
    done: bool,
    due_time: DateTime<Utc>,
    created_by: i64,
}

impl Application {
    pub fn new(description: String, done: bool, due_time: DateTime<Utc>, created_by: i64) -> Application {
        Application {
            id: None,
            description,
            done,
            due_time,
            created_by,
        }
    }
}

impl From<ApplicationEntity> for Application {
    fn from(application_entity: ApplicationEntity) -> Self {
        Application {
            id: Some(application_entity.id),
            description: application_entity.description,
            done: application_entity.done,
            due_time: /*Utc.from_utc_datetime(FixedOffset::east(1 * 3600).from_local_datetime(*/application_entity.due_time/*).unwrap().naive_utc())*/,
            created_by: application_entity.created_by,
        }
    }
}
