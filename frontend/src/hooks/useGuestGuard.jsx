import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isGuest } from '../auth';

export function useGuestGuard() {
    const [showPrompt, setShowPrompt] = useState(false);
    const navigate = useNavigate();

    const guard = (action) => {
        if (isGuest()) { setShowPrompt(true); return; }
        action();
    };

    const GuestPrompt = () => showPrompt ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-6">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
                <div className="text-4xl mb-3">🔒</div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Sign in required</h2>
                <p className="text-sm text-gray-500 mb-5">This action is only available to signed-in users.</p>
                <button
                    onClick={() => navigate('/acc')}
                    className="w-full bg-green-500 text-white font-semibold py-3 rounded-xl mb-3 active:bg-green-600"
                >
                    Sign in with Google
                </button>
                <button
                    onClick={() => setShowPrompt(false)}
                    className="w-full text-gray-500 text-sm py-2"
                >
                    Continue as guest
                </button>
            </div>
        </div>
    ) : null;

    return { guard, GuestPrompt };
}
