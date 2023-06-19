use sqlx::{
    postgres::PgRow, PgPool, FromRow, Row
};
use serde::Serialize;
use crate::model::application::application_entity::ApplicationEntity;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64 {
    pub value: Option<i64>
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64cringe {
    pub id: Option<i64>
}

pub async fn change_application(
    pool: &PgPool,
    application_id: i64,
    services_name: String,
    services_content: String,
    applications_status: String,
    applications_update_time: String
) -> Result<i64, sqlx::Error> {
    let query = format!(
        r#"
        WITH ids AS (
            UPDATE applications
            SET status = {}, update_time = current_timestamp
            WHERE applications.id = {}
            RETURNING applications.id
        )
        UPDATE services
        SET name = {}, content = {}
        WHERE services.id = (
            SELECT services.id
            FROM services
            LEFT JOIN applications
            ON services.id = applications.service_id
            WHERE applications.id = {}
        )
        RETURNING services.id
        "#,
        applications_status,
        //applications_update_time,
        application_id,
        services_name,
        services_content,
        application_id
    );
    let count = sqlx::query_as::<sqlx::Postgres, MyI64cringe>(&query)
    .fetch_one(pool)
    .await?;

    Ok(count.id.unwrap())
}

pub async fn get_client_applications_count(
    pool: &PgPool,
    created_by: i64,
    search_col: String,
    search_value: String
) -> Result<i64, sqlx::Error> {
    let second_ = format!(r#"AND {} {}"#, search_col, search_value);
    let second: &str = &second_[..];
    let query = format!(
        r#"
        SELECT COUNT(*) as value
        FROM services
        LEFT JOIN applications
        ON services.id = applications.service_id
        WHERE applications.client_id = {}
        {}
        "#,
        created_by,
        if search_col.len() == 0 { r#""# } else { second }
    );
    let count = sqlx::query_as::<sqlx::Postgres, MyI64>(&query)
    .fetch_one(pool)
    .await?;

    Ok(count.value.unwrap())
}

pub fn map_application_entity(row: PgRow) -> Result<ApplicationEntity, sqlx::Error> {
    Ok(ApplicationEntity {
        services_id: row.try_get("services_id")?,
        services_name: row.try_get_unchecked("services_name")?,
        services_status: row.try_get_unchecked("services_status")?,
        services_update_time: row.try_get("services_update_time")?,
        services_content: row.try_get("services_content")?,
        applications_id: row.try_get("applications_id")?,
        applications_status: row.try_get_unchecked("applications_status")?,
        applications_update_time: row.try_get("applications_update_time")?,
        applications_client_id: row.try_get("applications_client_id")?,
        applications_service_id: row.try_get("applications_service_id")?
    })
}

pub async fn get_client_applications(
    pool: &PgPool,
    client_id: i64,
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64
) -> Result<Vec<ApplicationEntity>, sqlx::Error> {
    let second_ = format!(r#"AND {} {}"#, search_col, search_value);
    let third_ = format!(r#"ORDER BY {} {}"#, sort_col, sort_way);
    let second: &str = &second_[..];
    let third: &str = &third_[..];
    let query = format!(
        r#"
        SELECT
        services.id AS services_id,
        services.name AS services_name,
        services.status AS services_status,
        services.update_time AS services_update_time,
        services.content AS services_content,
        applications.id AS applications_id,
        applications.status AS applications_status,
        applications.update_time AS applications_update_time,
        applications.client_id AS applications_client_id,
        applications.service_id AS applications_service_id
        FROM services
        LEFT JOIN applications
        ON services.id = applications.service_id
        WHERE applications.client_id = {}
        {}
        {}
        LIMIT {}
        OFFSET {}
        "#,
        client_id,
        if search_col.len() == 0 { r#""# } else { second },
        if sort_col.len() == 0 { r#"ORDER BY services_id"# } else { third },
        limit,
        offset
    );
    let application_entities = sqlx::query(&query)
    .try_map(map_application_entity)
    .fetch_all(pool)
    .await?;
    Ok(application_entities.into_iter().collect())
}

pub async fn add_application(
    pool: &PgPool,
    services_name: String,
    services_content: String,
    applications_status: String,
    applications_update_time: String,
    applications_client_id: i64
) -> Result<i64, sqlx::Error> {
    let query = format!(
        r#"
        WITH ids AS (
            INSERT INTO services (name, status, update_time, content)
            VALUES ( {}, 'Неначата', current_timestamp, {} )
            RETURNING id
        )
        INSERT INTO applications (status, update_time, client_id, service_id)
        VALUES ( 'Обрабатывается', current_timestamp, {}, (SELECT id FROM ids) )
        RETURNING id
        "#,
        services_name,
        services_content,
        //applications_status,
        //applications_update_time,
        applications_client_id
    );
    let count = sqlx::query_as::<sqlx::Postgres, MyI64cringe>(&query)
    .fetch_one(pool)
    .await?;

    Ok(count.id.unwrap())
}

pub async fn remove_application(pool: &PgPool, application_id: i64) -> Result<i64, sqlx::Error> {
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
