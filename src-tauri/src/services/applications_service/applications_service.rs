use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, applications_controller},
    model::application::dao::application_entity::ApplicationEntity
};

#[tauri::command]
pub async fn change_application<'r>(
    application_id: i64,
    services_name: String,
    services_content: String,
    applications_status: String,
    applications_update_time: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let row_affected = applications_controller::change_application(pool, application_id, services_name, services_content, applications_status, applications_update_time)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(row_affected)
}

#[tauri::command]
pub async fn get_client_applications_count<'r>(
    client_id: i64,
    search_col: String,
    search_value: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let count = applications_controller::get_client_applications_count(
        pool,
        client_id,
        search_col,
        search_value
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(count)
}

#[tauri::command]
pub async fn get_client_applications<'r>(
    client_id: i64,
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<Vec<ApplicationEntity>, String> {
    let pool = &*connection.connection.lock().await;
    let applications = applications_controller::get_client_applications(pool, client_id, search_col, search_value, sort_col, sort_way, limit, offset)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(applications)
}

#[tauri::command]
pub async fn add_application<'r>(
    services_name: String,
    services_content: String,
    applications_status: String,
    applications_update_time: String,
    applications_client_id: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let application_id = applications_controller::add_application(pool, services_name, services_content, applications_status, applications_update_time, applications_client_id)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(application_id)
}

#[tauri::command]
pub async fn remove_application<'r>(
    application_id: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let rows_affected = applications_controller::remove_application(pool, application_id)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(rows_affected)
}
