use chrono::prelude::*;
use serde::Serialize;
use sqlx::FromRow;

#[derive(sqlx::Type)]
#[sqlx(type_name = "applicationStatus")]
#[derive(Debug, Clone, Serialize)]
pub enum ApplicationStatus {
    Принято, Отклонено, Закрыто, Обрабатывается
}

#[derive(sqlx::Type)]
#[sqlx(type_name = "applicationStatus")]
#[derive(Debug, Clone, Serialize)]
pub enum ServiceName {
    Анализы, Больничный, Справка, Обследование
}

#[derive(sqlx::Type)]
#[sqlx(type_name = "applicationStatus")]
#[derive(Debug, Clone, Serialize)]
pub enum ServiceStatus {
    Выполнена, Провалена, Неначата
}

/* services                               | applications                                   */
/* id, name, status, update_time, content | id, status, update_time, client_id, service_id */
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct ApplicationEntity {
    pub services_id: i64,
    pub services_name: ServiceName,
    pub services_status: ServiceStatus,
    pub services_update_time: DateTime<Utc>,
    pub services_content: String,
    pub applications_id: i64,
    pub applications_status: ApplicationStatus,
    pub applications_update_time: DateTime<Utc>,
    pub applications_client_id: i64,
    pub applications_service_id: i64
}
