use serde::{Serialize, Deserialize};
use sqlx::FromRow;
use getset::{Getters, Setters};

/* clients_id, clients_name, clients_coef */
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct DiagramThiEntity {
    pub clients_id: i64,
    pub clients_name: String,
    pub clients_coef: f64
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, Getters, Setters)]
#[getset(get = "pub", set = "pub")]
pub struct DiagramThi {
    clients_id: i64,
    clients_name: String,
    clients_coef: Option<f64>
}

impl From<DiagramThi> for DiagramThiEntity {
    fn from(diagram_thi: DiagramThi) -> Self {
        DiagramThiEntity {
            clients_id: diagram_thi.clients_id,
            clients_name: diagram_thi.clients_name,
            clients_coef: ( if diagram_thi.clients_coef.is_some() { diagram_thi.clients_coef.unwrap() } else { 0.0 }),
        }
    }
}