


export function randomRoomID(length = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


export enum CallStatus {
    IDLE = 'idle',
    CALLING = 'calling',
    RINGING = 'ringing',
    ACCEPTED = 'accepted',
    IN_CALL = 'inCall',
    ENDED = 'ended',
    REJECT = 'reject'
}

export interface CallInterface {
    callMode: string,
    roomID: string,
    roomURL: string,
    status: string
}



export const VOICE_CONFIG = {
    turnOnCameraWhenJoining: false,
    turnOnMicrophoneWhenJoining: true,
    showMyCameraToggleButton: false,
    showMyMicrophoneToggleButton: true,
    showAudioVideoSettingsButton: false,
    showScreenSharingButton: false,
    showTextChat: false,
    showUserList: true,
    showRoomTimer: false,
}

export const VIDEO_CONFIG = {
    turnOnCameraWhenJoining: true,
    turnOnMicrophoneWhenJoining: true,
    showMyCameraToggleButton: true,
    showMyMicrophoneToggleButton: true,
    showAudioVideoSettingsButton: true,
    showScreenSharingButton: true,
    showTextChat: true,
    showUserList: true,
    showRoomTimer: false,
}

