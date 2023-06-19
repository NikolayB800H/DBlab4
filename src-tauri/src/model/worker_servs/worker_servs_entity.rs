use chrono::prelude::*;
use serde::Serialize;
use sqlx::FromRow;
use crate::model::enums::enums::*;

/* clients                 | services                               */
/* id, name, registered_as | id, name, status, update_time, content */
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct WorkerServsEntity {
    pub clients_id: i64,
    pub clients_name: String,
    pub clients_registered_as: i64,
    pub services_id: i64,
    pub services_name: ServiceName,
    pub services_status: ServiceStatus,
    pub services_update_time: DateTime<Utc>,
    pub services_content: String,
}
