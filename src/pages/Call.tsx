import React from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { randomRoomID } from '../model/CallProps';
export default function Call() {
    const roomID = randomRoomID()
    let myMeeting = async (element: any) => {
        const appID = Number(process.env.REACT_APP_ZEGO_APPID);
        const serverSecret = process.env.REACT_APP_ZEGO_SERVER;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(Number(process.env.REACT_APP_ZEGO_APPID), process.env.REACT_APP_ZEGO_SERVER as string, roomID, 'abc', 'bcbc');
        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        // zp.joinRoom({
        //     container: element,
        //     sharedLinks: [
        //         {
        //             name: 'Personal link',
        //             url:
        //                 window.location.protocol + '//' +
        //                 window.location.host + window.location.pathname +
        //                 '?roomID=' +
        //                 roomID,
        //         },
        //     ],
        //     scenario: {
        //         mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        //     },
        // });

        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Personal link',
                    url:
                        window.location.protocol + '//' +
                        window.location.host + window.location.pathname +
                        '?roomID=' +
                        roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall,
            },
            showPreJoinView: false,
            maxUsers: 2,
            turnOnCameraWhenJoining: false,
            turnOnMicrophoneWhenJoining: true,
            showMyCameraToggleButton: false,
            showMyMicrophoneToggleButton: true, // Hiển thị nút mute/unmute
            showAudioVideoSettingsButton: false,
            showScreenSharingButton: false,
            showTextChat: false, // Tắt chat nếu không cần
            showUserList: false, // Tắt danh sách user nếu không cần
            showRoomTimer: true, // Hiển thị thời gian cuộc gọi
            onUserAvatarSetter: (userList) => {
                userList.forEach(user => {
                    // Bạn có thể set avatar khác nhau cho từng user
                    if (user && typeof user.setUserAvatar === 'function') {
                        user.setUserAvatar("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHuY484VNuH6DQea0DwgHsAYgZCbR0a-jxmLbciys8zoHjd1JJZut8oRSdcQE0lQnAyckwew&s=10");
                    }
                });
            },
        });
    }

    const handleClick = () => {
        const paddingTop = 50;
        const paddingLeft = 100;
        const width = window.innerWidth - paddingLeft * 2;
        const height = window.innerHeight - paddingTop * 2;


        window.open(
            "https://example.com",
            "_blank",
            `width=${width},height=${height},left=${paddingLeft},top=${paddingTop}`
        );
    };
    return (
        <div>
            <div
                className="myCallContainer"
                ref={myMeeting as any}
                style={{ width: '100vw', height: '100vh' }}
            ></div>
            <button onClick={handleClick}>
                Mở popup với padding
            </button>
        </div>



    )

}