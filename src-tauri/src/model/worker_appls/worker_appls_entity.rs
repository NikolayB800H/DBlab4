use chrono::prelude::*;
use serde::Serialize;
use sqlx::FromRow;
use crate::model::enums::enums::*;

/* applications                                   */
/* id, status, update_time, client_id, service_id */
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct WorkerApplsEntity {
    pub applications_id: i64,
    pub applications_status: ApplicationStatus,
    pub applications_update_time: DateTime<Utc>,
    pub applications_client_id: i64,
    pub applications_service_id: i64
}
