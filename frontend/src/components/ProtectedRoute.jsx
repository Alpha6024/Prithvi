import { Navigate } from 'react-router-dom';
import { hasAccess } from '../auth';

export default function ProtectedRoute({ children }) {
    return hasAccess() ? children : <Navigate to="/acc" replace />;
}
