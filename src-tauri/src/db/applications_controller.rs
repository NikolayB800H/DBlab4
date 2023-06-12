use sqlx::PgPool;
use sqlx::FromRow;
use serde::Serialize;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64 {
    pub value: Option<i64>
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct MyI64cringe {
    pub id: Option<i64>
}

#[derive(Debug, Clone, Serialize, sqlx::FromRow, sqlx::Type)]
pub struct MyU64 {
    pub value: Option<i64>
}

use crate::model::application::{dao::application_entity::ApplicationEntity, application::Application};

pub async fn change_application(
    pool: &PgPool,
    application_id: i64,
    description: String,
    done: String,
    due_time: String
) -> Result<i64, sqlx::Error> {
    let query = format!(
        r#"
        UPDATE applications
        SET description = {}, done = {}, due_time = {}
        WHERE id = {}
        RETURNING id
        "#,
        description,
        done,
        due_time,
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
        FROM applications
        WHERE created_by = {}
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

pub async fn get_all_applications(pool: &PgPool) -> Result<Vec<Application>, sqlx::Error> {
    let application_entities = sqlx::query_as!(
        ApplicationEntity,
        r#"
        SELECT *
        FROM applications
        ORDER BY id
        "#
    )
    .fetch_all(pool)
    .await?;

    Ok(application_entities.into_iter().map(Application::from).collect())
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
) -> Result<Vec<Application>, sqlx::Error> {
    let second_ = format!(r#"AND {} {}"#, search_col, search_value);
    let third_ = format!(r#"ORDER BY {} {}"#, sort_col, sort_way);
    let second: &str = &second_[..];
    let third: &str = &third_[..];
    let query = format!(
        r#"
        SELECT *
        FROM applications
        WHERE created_by = {}
        {}
        {}
        LIMIT {}
        OFFSET {}
        "#,
        client_id,
        if search_col.len() == 0 { r#""# } else { second },
        if sort_col.len() == 0 { r#""# } else { third },
        limit,
        offset
    );
    let application_entities = sqlx::query_as::<sqlx::Postgres, ApplicationEntity>(&query)
    .fetch_all(pool)
    .await?;
    Ok(application_entities.into_iter().map(Application::from).collect())
}

/*pub async fn add_application(pool: &PgPool, application: Application) -> Result<i64, sqlx::Error> {
    let rec = sqlx::query!(
        r#"
        INSERT INTO applications (description, done, due_time, created_by)
        VALUES ( $1, $2, $3, $4 )
        RETURNING id
        "#,
        application.description(),
        application.done(),
        /*NaiveDate(*/application.due_time()/*)*/,
        application.created_by()
    )
    .fetch_one(pool)
    .await?;

    Ok(rec.id)
}*/

pub async fn add_application(pool: &PgPool,
    description: String,
    done: String,
    due_time: String,
    created_by: i64
) -> Result<i64, sqlx::Error> {
    let query = format!(
        r#"
        INSERT INTO applications (description, done, due_time, created_by)
        VALUES ( {}, {}, {}, {} )
        RETURNING id
        "#,
        description,
        done,
        due_time,
        created_by
    );
    let count = sqlx::query_as::<sqlx::Postgres, MyI64cringe>(&query)
    .fetch_one(pool)
    .await?;

    Ok(count.id.unwrap())
}

pub async fn set_application_done(pool: &PgPool, application_id: i64, done: bool) -> Result<u64, sqlx::Error> {
    let rows_affected = sqlx::query!(
        r#"
        UPDATE applications
        SET done = $1
        WHERE id = $2
        "#,
        done,
        application_id
    )
    .execute(pool)
    .await?
    .rows_affected();

    Ok(rows_affected)
}

pub async fn remove_application(pool: &PgPool, application_id: i64) -> Result<u64, sqlx::Error> {
    let rows_affected = sqlx::query!(
        r#"
        DELETE FROM applications
        WHERE id = $1
        "#,
        application_id
    )
    .execute(pool)
    .await?
    .rows_affected();

    Ok(rows_affected)
}
