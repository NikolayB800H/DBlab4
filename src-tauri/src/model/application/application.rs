use chrono::prelude::*;
use getset::{Getters, Setters};
use serde::{Deserialize, Serialize};

use super::dao::application_entity::ApplicationEntity;

#[derive(Debug, Clone, Serialize, Deserialize, Getters, Setters)]
#[getset(get = "pub", set = "pub")] // services                               | applications                                   //
pub struct Application {            // id, name, status, update_time, content | id, status, update_time, client_id, service_id //
    id: Option<i64>, // None if created manually, Some(id) if retrieved from db
    status: String,
    update_time: DateTime<Utc>,
    client_id: i64,
    service_id: i64
}

impl Application {
    pub fn new(status: String, update_time: DateTime<Utc>, client_id: i64, service_id: i64) -> Application {
        Application {
            id: None,
            status,
            update_time,
            client_id,
            service_id
        }
    }
}
/*
impl From<ApplicationEntity> for Application {
    fn from(application_entity: ApplicationEntity) -> Self {
        Application {
            id: Some(application_entity.id),
            status: application_entity.status,
            update_time: application_entity.update_time,
            client_id: application_entity.client_id,
            service_id: application_entity.service_id,
        }
    }
}
*/