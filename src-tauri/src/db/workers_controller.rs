use sqlx::PgPool;

use crate::model::worker::{dao::worker_entity::WorkerEntity, worker::Worker};

pub async fn get_user_worker(pool: &PgPool, user_id: i64) -> Result<Option<Worker>, sqlx::Error> {
    let worker_entity = sqlx::query_as!(
        WorkerEntity,
        r#"
        SELECT DISTINCT *
        FROM workers
        WHERE registered_as = $1
        "#,
        user_id
    )
    .fetch_optional(pool)
    .await?;

    Ok(worker_entity.map(Worker::from))
}

pub async fn add_worker(pool: &PgPool, worker: Worker) -> Result<i64, sqlx::Error> {
    let rec = sqlx::query!(
        r#"
        INSERT INTO workers (name, registered_as)
        VALUES ( $1, $2 )
        RETURNING id
        "#,
        worker.name(),
        worker.registered_as()
    )
    .fetch_one(pool)
    .await?;

    Ok(rec.id)
}
