const Loading = ({ size = 'h-16 w-16', color = 'border-blue-800', isInContainer = false }) => {
    return (
        isInContainer ? (
            <div className="max-h-[150px] flex items-center justify-center">
                <div className={`animate-spin rounded-full ${size} border-b-4 ${color}`}></div>
            </div>
        ) : (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
                <div className={`animate-spin rounded-full ${size} border-b-4 ${color}`}></div>
            </div>
        )
    );
};

export default Loading;