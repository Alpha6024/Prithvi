import { useNavigate } from 'react-router-dom';
import { isGuest } from '../auth';

export default function GuestBanner() {
    const navigate = useNavigate();
    if (!isGuest()) return null;
    return (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-3">
            <p className="text-xs text-amber-700 font-medium">👀 Browsing as guest — read only</p>
            <button
                onClick={() => navigate('/acc')}
                className="text-xs bg-green-500 text-white font-semibold px-3 py-1.5 rounded-full active:bg-green-600 shrink-0"
            >
                Sign in with Google
            </button>
        </div>
    );
}
