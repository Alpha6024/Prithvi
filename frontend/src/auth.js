export const getToken = () => sessionStorage.getItem('prithvi_token');
export const setToken = (token) => sessionStorage.setItem('prithvi_token', token);
export const removeToken = () => sessionStorage.removeItem('prithvi_token');

export const setGuest = () => sessionStorage.setItem('prithvi_guest', 'true');
export const removeGuest = () => sessionStorage.removeItem('prithvi_guest');
export const isGuest = () => sessionStorage.getItem('prithvi_guest') === 'true';

// Returns true if user has any access (logged in OR guest)
export const hasAccess = () => !!getToken() || isGuest();

const ALLOWED_API_ORIGIN = import.meta.env.VITE_API_URL;

export const authFetch = (url, options = {}) => {
    // Prevent SSRF: only allow requests to the configured API origin
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
