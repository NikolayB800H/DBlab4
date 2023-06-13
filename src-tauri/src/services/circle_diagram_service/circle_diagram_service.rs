use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, circle_diagram_controller},
    model::circle_diagram::circle_diagram_entity::CircleDiagramEntity
};

#[tauri::command]
pub async fn get_client_services_count_count<'r>(
    search_col: String,
    search_value: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let count = circle_diagram_controller::get_client_services_count_count(
        pool,
        search_col,
        search_value
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(count)
}

#[tauri::command]
pub async fn get_client_services_count<'r>(
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<Vec<CircleDiagramEntity>, String> {
    let pool = &*connection.connection.lock().await;
    let applications = circle_diagram_controller::get_client_services_count(pool, search_col, search_value, sort_col, sort_way, limit, offset)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(applications)
}
