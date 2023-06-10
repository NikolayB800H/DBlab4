use getset::{Getters, Setters};
use serde::{Deserialize, Serialize};

use super::dao::worker_entity::WorkerEntity;

#[derive(Debug, Clone, Serialize, Deserialize, Getters, Setters)]
#[getset(get = "pub", set = "pub")]
pub struct Worker {
    id: Option<i64>, // None if created manually, Some(id) if retrieved from db
    name: String,
    registered_as: i64,
}

impl Worker {
    pub fn new(name: String, registered_as: i64) -> Worker {
        Worker {
            id: None,
            name,
            registered_as,
        }
    }
}

impl From<WorkerEntity> for Worker {
    fn from(worker_entity: WorkerEntity) -> Self {
        Worker {
            id: Some(worker_entity.id),
            name: worker_entity.name,
            registered_as: worker_entity.registered_as,
        }
    }
}
