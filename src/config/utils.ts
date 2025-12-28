function formatDate(date: number): string {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
export { formatDate };
export const SOCKET_BASE_URL = 'wss://chat.longapp.site/chat/chat';
export const REACT_BASE_URL = 'http://localhost:3000';
