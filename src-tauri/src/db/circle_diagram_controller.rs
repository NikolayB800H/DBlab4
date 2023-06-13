use sqlx::{
    PgPool, FromRow
};
use serde::Serialize;
use crate::model::circle_diagram::circle_diagram_entity::CircleDiagramEntity;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64 {
    pub value: Option<i64>
}

pub async fn get_client_services_count_count(
    pool: &PgPool,
    search_col: String,
    search_value: String
) -> Result<i64, sqlx::Error> {
    let second_ = format!(r#"WHERE {} {}"#, search_col, search_value);
    let second: &str = &second_[..];
    let query = format!(
        r#"
        SELECT COUNT(*) as value
        FROM (
            SELECT stats.clients_id, stats.clients_name, COUNT(DISTINCT stats.services_id) AS services_count
            FROM (
                SELECT clients_id, clients_name, applications_id, services.id AS services_id
                FROM services
                LEFT JOIN (
                    SELECT clients.id AS clients_id,
                        clients.name AS clients_name,
                        applications.id AS applications_id,
                        applications.service_id AS applications_service_id
                    FROM clients
                    LEFT JOIN applications
                    ON clients.id = applications.client_id
                ) AS joined
                ON services.id = joined.applications_service_id
            ) AS stats
            GROUP BY stats.clients_id, stats.clients_name
        ) AS tmp
        {}
        "#,
        if search_col.len() == 0 { r#""# } else { second }
    );
    let count = sqlx::query_as::<sqlx::Postgres, MyI64>(&query)
    .fetch_one(pool)
    .await?;

    Ok(count.value.unwrap())
}

/*pub fn map_circle_diagram_entity(row: PgRow) -> Result<ApplicationEntity, sqlx::Error> {
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
}*/

pub async fn get_client_services_count(
    pool: &PgPool,
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64
) -> Result<Vec<CircleDiagramEntity>, sqlx::Error> {
    let second_ = format!(r#"WHERE {} {}"#, search_col, search_value);
    let third_ = format!(r#"ORDER BY {} {}"#, sort_col, sort_way);
    let second: &str = &second_[..];
    let third: &str = &third_[..];
    let query = format!(
        r#"
        SELECT * FROM (
            SELECT stats.clients_id, stats.clients_name, COUNT(DISTINCT stats.services_id) AS services_count
            FROM (
                SELECT clients_id, clients_name, applications_id, services.id AS services_id
                FROM services
                LEFT JOIN (
                    SELECT clients.id AS clients_id,
                        clients.name AS clients_name,
                        applications.id AS applications_id,
                        applications.service_id AS applications_service_id
                    FROM clients
                    LEFT JOIN applications
                    ON clients.id = applications.client_id
                ) AS joined
                ON services.id = joined.applications_service_id
            ) AS stats
            GROUP BY stats.clients_id, stats.clients_name
        ) AS tmp
        {}
        {}
        LIMIT {}
        OFFSET {}
        "#,
        if search_col.len() == 0 { r#""# } else { second },
        if sort_col.len() == 0 { r#""# } else { third },
        limit,
        offset
    );
    //let circle_diagram_entities = sqlx::query(&query)
    let circle_diagram_entities = sqlx::query_as::<sqlx::Postgres, CircleDiagramEntity>(&query)
    //.try_map(map_circle_diagram_entity)
    .fetch_all(pool)
    .await?;
    Ok(circle_diagram_entities.into_iter().collect())
}
