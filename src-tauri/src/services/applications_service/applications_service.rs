//use chrono::{DateTime, NaiveDateTime, Utc};
use tauri::State;

use crate::{
    db::{connection::DbConnectionPool, applications_controller},
    //model::application::application::Application,
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
/*
#[tauri::command]
pub fn create_application(
    status: String,
    update_time: String,
    client_id: i64,
    service_id: i64
) -> Application {
    let update_time = DateTime::from_utc(
        NaiveDateTime::parse_from_str(&update_time, "%d/%m/%Y, %H:%M:%S").unwrap(),
        Utc,
    );
    Application::new(status, update_time, client_id, service_id)
}
*/
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
/*
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
*/

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
//) -> Result<Vec<Application>, String> {
) -> Result<Vec<ApplicationEntity>, String> {
    let pool = &*connection.connection.lock().await;
    let applications = applications_controller::get_client_applications(pool, client_id, search_col, search_value, sort_col, sort_way, limit, offset)
        .await
        .map_err(|e| format!("DB error: {}", e/*&(e.to_string())[e.to_string().len()-100..]*/))?;
    /*let str = match applications {
        String{e} => format!("Ошибка: {}.", e),
        _ => "Not Ошибка.".to_string(),
    };
    println!("{}", str);*/
    /*let tmp = match applications {
        Err(e) => {
            println!("Error: {}", e);
        }
        _ => println!("No error"),
    };*/
    Ok(applications)
}

#[tauri::command]
pub async fn add_application<'r>( // servicesName, servicesContent, applicationsStatus, applicationsUpdateTime
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
/*
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
*/
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
