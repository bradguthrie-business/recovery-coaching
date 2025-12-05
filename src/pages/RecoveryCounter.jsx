import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../firebase/auth';
import {
  Calendar,
  ArrowLeft,
  Save,
  RefreshCcw,
  Trash2,
  PlusCircle,
  Wine,
  Syringe,
  Pill,
  Leaf,
  Skull,
  Cigarette,
  CoinsIcon,
  Eye,
  Gamepad2,
  Coffee,
  Briefcase,
  Zap,
  Candy,
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { getRecoveryCounters, saveRecoveryCounters } from '../services/services';

const BASE_SUBSTANCES = [
  { id: 'alcohol', name: 'Alcohol', color: 'bg-blue-500' },
  { id: 'nicotine', name: 'Nicotine', color: 'bg-gray-500' },
  { id: 'weed', name: 'Cannabis', color: 'bg-green-500' },
  { id: 'opioids', name: 'Opioids', color: 'bg-red-500' },
  { id: 'cocaine', name: 'Cocaine', color: 'bg-amber-500' },
  { id: 'stimulants', name: 'Stimulants', color: 'bg-orange-500' },
  { id: 'benzos', name: 'Benzos', color: 'bg-purple-500' },
  { id: 'kratom', name: 'Kratom', color: 'bg-emerald-500' },
  { id: 'gambling', name: 'Gambling', color: 'bg-indigo-500' },
  { id: 'pornography', name: 'Pornography', color: 'bg-pink-500' },
  { id: 'gaming', name: 'Gaming', color: 'bg-blue-400' },
  { id: 'work', name: 'Workaholism', color: 'bg-teal-500' },
  { id: 'sugar', name: 'Sugar', color: 'bg-yellow-400' },
  { id: 'caffeine', name: 'Caffeine', color: 'bg-lime-500' },
];

const SUBSTANCE_ICONS = {
  alcohol: Wine,
  opioids: Syringe,
  benzos: Pill,
  kratom: Leaf,
  cocaine: Skull,
  weed: Leaf,
  nicotine: Cigarette,
  stimulants: Zap,
  gambling: CoinsIcon,
  pornography: Eye,
  gaming: Gamepad2,
  caffeine: Coffee,
  sugar: Candy,
  work: Briefcase,
  default: Calendar,
};

const RecoveryCounter = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({});
  const [saving, setSaving] = useState(false);
  const [customSubstance, setCustomSubstance] = useState('');
  const [customSubstances, setCustomSubstances] = useState([]);
  const [pendingStart, setPendingStart] = useState(null);
  const [pendingDate, setPendingDate] = useState(new Date());

  useEffect(() => {
    const fetchCounters = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getRecoveryCounters({ userId: user.uid });
        if (data && data.counters) {
          setCounters(data.counters);
        }
      } catch (error) {
        console.error('Error fetching counters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounters();
  }, [user]);

  const calculateDays = (startDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const allSubstances = useMemo(() => {
    return [
      ...BASE_SUBSTANCES,
      ...customSubstances.map((c) => ({ id: c.id, name: c.name, color: c.color || 'bg-slate-500' })),
    ];
  }, [customSubstances]);

  const availableSubstances = allSubstances.filter((s) => !counters[s.id]);

  const queueStartCounter = (substance) => {
    setPendingStart(substance);
    setPendingDate(new Date());
  };

  const confirmStartCounter = () => {
    if (!pendingStart || !pendingDate) return;
    setCounters({
      ...counters,
      [pendingStart.id]: {
        startDate: new Date(pendingDate).toISOString(),
        name: pendingStart.name,
      },
    });
    setPendingStart(null);
    toast.success('Counter started');
  };

  const handleResetCounter = (substanceId) => {
    setCounters({
      ...counters,
      [substanceId]: {
        ...counters[substanceId],
        startDate: new Date().toISOString(),
      },
    });
    toast.info('Counter reset to today');
  };

  const handleRemoveCounter = (substanceId) => {
    const newCounters = { ...counters };
    delete newCounters[substanceId];
    setCounters(newCounters);
    toast.success('Counter removed');
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await saveRecoveryCounters({
        userId: user.uid,
        counters: counters
      });
      // setCountersProfile(counters);
      toast.success('Counters saved successfully');
      // refreshCounters();
    } catch (error) {
      console.error('Error saving counters:', error);
      toast.error('Error saving counters. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const activeCounters = Object.entries(counters).filter(([id, data]) => data.startDate);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="card mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recovery Counter</h1>
          <p className="text-gray-600">
            Track your sobriety journey. Start a counter for each substance you're working on.
          </p>
        </div>

        {loading ? (
          <div className="max-h-[200px] display-flex flex items-center justify-center">
            <Loading />
          </div>) : (
          <div>
            {/* Active Counters Section */}
            {activeCounters.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Active Counters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCounters.map(([id, data]) => {
                    const days = calculateDays(data.startDate);
                    const substance = allSubstances.find(s => s.id === id) || { color: 'bg-indigo-500' };
                    const Icon = SUBSTANCE_ICONS[id] || SUBSTANCE_ICONS.default;

                    return (
                      <div key={id} className="card">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${substance.color} p-3 rounded-lg text-white`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleResetCounter(id)}
                              className="text-sm inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              <RefreshCcw className="w-4 h-4" />
                              Reset to Today
                            </button>
                            <button
                              onClick={() => handleRemoveCounter(id)}
                              className="text-sm inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {data.name || substance.name}
                        </h3>
                        <p className="text-4xl font-bold text-recovery-DEFAULT mb-2">
                          {days}
                        </p>
                        <p className="text-sm text-gray-600">
                          {days === 1 ? 'day' : 'days'} sober
                        </p>
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                          <DatePicker
                            selected={data.startDate ? new Date(data.startDate) : new Date()}
                            onChange={(date) => {
                              if (!date) return;
                              setCounters({
                                ...counters,
                                [id]: {
                                  ...counters[id],
                                  startDate: date.toISOString(),
                                },
                              });
                            }}
                            className="input-field text-sm"
                            dateFormat="MM/dd/yyyy"
                            minDate={new Date('1950-01-01')}
                            maxDate={new Date()}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {!pendingStart && activeCounters.length === 0 &&
              <div className="card mb-6">
                <p className="text-gray-500 text-md">No active counters. Start a new counter to track abstinence from a vice!</p>
              </div>}
          </div>)}

        {/* Start New Counter */}
        {pendingStart && (
          <div className="card mt-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">Starting counter for</p>
                <p className="text-lg font-semibold text-gray-900">{pendingStart.name}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Start date</label>
                  <DatePicker
                    selected={pendingDate}
                    onChange={(date) => setPendingDate(date || new Date())}
                    className="input-field"
                    dateFormat="MM/dd/yyyy"
                  />
                </div>
                <div className="flex gap-4 justify-between ml-4 mt-5">
                  <button
                    onClick={confirmStartCounter}
                    className="btn-primary"
                  >
                    Start Counter
                  </button>
                  <button
                    onClick={() => setPendingStart(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start New Counter */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Start a New Counter</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {availableSubstances.map((substance) => {
              const isActive = counters[substance.id]?.startDate;
              const Icon = SUBSTANCE_ICONS[substance.id] || SUBSTANCE_ICONS.default;

              return (
                <button
                  key={substance.id}
                  onClick={() => isActive ? null : queueStartCounter(substance)}
                  disabled={isActive}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${isActive
                      ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-recovery-DEFAULT hover:shadow-md'
                    }
                  `}
                >
                  <div className={`${substance.color} w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{substance.name}</p>
                  {isActive && <p className="text-xs text-gray-500 mt-1">Active</p>}
                </button>
              );
            })}
          </div>

          {/* Custom Substance */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Want to track abstinence from a vice that's not listed?</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSubstance}
                onChange={(e) => setCustomSubstance(e.target.value)}
                placeholder="Enter the name of the vice you want to track abstinence from."
                className="input-field flex-1"
              />
              <button
                onClick={() => {
                  if (!customSubstance.trim()) return;
                  const id = `custom-${Date.now()}`;
                  setCustomSubstances([...customSubstances, { id, name: customSubstance.trim(), color: 'bg-slate-500' }]);
                  setCustomSubstance('');
                  toast.success('Custom substance added');
                }}
                disabled={!customSubstance.trim()}
                className="btn-primary inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 w-full btn-primary flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Counters'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryCounter;

