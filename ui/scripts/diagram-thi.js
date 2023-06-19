const { invoke } = window.__TAURI__.tauri;

export function getClientCoefCount(searchCol, searchValue) {
    const count = invoke('get_client_coef_count', {searchCol, searchValue});
    return count;
}

export function getClientCoef(searchCol, searchValue, sortCol, sortWay, limit, offset) {
    const applications = invoke('get_client_coef', { searchCol, searchValue, sortCol, sortWay, limit, offset });
    return applications;
}
