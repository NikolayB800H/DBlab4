use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct ClientEntity {
    pub id: i64,
    pub name: String,
    pub registered_as: i64,
}
