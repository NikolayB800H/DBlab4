use sqlx::PgPool;

use crate::model::client::{dao::client_entity::ClientEntity, client::Client};

pub async fn get_user_client(pool: &PgPool, user_id: i64) -> Result<Option<Client>, sqlx::Error> {
    let client_entity = sqlx::query_as!(
        ClientEntity,
        r#"
        SELECT DISTINCT *
        FROM clients
        WHERE registered_as = $1
        "#,
        user_id
    )
    .fetch_optional(pool)
    .await?;

    Ok(client_entity.map(Client::from))
}

pub async fn add_client(pool: &PgPool, client: Client) -> Result<i64, sqlx::Error> {
    let rec = sqlx::query!(
        r#"
        INSERT INTO clients (name, registered_as)
        VALUES ( $1, $2 )
        RETURNING id
        "#,
        client.name(),
        client.registered_as()
    )
    .fetch_one(pool)
    .await?;

    Ok(rec.id)
}
