import Loading from '../../components/Loading';

export const StatCard = ({ label, value, icon, loading }) => (
    <div className="card">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600 mb-1">{label}</p>
                {loading ? (
                    <Loading size="h-10 w-10" isInContainer={true} />
                ) : (
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                )}
            </div>
            {icon}
        </div>
    </div>
);

