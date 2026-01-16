import React, { useState } from 'react';
import { X } from 'lucide-react';
import WebSocketManager from '../../socket/WebSocketManager';
import { useBoardContext } from '../../hooks/useBoardContext';
import { TypeMess } from '../../model/ChatMessage';
import { randomRoomID } from '../../model/CallProps';

interface PinMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPin: (id: string, title: string, content: string, importance: 'low' | 'medium' | 'high') => void;
}

const PinMessageModal: React.FC<PinMessageModalProps> = ({ isOpen, onClose, onPin }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { type, selectedUser } = useBoardContext()
    const [importance, setImportance] = useState<'low' | 'medium' | 'high'>('medium');

    if (!isOpen) return null;
    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();
        const idPin = randomRoomID(8);
        const ws = WebSocketManager.getInstance();
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: type,
                        to: selectedUser,
                        mes: encodeURIComponent(JSON.stringify({ type: TypeMess.PIN, data: { id: idPin, title: title, content: content, importance: importance } }))
                    },
                },
            }),
        );
        console.log('tin nhắn pin nè', JSON.stringify({
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: type,
                    to: selectedUser,
                    mes: (JSON.stringify({ type: TypeMess.PIN, data: { id: idPin, title: title, content: content, importance: importance } }))
                },
            }
        }))
        onPin(idPin, title, content, importance);
        onClose();
        setTitle('');
        setContent('');
        setImportance('medium');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Ghim Thông Báo</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề ngắn
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-1 border  rounded-md "
                            required
                            maxLength={50}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nội dung
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-1 border  rounded-md "
                            rows={3}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mức độ quan trọng
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="importance"
                                    value="low"
                                    checked={importance === 'low'}
                                    onChange={() => setImportance('low')}
                                    className="mr-2"
                                />
                                Thấp
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="importance"
                                    value="medium"
                                    checked={importance === 'medium'}
                                    onChange={() => setImportance('medium')}
                                    className="mr-2"
                                />
                                Trung bình
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="importance"
                                    value="high"
                                    checked={importance === 'high'}
                                    onChange={() => setImportance('high')}
                                    className="mr-2"
                                />
                                Cao
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md "
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md "
                        >
                            Ghim
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PinMessageModal;
