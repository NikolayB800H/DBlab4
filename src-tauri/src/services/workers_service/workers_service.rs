use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, workers_controller},
    model::worker::worker::Worker,
};

#[tauri::command]
pub fn create_worker(name: String, registered_as: i64) -> Worker {
    Worker::new(name, registered_as)
}

#[tauri::command]
pub async fn get_user_worker<'r>(
    user_id: i64,
    connection: State<'r, DbConnectionPool>,
) -> Result<Option<Worker>, String> {
    let pool = &*connection.connection.lock().await;
    let worker = workers_controller::get_user_worker(pool, user_id)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(worker)
}

#[tauri::command]
pub async fn add_worker<'r>(
    worker: Worker,
    connection: State<'r, DbConnectionPool>,
) -> Result<i64, String> {
    let pool = &*connection.connection.lock().await;
    let worker_id = workers_controller::add_worker(pool, worker)
        .await
        .map_err(|e| format!("DB error: {}", e))?;
    Ok(worker_id)
}
