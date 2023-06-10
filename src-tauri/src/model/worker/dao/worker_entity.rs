use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct WorkerEntity {
    pub id: i64,
    pub name: String,
    pub registered_as: i64,
}
