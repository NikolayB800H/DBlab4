use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, worker_servs_controller},
    model::worker_servs::worker_servs_entity::WorkerServsEntity
};

#[tauri::command]
pub async fn worker_change_services<'r>(
    services_id: i64,
    services_name: String,
    services_status: String,
    services_update_time: String,
    services_content: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let row_affected = worker_servs_controller::worker_change_services(
        pool,
        services_id,
        services_name,
        services_status,
        services_update_time,
        services_content
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(row_affected)
}

#[tauri::command]
pub async fn worker_get_services_count<'r>(
    search_col: String,
    search_value: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let count = worker_servs_controller::worker_get_services_count(
        pool,
        search_col,
        search_value
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(count)
}

#[tauri::command]
pub async fn worker_get_services<'r>(
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<Vec<WorkerServsEntity>, String> {
    let pool = &*connection.connection.lock().await;
    let worker_servs = worker_servs_controller::worker_get_services(
        pool,
        search_col,
        search_value,
        sort_col,
        sort_way,
        limit,
        offset
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(worker_servs)
}

#[tauri::command]
pub async fn worker_remove_services<'r>(
    service_id: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let rows_affected = worker_servs_controller::worker_remove_services(
        pool,
        service_id
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(rows_affected)
}
