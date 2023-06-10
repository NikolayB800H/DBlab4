const { invoke } = window.__TAURI__.tauri;

export function createClient(name, registeredAs) {
    const client = invoke('create_client', { name, registeredAs });
    return client;
}

export function getUserClient(userId) {
    const client = invoke('get_user_client', { userId });
    return client;
}

export function addNewClient(client) {
    const client_id = invoke('add_client', { client });
    return client_id;
}
