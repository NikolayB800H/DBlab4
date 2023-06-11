#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod db;
pub mod model;
pub mod services;

use db::connection::establish_connection_pool;
use services::applications_service::applications_service::*;
use services::users_service::users_service::*;
use services::clients_service::clients_service::*;
use services::workers_service::workers_service::*;
use tauri::Manager;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    let connections = establish_connection_pool().await.unwrap();
    tauri::Builder::default()
        .manage(connections) // Makes connection pool available in all #[tauri::command]
        .invoke_handler(tauri::generate_handler![
            change_application,
            create_application,
            create_user,
            create_client,
            create_worker,
            get_all_applications,
            get_client_applications_count,
            get_client_applications,
            get_user_client,
            get_user_worker,
            add_application,
            add_client,
            add_worker,
            set_application_done,
            remove_application,
            //get_all_users,
            add_user,
            //remove_user,
            try_login_user
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
