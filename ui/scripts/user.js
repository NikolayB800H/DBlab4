const { invoke } = window.__TAURI__.tauri;

export async function createUser(login, password, isWorker) {
    const user = await invoke('create_user', { login, password, isWorker });
    return user;
}

export async function addUser(user) {
    try {
        let user_id = await invoke('add_user', { user });
        return user_id;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function tryLoginUser(login, password) {
    const maybeUserPromise = await invoke('try_login_user', { login, password });
    return maybeUserPromise;
}
