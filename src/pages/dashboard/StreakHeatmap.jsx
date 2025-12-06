import { useMemo } from 'react';
import Loading from '../../components/Loading';

// TODO: Update to use actaul data from API
// TODO: Update to not display 365 days but rather the last x days since the user began logging their recovery journey

// -------------------------------------
// Status mappings
// -------------------------------------
const STATUS_COLORS = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    red: 'bg-red-500',
    none: 'bg-gray-200',
};

const STATUS_LABELS = {
    green: 'No substance use',
    yellow: 'Mild cravings',
    red: 'Relapse',
    none: 'No data yet',
};

// Normalize input
const normalizeStatus = (status) => {
    const s = (status || '').toLowerCase();
    if (['green', 'sober', 'success', 'no-use'].includes(s)) return 'green';
    if (['yellow', 'cravings', 'urge', 'warning'].includes(s)) return 'yellow';
    if (['red', 'relapse', 'slip'].includes(s)) return 'red';
    return 'none';
};

// -------------------------------------
// Generate mock streak entries for past 365 days, random
// -------------------------------------
export const generateMockStreakData = () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const statuses = ['none', 'green', 'yellow', 'red'];

    return Array.from({ length: 365 }).map((_, i) => {
        const day = new Date(today);
        day.setUTCDate(today.getUTCDate() - (364 - i));

        return {
            date: day.toISOString().slice(0, 10),
            status: statuses[Math.floor(Math.random() * statuses.length)],
        };
    });
};


// -------------------------------------
// Build 52 weeks × 7 days grid
// -------------------------------------
const buildWeeks = (entries = []) => {
    const map = {};
    entries.forEach(({ date, status }) => {
        if (!date) return;
        const iso = new Date(date).toISOString().slice(0, 10);
        map[iso] = normalizeStatus(status);
    });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const days = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setUTCDate(today.getUTCDate() - i);

        const iso = d.toISOString().slice(0, 10);

        days.push({
            date: iso,
            status: map[iso] || 'none',
        });
    }

    // Convert list of 365 days, 52 arrays of 7 days
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return weeks;
};

// Format date tooltip
const formatDateLabel = (isoDate) => {
    const d = new Date(`${isoDate}T00:00:00Z`);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// -------------------------------------
// Component
// -------------------------------------
const StreakHeatmap = ({
    entries = generateMockStreakData(),
    loading = false,
}) => {
    const weeks = useMemo(() => buildWeeks(entries), [entries]);
    const hasData = entries.length > 0;

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Streak Heatmap</h3>
                    <p className="text-sm text-gray-600">
                        Past 365 days · sobriety & cravings at a glance
                    </p>
                </div>
                <span className="text-xs text-gray-500">Last 12 months</span>
            </div>

            {loading ? (
                <Loading size="h-10 w-10" isInContainer />
            ) : (
                <>
                    {!hasData && (
                        <p className="text-sm text-gray-600 mb-4">
                            No daily streak data yet. As you log cravings or relapses, this heatmap
                            will fill in.
                        </p>
                    )}

                    <div className="flex items-start gap-4">
                        {/* actual heatmap grid */}
                        <div className="overflow-x-auto">
                            <div className="grid auto-cols-[14px] grid-flow-col gap-[3px]">
                                {weeks.map((week, wIdx) => (
                                    <div key={`week-${wIdx}`} className="grid grid-rows-7 gap-[3px]">
                                        {week.map((day) => (
                                            <div
                                                key={day.date}
                                                className={`h-3.5 w-3.5 rounded-[3px] ${STATUS_COLORS[day.status] || STATUS_COLORS.none
                                                    }`}
                                                title={`${formatDateLabel(day.date)} • ${STATUS_LABELS[day.status]
                                                    }`}
                                                aria-label={`${formatDateLabel(day.date)}: ${STATUS_LABELS[day.status]
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* legend */}
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 rounded-[3px] bg-green-500" />
                                <span>Green = No substance use</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 rounded-[3px] bg-yellow-400" />
                                <span>Yellow = Mild cravings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 rounded-[3px] bg-red-500" />
                                <span>Red = Relapse</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 rounded-[3px] bg-gray-200" />
                                <span>Gray = Not logged</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StreakHeatmap;
