use getset::{Getters, Setters};
use serde::{Deserialize, Serialize};

use super::dao::client_entity::ClientEntity;

#[derive(Debug, Clone, Serialize, Deserialize, Getters, Setters)]
#[getset(get = "pub", set = "pub")]
pub struct Client {
    id: Option<i64>, // None if created manually, Some(id) if retrieved from db
    name: String,
    registered_as: i64,
}

impl Client {
    pub fn new(name: String, registered_as: i64) -> Client {
        Client {
            id: None,
            name,
            registered_as,
        }
    }
}

impl From<ClientEntity> for Client {
    fn from(client_entity: ClientEntity) -> Self {
        Client {
            id: Some(client_entity.id),
            name: client_entity.name,
            registered_as: client_entity.registered_as,
        }
    }
}
