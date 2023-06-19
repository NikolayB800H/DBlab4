use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, worker_appls_controller},
    model::worker_appls::worker_appls_entity::WorkerApplsEntity
};

#[tauri::command]
pub async fn worker_change_applications<'r>(
    applications_id: i64,
    applications_status: String,
    applications_update_time: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let row_affected = worker_appls_controller::worker_change_applications(
        pool,
        applications_id,
        applications_status,
        applications_update_time
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(row_affected)
}

#[tauri::command]
pub async fn worker_get_applications_count<'r>(
    search_col: String,
    search_value: String,
    services_id: i64,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let count = worker_appls_controller::worker_get_applications_count(
        pool,
        search_col,
        search_value,
        services_id
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(count)
}

#[tauri::command]
pub async fn worker_get_applications<'r>(
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64,
    services_id: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<Vec<WorkerApplsEntity>, String> {
    let pool = &*connection.connection.lock().await;
    let worker_appls = worker_appls_controller::worker_get_applications(
        pool,
        search_col,
        search_value,
        sort_col,
        sort_way,
        limit,
        offset,
        services_id
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(worker_appls)
}

#[tauri::command]
pub async fn worker_remove_applications<'r>(
    applications_id: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let rows_affected = worker_appls_controller::worker_remove_applications(
        pool,
        applications_id
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(rows_affected)
}
