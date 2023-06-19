use sqlx::{
    postgres::PgRow, PgPool, FromRow, Row
};
use serde::Serialize;
use crate::model::worker_appls::worker_appls_entity::WorkerApplsEntity;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64 {
    pub value: Option<i64>
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64cringe {
    pub id: Option<i64>
}

pub async fn worker_change_applications(
    pool: &PgPool,
    applications_id: i64,
    applications_status: String,
    applications_update_time: String
) -> Result<i64, sqlx::Error> {
    let query = format!(
        r#"
        UPDATE applications
        SET status = {}, update_time = current_timestamp
        WHERE applications.id = {}
        RETURNING applications.id
        "#,
        applications_status,
        //applications_update_time,
        applications_id
    );
    let ret = sqlx::query_as::<sqlx::Postgres, MyI64cringe>(&query)
    .fetch_one(pool)
    .await?;

    Ok(ret.id.unwrap())
}

pub async fn worker_get_applications_count(
    pool: &PgPool,
    search_col: String,
    search_value: String,
    services_id: i64,
) -> Result<i64, sqlx::Error> {
    let second_ = format!(r#"AND {} {}"#, search_col, search_value);
    let second: &str = &second_[..];
    let query = format!(
        r#"
        SELECT COUNT(*) as value
        FROM applications
        WHERE service_id = {}
        {}
        "#,
        services_id,
        if search_col.len() == 0 { r#""# } else { second }
    );
    let count = sqlx::query_as::<sqlx::Postgres, MyI64>(&query)
    .fetch_one(pool)
    .await?;

    Ok(count.value.unwrap())
}

pub fn map_worker_appls_entity(row: PgRow) -> Result<WorkerApplsEntity, sqlx::Error> {
    Ok(WorkerApplsEntity {
        applications_id: row.try_get("applications_id")?,
        applications_status: row.try_get_unchecked("applications_status")?,
        applications_update_time: row.try_get("applications_update_time")?,
        applications_client_id: row.try_get("applications_client_id")?,
        applications_service_id: row.try_get("applications_service_id")?
    })
}

pub async fn worker_get_applications(
    pool: &PgPool,
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64,
    services_id: i64
) -> Result<Vec<WorkerApplsEntity>, sqlx::Error> {
    let second_ = format!(r#"AND {} {}"#, search_col, search_value);
    let third_ = format!(r#"ORDER BY {} {}"#, sort_col, sort_way);
    let second: &str = &second_[..];
    let third: &str = &third_[..];
    let query = format!(
        r#"
        SELECT
            applications.id AS applications_id,
            applications.status AS applications_status,
            applications.update_time AS applications_update_time,
            applications.client_id AS applications_client_id,
            applications.service_id AS applications_service_id
        FROM applications
        WHERE applications.service_id = {}
        {}
        {}
        LIMIT {}
        OFFSET {}
        "#,
        services_id,
        if search_col.len() == 0 { r#""# } else { second },
        if sort_col.len() == 0 { r#"ORDER BY applications_id"# } else { third },
        limit,
        offset
    );
    let worker_appls_entities = sqlx::query(&query)
    .try_map(map_worker_appls_entity)
    .fetch_all(pool)
    .await?;
    Ok(worker_appls_entities.into_iter().collect())
}

pub async fn worker_remove_applications(
    pool: &PgPool,
    application_id: i64
) -> Result<i64, sqlx::Error> {
    let query = format!(
        r#"
        WITH comp AS (
            SELECT services.id AS services_id, applications.id AS applications_id
            FROM services
            LEFT JOIN applications
            ON services.id = applications.service_id
            WHERE services.id = (
                SELECT services.id AS services_id
                FROM services
                LEFT JOIN applications
                ON services.id = applications.service_id
                WHERE applications.id = {}
            )
        ), ids AS (
            DELETE FROM applications
            WHERE id = {}
            RETURNING id
        ), target AS (
            DELETE FROM services
            WHERE id = (
                SELECT services_id
                FROM comp
                WHERE applications_id = {}
                AND 1 = (SELECT COUNT(*) FROM comp)
            )
            RETURNING id
        ) (SELECT id FROM ids);
        "#,
        application_id, application_id, application_id
    );
    let row_affected = sqlx::query_as::<sqlx::Postgres, MyI64cringe>(&query)
    .fetch_one(pool)
    .await?;

    Ok(row_affected.id.unwrap())
}
