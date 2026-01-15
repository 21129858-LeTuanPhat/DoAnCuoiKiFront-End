import React, { useEffect } from 'react';
import { useCurrentLocation } from '../Location/CurrentLocation';
import { X, Share2, MapPin } from 'lucide-react';
import WebSocketManager from '../../socket/WebSocketManager';
import { useBoardContext } from '../../hooks/useBoardContext';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
    const { location, error, getLocation } = useCurrentLocation();
    useEffect(() => {
        if (isOpen) {
            getLocation();
        }
    }, [isOpen]);
    const { type, selectedUser } = useBoardContext();
    if (!isOpen) return null;

    const handleShare = () => {
        if (!location) return;
        const [latitude, longitude] = location.split(',').map(Number);
        const ws = WebSocketManager.getInstance();
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: type,
                        to: selectedUser,
                        mes: encodeURIComponent(JSON.stringify({ type: 99, data: { latitude, longitude } })),
                    },
                },
            }),
        );
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        Vị trí hiện tại
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 h-[400px] bg-gray-100 flex items-center justify-center">
                    {error ? (
                        <div className="text-red-500 text-center p-4">
                            <p>{error}</p>

                        </div>
                    ) : location ? (
                        <iframe
                            className="w-full h-full rounded shadow-sm"
                            src={`https://maps.google.com/maps?q=${location}&output=embed`}
                        ></iframe>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p>Đang tải</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">

                    <button
                        onClick={handleShare}
                        className={`flex items-center gap-2 px-4 py-2 text-white rounded shadow-sm font-medium transition ${location
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-300 cursor-not-allowed'
                            }`}
                    >
                        Chia sẻ vị trí
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
