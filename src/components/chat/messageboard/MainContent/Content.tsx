import { ChatMessage } from '../../../../model/ChatMessage';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { RootState } from '../../../../redux/store';
import { useSelector } from 'react-redux';
import ContentItem from './ContentItem';
import { Camera, CameraOff, Phone, PhoneOff } from 'lucide-react';
function Content({ message }: { message: ChatMessage }) {
    const { selectedUser, type } = useBoardContext();
    const user = useSelector((state: RootState) => state.user);
    return type === 'people' ? (
        selectedUser === message.name ? (
            <ContentItem message={message} color={true} />
        ) : (
            <ContentItem message={message} color={false} />
        )
    ) : user.username !== message.name ? (
        <ContentItem message={message} color={true} />
    ) : (
        <ContentItem message={message} color={false} />
    );
}

export default Content;
