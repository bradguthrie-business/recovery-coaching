const QuickActions = ({ onStartCounter, onJournal, onStepWork, disabled }) => (
    <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
            <button
                onClick={onStartCounter}
                className={`w-full btn-primary flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
            >
                Start Recovery Tracking
            </button>
            <button
                onClick={onJournal}
                className={`w-full btn-secondary flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
            >
                Write Journal Entry
            </button>
            <button
                onClick={onStepWork}
                className={`w-full btn-secondary flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
            >
                Begin Step Work
            </button>
        </div>
    </div>
);

export default QuickActions;

