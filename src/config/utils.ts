function formatDate(date: number): string {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
function parseTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diffMs = now - timestamp;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 10) return 'vừa xong';
    if (seconds < 60) return `${seconds} giây trước`;
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days === 1) return 'hôm qua';
    if (days < 7) return `${days} ngày trước`;

    return formatDate(timestamp);
}

export { formatDate, parseTimeAgo };
export const SOCKET_BASE_URL = 'wss://chat.longapp.site/chat/chat';
export const REACT_BASE_URL = 'http://localhost:3000';
