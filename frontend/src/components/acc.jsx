import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { setGuest, setToken, removeGuest } from '../auth';

const API = import.meta.env.VITE_API_URL;

export default function Acc() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('login'); // 'login' | 'signup'
    const [form, setForm] = useState({ username: '', password: '', name: '', email: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` }
        });
    };

    const handleGuest = () => { setGuest(); navigate('/acc/home'); };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: form.username, password: form.password })
            });
            const data = await res.json();
            if (data.success) {
                setToken(data.token);
                removeGuest();
                navigate('/acc/home');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch { setError('Server error, try again'); }
        finally { setLoading(false); }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) return setError("Passwords don't match");
        if (form.password.length < 6) return setError('Password must be at least 6 characters');
        if (form.username.length < 3) return setError('Username must be at least 3 characters');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('username', form.username);
            formData.append('password', form.password);
            const res = await fetch(`${API}/user/signup`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setToken(data.token);
                removeGuest();
                navigate('/acc/home');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch { setError('Server error, try again'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-green-800">Prithvi</h1>
                    <p className="text-sm text-gray-500 mt-1 text-center">Action for the Earth 🌱</p>
                </div>

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-gray-300 py-3.5 rounded-2xl font-semibold text-gray-700 flex items-center justify-center gap-3 shadow-sm active:bg-gray-50 transition-colors mb-4"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Login / Signup Tabs */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-4">
                    <button
                        onClick={() => { setTab('login'); setError(''); }}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'login' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setTab('signup'); setError(''); }}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'signup' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Login Form */}
                {tab === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-3">
                        <input
                            type="text"
                            name="username"
                            aria-label="Username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="password"
                            name="password"
                            aria-label="Password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {error && <p className="text-red-500 text-xs px-1">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 text-white font-semibold py-3.5 rounded-2xl active:bg-green-600 disabled:opacity-60 transition-colors"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                )}

                {/* Signup Form */}
                {tab === 'signup' && (
                    <form onSubmit={handleSignup} className="space-y-3">
                        <input
                            type="text"
                            name="name"
                            aria-label="Full Name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="email"
                            name="email"
                            aria-label="Email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="text"
                            name="username"
                            aria-label="Username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="password"
                            name="password"
                            aria-label="Password"
                            placeholder="Password (min 6 chars)"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            aria-label="Confirm Password"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {error && <p className="text-red-500 text-xs px-1">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 text-white font-semibold py-3.5 rounded-2xl active:bg-green-600 disabled:opacity-60 transition-colors"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Guest */}
                <button
                    onClick={handleGuest}
                    className="w-full bg-gray-100 py-3.5 rounded-2xl font-semibold text-gray-600 flex items-center justify-center gap-2 active:bg-gray-200 transition-colors"
                >
                    <span className="text-lg">👀</span>
                    Browse as Guest
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                    Guest mode is read-only. Sign in to post, donate & join campaigns.
                </p>

                {/* Admin */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-xs text-gray-300 hover:text-gray-500 uppercase tracking-widest transition-colors"
                    >
                        Admin Portal
                    </button>
                </div>
            </div>
        </div>
    );
}
