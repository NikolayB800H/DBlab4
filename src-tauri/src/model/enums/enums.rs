use serde::Serialize;

#[derive(sqlx::Type)]
#[sqlx(type_name = "applicationStatus")]
#[derive(Debug, Clone, Serialize)]
pub enum ApplicationStatus {
    Принято, Отклонено, Закрыто, Обрабатывается
}

#[derive(sqlx::Type)]
#[sqlx(type_name = "serviceName")]
#[derive(Debug, Clone, Serialize)]
pub enum ServiceName {
    Анализы, Больничный, Справка, Обследование
}

#[derive(sqlx::Type)]
#[sqlx(type_name = "serviceStatus")]
#[derive(Debug, Clone, Serialize)]
pub enum ServiceStatus {
    Выполнена, Провалена, Неначата
}
