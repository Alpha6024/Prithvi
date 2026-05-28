export const getToken = () => localStorage.getItem('prithvi_token');
export const setToken = (token) => localStorage.setItem('prithvi_token', token);
export const removeToken = () => localStorage.removeItem('prithvi_token');

export const setGuest = () => localStorage.setItem('prithvi_guest', 'true');
export const removeGuest = () => localStorage.removeItem('prithvi_guest');
export const isGuest = () => localStorage.getItem('prithvi_guest') === 'true';

export const hasAccess = () => !!getToken() || isGuest();

const ALLOWED_API_ORIGIN = import.meta.env.VITE_API_URL;

export const authFetch = (url, options = {}) => {
    if (!url.startsWith(ALLOWED_API_ORIGIN)) {
        return Promise.reject(new Error('Request blocked: unauthorized URL'));
    }
    const token = getToken();
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.body && !(options.body instanceof FormData)
                ? { 'Content-Type': 'application/json' }
                : {}),
        },
    });
};
