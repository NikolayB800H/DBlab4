const { invoke } = window.__TAURI__.tauri;

export function workerGetClientsCount(searchCol, searchValue) {
    const count = invoke('worker_get_clients_count', {searchCol, searchValue});
    return count;
}

export function workerGetClients(searchCol, searchValue, sortCol, sortWay, limit, offset) {
    const services = invoke('worker_get_clients', { searchCol, searchValue, sortCol, sortWay, limit, offset });
    return services;
}

export function workerRemoveClients() { //!
    return 0;
}

export function workerChangeClients() { //!
    return 0;
}

export function workerAddClients() { //!
    return 0;
}
