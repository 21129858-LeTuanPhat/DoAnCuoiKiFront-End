import React from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { ICallMode, randomRoomID, VIDEO_CONFIG, VOICE_CONFIG } from '../model/CallProps';
import {
    useQueryParams,
    NumberParam,
    StringParam,
} from 'use-query-params';
export default function Call() {
    const [query, setQuery] = useQueryParams({
        roomID: StringParam,
        call_mode: StringParam
    })
    console.log(query.roomID)

    const roomID = randomRoomID()
    let myMeeting = async (element: any) => {
        const appID = Number(process.env.REACT_APP_ZEGO_APPID);
        const serverSecret = process.env.REACT_APP_ZEGO_SERVER;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret as string, query.roomID as string, randomRoomID(5), localStorage.getItem('username') || 'haha');
        const zp = ZegoUIKitPrebuilt.create(kitToken);
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
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showPreJoinView: false,
            maxUsers: 2,
            ...(query.call_mode === ICallMode.VOICE ? VOICE_CONFIG : VIDEO_CONFIG)
            // onUserAvatarSetter: (userList) => {
            //     userList.forEach(user => {
            //         // Bạn có thể set avatar khác nhau cho từng user
            //         if (user && typeof user.setUserAvatar === 'function') {
            //             user.setUserAvatar("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHuY484VNuH6DQea0DwgHsAYgZCbR0a-jxmLbciys8zoHjd1JJZut8oRSdcQE0lQnAyckwew&s=10");
            //         }
            //     });
            // },
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