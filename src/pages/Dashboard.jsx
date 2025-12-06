import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../firebase/auth';
import { Calendar, BookOpen, Users, PenSquare } from 'lucide-react';
import { RECOVERY_LABELS } from '../constants/recovery';
import Loading from '../components/Loading';
import { getUserData, getUserStats, getTodaysFocus } from '../services/services';
import QuickActions from './dashboard/QuickActions';
import TodaysFocus from './dashboard/TodaysFocus';
import StatCard from './dashboard/StatCard';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ daysSober: 0, journalEntries: 0, communityPosts: 0 });
  const [todayFocus, setTodayFocus] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [loadingUserStats, setLoadingUserStats] = useState(true);
  const [loadingTodaysFocus, setLoadingTodaysFocus] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // TODO: Make use of state for the userData for their recovery path, we need to make use of React Context
    // Use React Context to store the userData for their recovery path, and use it throughout the application, that way we reduce API calls
    // Also ideally make use of Context for the API calls that involve AI

    // Fetch user data (recovery path)
    const fetchUserData = async () => {
      try {
        const userDataFetched = await getUserData({ userId: user.uid });
        setUserData(userDataFetched);
      }
      catch (error) {
        console.error('Error fetching user data:', error);
        setUserData({ recoveryPath: 'not-sure' });
      } finally {
        setLoadingUserData(false);
      }
    }

    // Fetch user stats (days sober, journal entries, community posts)
    const fetchUserStats = async () => {
      try {
        const userDataStatsFetched = await getUserStats({ userId: user.uid });
        setStats(userDataStatsFetched);
      }
      catch (error) {
        console.error('Error fetching user stats:', error);
        setStats({ daysSober: 0, journalEntries: 0, communityPosts: 0 });
      } finally {
        setLoadingUserStats(false);
      }
    }

    // Fetch user todays focus, based on their recovery path and recent journal entries
    const fetchUserTodaysFocus = async () => {
      try {
        const userDataFocusFetched = await getTodaysFocus({ userId: user.uid });
        setTodayFocus(userDataFocusFetched);
      }
      catch (error) {
        console.error('Error fetching user todays focus:', error);
        setTodayFocus(null);
      } finally {
        setLoadingTodaysFocus(false);
      }
    }

    fetchUserData();
    fetchUserStats();
    fetchUserTodaysFocus();

  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {loadingUserData ? <Loading /> : (<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName || 'Friend'}!
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              Your recovery path: <span className="font-semibold text-recovery-DEFAULT">{RECOVERY_LABELS[userData?.recoveryPath] || userData?.recoveryPath || 'Not selected'}</span>
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-recovery-50 text-recovery-700 border border-recovery-100 hover:bg-recovery-100 transition"
            >
              <PenSquare className="w-4 h-4" />
              Update path
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Days Sober" value={stats.daysSober} icon={<div className="bg-blue-100 p-3 rounded-lg"><Calendar className="w-6 h-6 text-blue-600" /></div>} loading={loadingUserStats} />
          <StatCard label="Journal Entries" value={stats.journalEntries} icon={<div className="bg-purple-100 p-3 rounded-lg"><BookOpen className="w-6 h-6 text-purple-600" /></div>} loading={loadingUserStats} />
          <StatCard label="Community Posts" value={stats.communityPosts} icon={<div className="bg-green-100 p-3 rounded-lg"><Users className="w-6 h-6 text-green-600" /></div>} loading={loadingUserStats} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickActions
            onStartCounter={() => navigate('/recovery-counter')}
            onJournal={() => navigate('/journal')}
            onStepWork={() => navigate('/step-work')}
            disabled={loadingUserData}
          />

          <TodaysFocus
            focus={todayFocus}
            loading={loadingTodaysFocus}
            onRetry={() => fetchUserTodaysFocus()}
          />
        </div>
      </main>)}
    </div>
  );
};

export default Dashboard;

