use serde::Serialize;
use sqlx::FromRow;

/* clients_id, clients_name, services_count */
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct CircleDiagramEntity {
    pub clients_id: i64,
    pub clients_name: String,
    pub services_count: i64
}
