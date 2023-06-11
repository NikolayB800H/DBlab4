use chrono::{DateTime, NaiveDateTime, Utc};
use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, applications_controller},
    model::application::application::Application,
};

#[tauri::command]
pub async fn change_application<'r>(
    application_id: i64,
    description: String,
    is_done: String,
    due_time: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let row_affected = applications_controller::change_application(pool, application_id, description, is_done, due_time)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(row_affected)
}

#[tauri::command]
pub fn create_application(
    description: String,
    done: bool,
    due_time: String,
    created_by: i64
) -> Application {
    let due_time = DateTime::from_utc(
        NaiveDateTime::parse_from_str(&due_time, "%d/%m/%Y, %H:%M:%S").unwrap(),
        Utc,
    );
    Application::new(description, done, due_time, created_by)
}

#[tauri::command]
pub async fn get_client_applications_count<'r>(
    created_by: i64,
    search_col: String,
    search_value: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let count = applications_controller::get_client_applications_count(
        pool,
        created_by,
        search_col,
        search_value
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(count)
}

#[tauri::command]
pub async fn get_all_applications<'r>(
    connection: State<'r, DbConnectionPool>,
) -> Result<Vec<Application>, String> {
    let pool = &*connection.connection.lock().await;
    let applications = applications_controller::get_all_applications(pool)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(applications)
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
) -> Result<Vec<Application>, String> {
    let pool = &*connection.connection.lock().await;
    let applications = applications_controller::get_client_applications(pool, client_id, search_col, search_value, sort_col, sort_way, limit, offset)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(applications)
}

#[tauri::command]
pub async fn add_application<'r>(
    application: Application,
    connection: State<'r, DbConnectionPool>,
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let application_id = applications_controller::add_application(pool, application)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(application_id)
}

#[tauri::command]
pub async fn set_application_done<'r>(
    application_id: i64,
    done: bool,
    connection: State<'r, DbConnectionPool>,
) -> Result<u64, String> {
    let pool = &*connection.connection.lock().await;
    let rows_affected = applications_controller::set_application_done(pool, application_id, done)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(rows_affected)
}

#[tauri::command]
pub async fn remove_application<'r>(
    application_id: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<u64, String> {
    let pool = &*connection.connection.lock().await;
    let rows_affected = applications_controller::remove_application(pool, application_id)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(rows_affected)
}
