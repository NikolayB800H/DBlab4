use sqlx::{
    postgres::PgRow, PgPool, FromRow, Row
};
use serde::Serialize;
use crate::model::worker_clients::worker_clients_entity::WorkerClientsEntity;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64 {
    pub value: Option<i64>
}

pub async fn worker_get_clients_count(
    pool: &PgPool,
    search_col: String,
    search_value: String
) -> Result<i64, sqlx::Error> {
    let second_ = format!(r#"WHERE {} {}"#, search_col, search_value);
    let second: &str = &second_[..];
    let query = format!(
        r#"
        SELECT COUNT(*) as value
        FROM clients
        {}
        "#,
        if search_col.len() == 0 { r#""# } else { second }
    );
    let count = sqlx::query_as::<sqlx::Postgres, MyI64>(&query)
    .fetch_one(pool)
    .await?;

    Ok(count.value.unwrap())
}

pub async fn worker_get_clients(
    pool: &PgPool,
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64
) -> Result<Vec<WorkerClientsEntity>, sqlx::Error> {
    let second_ = format!(r#"WHERE {} {}"#, search_col, search_value);
    let third_ = format!(r#"ORDER BY {} {}"#, sort_col, sort_way);
    let second: &str = &second_[..];
    let third: &str = &third_[..];
    let query = format!(
        r#"
            SELECT
            clients.id AS clients_id,
            clients.name AS clients_name,
            clients.registered_as AS clients_registered_as,
            users.id AS users_id,
            users.login AS users_login,
            users.password AS users_password,
            users.is_worker AS users_is_worker
            FROM clients
            INNER JOIN users
            ON clients.registered_as = users.id
        {}
        {}
        LIMIT {}
        OFFSET {}
        "#,
        if search_col.len() == 0 { r#""# } else { second },
        if sort_col.len() == 0 { r#"ORDER BY clients_id"# } else { third },
        limit,
        offset
    );
    let worker_clients_entities = sqlx::query_as::<sqlx::Postgres, WorkerClientsEntity>(&query)
    .fetch_all(pool)
    .await?;
    Ok(worker_clients_entities.into_iter().collect())
}
