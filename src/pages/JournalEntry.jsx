import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../firebase/auth';
import { BookOpen, ArrowLeft, Save, Smile, Frown, Meh, ChevronDown, ChevronUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { getJournalEntries, saveJournalEntry } from '../services/services';

const JournalEntry = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [entry, setEntry] = useState({
    date: new Date(),
    content: '',
    mood: '',
    cravingIntensity: 5,
    triggers: ''
  });
  const [saving, setSaving] = useState(false);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEntryId, setOpenEntryId] = useState(null);

  useEffect(() => {
    const fetchRecentEntries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getJournalEntries({
          userId: user.uid,
          limit: 5
        });
        if (data && data.entries) {
          setRecentEntries(data.entries);
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEntries();
  }, [user]);

  const moods = [
    { id: 'great', label: 'Great', icon: Smile, color: 'bg-green-500' },
    { id: 'good', label: 'Good', icon: Smile, color: 'bg-blue-500' },
    { id: 'okay', label: 'Okay', icon: Meh, color: 'bg-yellow-500' },
    { id: 'difficult', label: 'Difficult', icon: Frown, color: 'bg-orange-500' },
    { id: 'struggling', label: 'Struggling', icon: Frown, color: 'bg-red-500' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !entry.content.trim()) return;

    setSaving(true);
    try {
      await saveJournalEntry({
        userId: user.uid,
        entry: {
          ...entry,
          date: entry.date?.toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        }
      });

      // Reset form
      setEntry({
        date: new Date(),
        content: '',
        mood: '',
        cravingIntensity: 5,
        triggers: ''
      });

      toast.success('Journal entry saved successfully');
      // refresh entries list
      const refreshed = await getJournalEntries({ userId: user.uid, limit: 5 });
      if (refreshed?.entries) {
        setRecentEntries(refreshed.entries);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Error saving entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Journal Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Journal Entry</h1>
                  <p className="text-gray-600">Reflect on your day</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <DatePicker
                    selected={entry.date}
                    onChange={(date) => setEntry({ ...entry, date: date || new Date() })}
                    className="input-field w-full"
                    dateFormat="MM/dd/yyyy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How are you feeling today?
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {moods.map((mood) => {
                      const Icon = mood.icon;
                      const isSelected = entry.mood === mood.id;
                      return (
                        <button
                          key={mood.id}
                          type="button"
                          onClick={() => setEntry({ ...entry, mood: mood.id })}
                          className={`
                            p-3 rounded-lg border-2 transition-all
                            ${isSelected
                              ? `border-${mood.color.split('-')[1]}-500 ${mood.color} text-white`
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">{mood.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Craving Intensity: {entry.cravingIntensity}/10
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={entry.cravingIntensity}
                    onChange={(e) => setEntry({ ...entry, cravingIntensity: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>None</span>
                    <span>Moderate</span>
                    <span>Intense</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    value={entry.content}
                    onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                    className="input-field min-h-[200px]"
                    placeholder="Write about your day, your thoughts, your progress, challenges, or anything else..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Triggers (optional)
                  </label>
                  <input
                    type="text"
                    value={entry.triggers}
                    onChange={(e) => setEntry({ ...entry, triggers: e.target.value })}
                    className="input-field"
                    placeholder="What situations, people, or emotions triggered cravings today?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving || !entry.content.trim()}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Entries Sidebar */}
          <div>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Entries</h2>
              {loading ? (
                <div className="max-h-[150px] display-flex flex items-center justify-center">
                  <Loading />
                </div>) : (
                recentEntries.length === 0 ? (
                  <p className="text-gray-500 text-sm">No entries yet. Start journaling!</p>
                ) : (
                  <div className="space-y-3">
                    {recentEntries.map((item, index) => {
                      const isOpen = openEntryId === index;
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setOpenEntryId(isOpen ? null : index)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                          >
                            <div>
                              <p className="text-xs text-gray-500">
                                {new Date(item.date || item.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-800 line-clamp-1">{item.content}</p>
                            </div>
                            {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 space-y-2 text-sm text-gray-700">
                              {item.mood && (
                                <p className="text-xs text-gray-500">Mood: {moods.find(m => m.id === item.mood)?.label || item.mood}</p>
                              )}
                              <p><span className="font-medium">Craving intensity:</span> {item.cravingIntensity ?? 'N/A'}/10</p>
                              {item.triggers && <p><span className="font-medium">Triggers:</span> {item.triggers}</p>}
                              <p><span className="font-medium">What's on your mind:</span> {item.content}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))} </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;

