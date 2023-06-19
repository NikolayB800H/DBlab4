#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod db;
pub mod model;
pub mod services;

use db::connection::establish_connection_pool;
use services::applications_service::applications_service::*;
use services::circle_diagram_service::circle_diagram_service::*;
use services::circle_diagram_sec_service::circle_diagram_sec_service::*;
use services::diagram_thi_service::diagram_thi_service::*;
use services::users_service::users_service::*;
use services::clients_service::clients_service::*;
use services::workers_service::workers_service::*;
use services::workers_servs_service::workers_servs_service::*;
use services::workers_appls_service::workers_appls_service::*;
use services::workers_clients_service::workers_clients_service::*;
use tauri::Manager;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    let connections = establish_connection_pool().await.unwrap();
    tauri::Builder::default()
        .manage(connections) // Makes connection pool available in all #[tauri::command]
        .invoke_handler(tauri::generate_handler![
            change_application,
            //create_application,
            create_user,
            create_client,
            create_worker,
            //get_all_applications,
            get_client_applications_count,
            get_client_applications,
            get_user_client,
            get_user_worker,
            add_application,
            add_client,
            add_worker,
            //set_application_done,
            remove_application,
            //get_all_users,
            add_user,
            //remove_user,
            try_login_user,
            get_client_services_count_count,
            get_client_services_count,
            get_client_app_count_count,
            get_client_app_count,
            get_client_coef_count,
            get_client_coef,
            worker_get_services_count,
            worker_get_services,
            worker_remove_services,
            worker_change_services,
            worker_get_applications_count,
            worker_get_applications,
            worker_remove_applications,
            worker_change_applications,
            worker_get_clients_count,
            worker_get_clients
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
