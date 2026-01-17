import React, { useState } from 'react';
import { X, AlertCircle, Info, AlertTriangle, ChevronRight, List } from 'lucide-react';

interface PinnedMessage {
    id: string;
    title: string;
    content: string;
    importance: 'low' | 'medium' | 'high';
}

interface PinMessageDisplayProps {
    messages: PinnedMessage[];
    onOpenList: () => void;
}

const PinMessageDisplay: React.FC<PinMessageDisplayProps> = ({ messages, onOpenList }) => {
    const latestMessage = messages[messages.length - 1];

    if (!latestMessage) return null;

    const getStyles = () => {
        switch (latestMessage.importance) {
            case 'high':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-800',
                    icon: <AlertCircle className="w-5 h-5 text-red-600" />
                };
            case 'medium':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    text: 'text-yellow-800',
                    icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />
                };
            case 'low':
            default:
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-800',
                    icon: <Info className="w-5 h-5 text-blue-600" />
                };
        }
    };

    const styles = getStyles();

    return (
        <div className={`w-full px-4 py-2 ${styles.bg} border-b `}>
            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={onOpenList}
            >
                <div className="flex items-center gap-3 flex-1">

                    <div className="flex flex-col">
                        <div className={`font-semibold text-sm ${styles.text} flex items-center gap-2`}>
                            {latestMessage.title}
                            <span className="text-xs font-normal opacity-75 border px-1 rounded border-current">
                                {latestMessage.importance === 'high' ? 'Cao' : latestMessage.importance === 'medium' ? 'Trung bình' : 'Thấp'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`p-1 rounded-full ${styles.text}`}>
                    <List size={20} />
                </div>
            </div>
        </div>
    );
};

export default PinMessageDisplay;
