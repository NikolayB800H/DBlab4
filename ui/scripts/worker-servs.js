const { invoke } = window.__TAURI__.tauri;

export function workerGetServicesCount(searchCol, searchValue) {
    const count = invoke('worker_get_services_count', {searchCol, searchValue});
    return count;
}

export function workerGetServices(searchCol, searchValue, sortCol, sortWay, limit, offset) {
    const services = invoke('worker_get_services', { searchCol, searchValue, sortCol, sortWay, limit, offset });
    return services;
}

export function workerRemoveServices(servicesId) {
    return invoke('worker_remove_services', { servicesId });
}

export function workerChangeServices(servicesId, servicesName, servicesStatus, servicesUpdateTime, servicesContent) {
    return invoke('worker_change_services', { servicesId, servicesName, servicesStatus, servicesUpdateTime, servicesContent });
} // services_id, services_name, services_status, services_update_time, services_content
