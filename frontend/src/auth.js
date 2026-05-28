export const getToken = () => localStorage.getItem('prithvi_token');
export const setToken = (token) => localStorage.setItem('prithvi_token', token);
export const removeToken = () => localStorage.removeItem('prithvi_token');

export const setGuest = () => localStorage.setItem('prithvi_guest', 'true');
export const removeGuest = () => localStorage.removeItem('prithvi_guest');
export const isGuest = () => localStorage.getItem('prithvi_guest') === 'true';

// Returns true if user has any access (logged in OR guest)
export const hasAccess = () => !!getToken() || isGuest();

export const authFetch = (url, options = {}) => {
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
