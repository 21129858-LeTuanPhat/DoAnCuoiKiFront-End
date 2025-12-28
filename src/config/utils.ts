export const SOCKET_BASE_URL = 'wss://chat.longapp.site/chat/chat';

function formatDate(date: number): string {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
export { formatDate };
