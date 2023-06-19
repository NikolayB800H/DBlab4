use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, worker_clients_controller},
    model::worker_clients::worker_clients_entity::WorkerClientsEntity
};

#[tauri::command]
pub async fn worker_get_clients_count<'r>(
    search_col: String,
    search_value: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let count = worker_clients_controller::worker_get_clients_count(
        pool,
        search_col,
        search_value
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(count)
}

#[tauri::command]
pub async fn worker_get_clients<'r>(
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<Vec<WorkerClientsEntity>, String> {
    let pool = &*connection.connection.lock().await;
    let worker_clients = worker_clients_controller::worker_get_clients(
        pool,
        search_col,
        search_value,
        sort_col,
        sort_way,
        limit,
        offset
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(worker_clients)
}
