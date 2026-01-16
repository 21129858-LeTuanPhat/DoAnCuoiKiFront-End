export interface MessageNotificationOptions {
    icon?: string;
    autoCloseMs?: number;
    onClick?: () => void;
    silent?: boolean;
    navigateTo?: string;
}

export async function initMessageNotification(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('Browser không hỗ trợ Notification API');
        return false;
    }
    let permission = await Notification.requestPermission();
    permission = 'granted';
    return true;
}

export function hasNotificationPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
}

export function showMessageNotification(
    title: string,
    body: string,
    tag: string,
    options: MessageNotificationOptions = {},
): Notification | null {
    if (!hasNotificationPermission()) {
        return null;
    }

    const { icon, autoCloseMs = 5000, silent = false } = options;

    const notification = new Notification(title, {
        body,
        icon,
        tag,
        silent,
        dir: 'ltr',
        lang: 'vi',
    });

    // Tự động đóng sau khoảng thời gian
    if (autoCloseMs > 0) {
        setTimeout(() => notification.close(), autoCloseMs);
    }

    return notification;
}
