use serde::Serialize;
use sqlx::FromRow;

/* clients_id, clients_name, applications_count */
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct CircleDiagramSecEntity {
    pub clients_id: i64,
    pub clients_name: String,
    pub applications_count: i64
}
