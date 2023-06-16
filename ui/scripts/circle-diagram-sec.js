const { invoke } = window.__TAURI__.tauri;

export function getClientAppCountCount(searchCol, searchValue) {
    const count = invoke('get_client_app_count_count', {searchCol, searchValue});
    return count;
}

export function getClientAppCount(searchCol, searchValue, sortCol, sortWay, limit, offset) {
    const applications = invoke('get_client_app_count', { searchCol, searchValue, sortCol, sortWay, limit, offset });
    return applications;
}
