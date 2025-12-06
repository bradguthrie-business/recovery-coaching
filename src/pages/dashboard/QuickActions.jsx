import { Tooltip } from 'react-tooltip';
import { InfoIcon } from 'lucide-react';

const QuickActions = ({ onStartCounter, onJournal, onStepWork, disabled }) => (
    <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
            <button
                onClick={onStartCounter}
                className={`relative w-full btn-primary flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed hover:cursor-not-allowed' : ''}`}
                disabled={disabled}
            >
                <div>Recovery Tracking</div>
                <InfoIcon className="w-4 h-4 absolute right-5" data-tooltip-id="recovery-tracking-tooltip" data-tooltip-content="Track your timeline in recovery for substances, behaviors, or anything else you are recovering from." />
                <Tooltip id="recovery-tracking-tooltip" />
            </button>
            <button
                onClick={onJournal}
                className={`relative w-full btn-secondary flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
            >
                <div>Write Journal Entry</div>
                <InfoIcon className="w-4 h-4 absolute right-5" data-tooltip-id="write-journal-entry-tooltip" data-tooltip-content="Journal your thoughts, feelings, and experiences related to your recovery journey." />
                <Tooltip id="write-journal-entry-tooltip" />
            </button>

            <button
                onClick={onStepWork}
                className={`relative w-full btn-secondary flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
            >
                <div>Begin Step Work</div>
                <InfoIcon className="w-4 h-4 absolute right-5" data-tooltip-id="begin-step-work-tooltip" data-tooltip-content="Track your recovery journey through working the steps that apply based on your recovery path." />
                <Tooltip id="begin-step-work-tooltip" />
            </button>
        </div>
    </div>
);

export default QuickActions;

