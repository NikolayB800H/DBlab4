const { invoke } = window.__TAURI__.tauri;

export function workerGetApplicationsCount(searchCol, searchValue, servicesId) {
    const count = invoke('worker_get_applications_count', {searchCol, searchValue, servicesId});
    return count;
}

export function workerGetApplications(searchCol, searchValue, sortCol, sortWay, limit, offset, servicesId) {
    const applications = invoke('worker_get_applications', { searchCol, searchValue, sortCol, sortWay, limit, offset, servicesId });
    return applications;
}

export function workerRemoveApplications(applicationsId) {
    return invoke('worker_remove_applications', { applicationsId });
}

export function workerChangeApplications(applicationsId, applicationsStatus, applicationsUpdateTime) {
    return invoke('worker_change_applications', { applicationsId, applicationsStatus, applicationsUpdateTime });
} // applications_id, applications_status, applications_update_time, applications_client_id, applications_service_id
