import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { setToken, removeGuest } from '../auth';

const API = import.meta.env.VITE_API_URL;

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data.session) { navigate('/acc'); return; }

            try {
                const res = await fetch(`${API}/auth/supabase-session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: data.session.access_token })
                });
                const result = await res.json();
                if (result.success) {
                    setToken(result.token);
                    removeGuest();
                    navigate(result.isNewUser ? '/newacc' : '/acc/home');
                } else {
                    navigate('/acc');
                }
            } catch {
                navigate('/acc');
            }
        };
        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <span className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 font-medium">Signing you in...</p>
            </div>
        </div>
    );
}
