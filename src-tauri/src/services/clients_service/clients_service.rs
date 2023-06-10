use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, clients_controller},
    model::client::client::Client,
};

#[tauri::command]
pub fn create_client(name: String, registered_as: i64) -> Client {
    Client::new(name, registered_as)
}

#[tauri::command]
pub async fn get_user_client<'r>(
    user_id: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<Option<Client>, String> {
    let pool = &*connection.connection.lock().await;
    let client = clients_controller::get_user_client(pool, user_id)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(client)
}

#[tauri::command]
pub async fn add_client<'r>(
    client: Client,
    connection: State<'r, DbConnectionPool>,
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let client_id = clients_controller::add_client(pool, client)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(client_id)
}
