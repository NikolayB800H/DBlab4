use sqlx::{
    PgPool, FromRow
};
use serde::Serialize;
use crate::model::diagram_thi::diagram_thi_entity::{DiagramThiEntity, DiagramThi};

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64 {
    pub value: Option<i64>
}

pub async fn get_client_coef_count(
    pool: &PgPool,
    search_col: String,
    search_value: String
) -> Result<i64, sqlx::Error> {
    let second_ = format!(r#"WHERE {} {}"#, search_col, search_value);
    let second: &str = &second_[..];
    let query = format!(
        r#"
        SELECT COUNT(*) as value
        FROM clients AS tmp
        {}
        "#,
        if search_col.len() == 0 { r#""# } else { second }
    );
    let count = sqlx::query_as::<sqlx::Postgres, MyI64>(&query)
    .fetch_one(pool)
    .await?;

    Ok(count.value.unwrap())
}

pub async fn get_client_coef(
    pool: &PgPool,
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64
) -> Result<Vec<DiagramThiEntity>, sqlx::Error> {
    let second_ = format!(r#"WHERE {} {}"#, search_col, search_value);
    let third_ = format!(r#"ORDER BY {} {}"#, sort_col, sort_way);
    let second: &str = &second_[..];
    let third: &str = &third_[..];
    let query = format!(
        r#"
        SELECT dividend.clients_id, clients_name, CASE WHEN applications_count = 0 THEN (0)::double precision ELSE (applications_count::double precision / services_count::double precision) END AS clients_coef
        FROM (
            (
                SELECT clients_id, clients_name, COUNT(DISTINCT applications_id) AS applications_count
                FROM (
                    SELECT clients.id AS clients_id,
                        clients.name AS clients_name,
                        applications.id AS applications_id,
                        applications.service_id AS applications_service_id
                    FROM clients
                    LEFT JOIN applications
                    ON clients.id = applications.client_id
                ) _dividend
                GROUP BY _dividend.clients_id, _dividend.clients_name
            ) dividend
            LEFT JOIN (
                SELECT clients_id, COUNT(DISTINCT services_id) AS services_count
                FROM (
                    SELECT clients_id, applications_id, services.id AS services_id
                    FROM services
                    LEFT JOIN (
                        SELECT clients.id AS clients_id,
                            applications.id AS applications_id,
                            applications.service_id AS applications_service_id
                        FROM clients
                        LEFT JOIN applications
                        ON clients.id = applications.client_id
                    ) joined
                    ON services.id = joined.applications_service_id
                ) _devider
                GROUP BY clients_id
            ) devider
            ON dividend.clients_id = devider.clients_id
        )
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
    let circle_diagram_entities = sqlx::query_as::<sqlx::Postgres, DiagramThi>(&query)
    .fetch_all(pool)
    .await?;
    Ok(circle_diagram_entities.into_iter().map(DiagramThiEntity::from).collect())
}
