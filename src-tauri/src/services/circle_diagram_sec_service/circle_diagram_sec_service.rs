use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, circle_diagram_sec_controller},
    model::circle_diagram_sec::circle_diagram_sec_entity::CircleDiagramSecEntity
};

#[tauri::command]
pub async fn get_client_app_count_count<'r>(
    search_col: String,
    search_value: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let count = circle_diagram_sec_controller::get_client_app_count_count(
        pool,
        search_col,
        search_value
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(count)
}

#[tauri::command]
pub async fn get_client_app_count<'r>(
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<Vec<CircleDiagramSecEntity>, String> {
    let pool = &*connection.connection.lock().await;
    let applications = circle_diagram_sec_controller::get_client_app_count(
        pool,
        search_col,
        search_value,
        sort_col,
        sort_way,
        limit,
        offset
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(applications)
}
