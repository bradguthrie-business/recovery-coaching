import { LogOut, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase/auth';

const AppHeader = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        await logOut();
        navigate('/');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                        <HeartPulse className="w-8 h-8 text-recovery-DEFAULT" />
                        <h1 className="text-2xl font-bold text-gray-900">Recovery At Ease</h1>
                    </div>
                    {user && user?.displayName && <div className="flex items-center space-x-4">
                        <span className="text-gray-700">{user.displayName}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>

                    </div>}
                </div>
            </div>
        </header>
    );
};

export default AppHeader;

