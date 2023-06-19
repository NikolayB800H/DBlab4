use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, diagram_thi_controller},
    model::diagram_thi::diagram_thi_entity::DiagramThiEntity
};

#[tauri::command]
pub async fn get_client_coef_count<'r>(
    search_col: String,
    search_value: String,
    connection: State<'r, DbConnectionPool>
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let count = diagram_thi_controller::get_client_coef_count(
        pool,
        search_col,
        search_value
    ).await.map_err(|e| format!("DB error: {}", e))?;
    Ok(count)
}

#[tauri::command]
pub async fn get_client_coef<'r>(
    search_col: String,
    search_value: String,
    sort_col: String,
    sort_way: String,
    limit: i64,
    offset: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<Vec<DiagramThiEntity>, String> {
    let pool = &*connection.connection.lock().await;
    let applications = diagram_thi_controller::get_client_coef(
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
