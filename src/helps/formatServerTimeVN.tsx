export function formatAnyTimeToVN(time: string): string {
    if (!time) return '';

    let date: Date;

    // Case 1: ISO string (frontend tự tạo)
    if (time.includes('T') && time.endsWith('Z')) {
        date = new Date(time);
    }
    // Case 2: server trả "YYYY-MM-DD HH:mm:ss" (UTC thiếu Z)
    else {
        const utcIso = time.replace(' ', 'T') + 'Z';
        date = new Date(utcIso);
    }

    return date.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
