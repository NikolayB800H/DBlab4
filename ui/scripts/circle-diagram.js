const { invoke } = window.__TAURI__.tauri;

export function getClientServicesCountCount(searchCol, searchValue) {
    const count = invoke('get_client_services_count_count', {searchCol, searchValue});
    return count;
}

export function getClientServicesCount(searchCol, searchValue, sortCol, sortWay, limit, offset) {
    const services = invoke('get_client_services_count', { searchCol, searchValue, sortCol, sortWay, limit, offset });
    return services;
}
