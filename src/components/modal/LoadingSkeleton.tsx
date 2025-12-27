export function LoadingProfileSkeleton() {
    return (
        <div className="mt-6 p-4 rounded-2xl border shadow animate-pulse">
            <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
            </div>
            <div className="h-24 bg-gray-200 rounded mt-4" />
        </div>
    );
}
