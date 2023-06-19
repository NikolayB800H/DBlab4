use sqlx::{
    postgres::PgRow, PgPool, FromRow, Row
};
use serde::Serialize;
use crate::model::worker_servs::worker_servs_entity::WorkerServsEntity;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64 {
    pub value: Option<i64>
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64cringe {
    pub id: Option<i64>
}

pub async fn worker_change_services(
    pool: &PgPool,
    services_id: i64,
    services_name: String,
    services_status: String,
    services_update_time: String,
    services_content: String,
) -> Result<i64, sqlx::Error> {
    let query = format!(
        r#"
        UPDATE services
        SET name = {}, status = {}, update_time = current_timestamp, content = {}
        WHERE services.id = {}
        RETURNING services.id
        "#,
        services_name,
        services_status,
        //services_update_time,
        services_content,
        services_id
    );
    let ret = sqlx::query_as::<sqlx::Postgres, MyI64cringe>(&query)
    .fetch_one(pool)
    .await?;

    Ok(ret.id.unwrap())
}

pub async fn worker_get_services_count(
    pool: &PgPool,
    search_col: String,
    search_value: String
) -> Result<i64, sqlx::Error> {
    let second_ = format!(r#"WHERE {} {}"#, search_col, search_value);
    let second: &str = &second_[..];
    let query = format!(
        r#"
        SELECT COUNT(*) as value
        FROM services
        {}
        "#,
        if search_col.len() == 0 { r#""# } else { second }
    );
    let count = sqlx::query_as::<sqlx::Postgres, MyI64>(&query)
    .fetch_one(pool)
    .await?;

    Ok(count.value.unwrap())
}

pub fn map_worker_servs_entity(row: PgRow) -> Result<WorkerServsEntity, sqlx::Error> {
    Ok(WorkerServsEntity {
        clients_id: row.try_get("clients_id")?,
        clients_name: row.try_get("clients_name")?,
        clients_registered_as: row.try_get("clients_registered_as")?,
        services_id: row.try_get("services_id")?,
        services_name: row.try_get_unchecked("services_name")?,
        services_status: row.try_get_unchecked("services_status")?,
        services_update_time: row.try_get("services_update_time")?,
        services_content: row.try_get("services_content")?,
    })
}

pub async fn worker_get_services(
    pool: &PgPool,
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64
) -> Result<Vec<WorkerServsEntity>, sqlx::Error> {
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
            services.id AS services_id,
            services.name AS services_name,
            services.status AS services_status,
            services.update_time AS services_update_time,
            services.content AS services_content
            FROM clients
            LEFT JOIN (
                SELECT
                services.id,
                services.name,
                services.status,
                services.update_time,
                services.content,
                applications.client_id
                FROM services
                LEFT JOIN applications
                ON services.id = applications.service_id
            ) services
            ON clients.id = services.client_id
            GROUP BY clients_id, services_id, services_name, services_status, services_update_time, services_content
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
    let worker_servs_entities = sqlx::query(&query)
    .try_map(map_worker_servs_entity)
    .fetch_all(pool)
    .await?;
    Ok(worker_servs_entities.into_iter().collect())
}

pub async fn worker_remove_services(
    pool: &PgPool,
    service_id: i64
) -> Result<i64, sqlx::Error> {
    let query = format!(
        r#"
        WITH no_use AS (
            DELETE FROM applications
            WHERE service_id = {}
        )
        DELETE FROM services
        WHERE id = {}
        RETURNING id
        "#,
        service_id, service_id
    );
    let row_affected = sqlx::query_as::<sqlx::Postgres, MyI64cringe>(&query)
    .fetch_one(pool)
    .await?;

    Ok(row_affected.id.unwrap())
}
