import Loading from '../../components/Loading';

const TodaysFocus = ({ focus, loading, onRetry }) => (
    <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Today's Focus</h3>
        {loading ? (
            <div className="mt-12">
                <Loading size="h-10 w-10" isInContainer={true} />
            </div>
        ) : focus ? (
            <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-recovery-DEFAULT">
                    <p className="text-gray-800 font-medium mb-2">{focus.title}</p>
                    <p className="text-sm text-gray-700">{focus.content}</p>
                </div>
                {focus.suggestions && focus.suggestions.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Suggestions:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {focus.suggestions.map((suggestion, idx) => (
                                <li key={idx}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        ) : (
            <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                    Unfortunately, we were not able to fetch your today's focus. Insights will appear here
                    catered toward your recovery path and recent journal entries.
                </p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-3 text-sm text-recovery-700 hover:text-recovery-dark underline"
                    >
                        Retry fetching focus
                    </button>
                )}
            </div>
        )}
    </div>
);

export default TodaysFocus;

