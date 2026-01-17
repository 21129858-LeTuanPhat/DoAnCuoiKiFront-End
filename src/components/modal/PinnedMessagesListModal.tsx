import React, { useState, useEffect } from 'react';
import { X, Pin, Trash2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface PinnedMessage {
    id: string;
    title: string;
    content: string;
    importance: 'low' | 'medium' | 'high';

}

interface PinnedMessagesListModalProps {
    isOpen: boolean;
    onClose: () => void;
    messages: PinnedMessage[];
    onUnpin: (id: string) => void;
}

const PinnedMessagesListModal: React.FC<PinnedMessagesListModalProps> = ({ isOpen, onClose, messages, onUnpin }) => {
    if (!isOpen) return null;

    const getImportanceIcon = (importance: string) => {
        switch (importance) {
            case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'high': return 'bg-red-50 border-red-100';
            case 'medium': return 'bg-yellow-50 border-yellow-100';
            default: return 'bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            <div className="relative bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">

                <div className="py-2 px-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">

                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Thông báo</h2>
                            <p className="text-sm text-gray-500">{messages.length} tin nhắn</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto py-2 px-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Không có tin nhắn nào được ghim
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`py-2 px-4 rounded-xl border ${getImportanceColor(msg.importance)}  group`}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex gap-3 flex-1">
                                        <div className="mt-1">
                                            {getImportanceIcon(msg.importance)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                                {msg.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                                {msg.content}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onUnpin(msg.id)}
                                        className="p-2 text-gray-400 text-red-500 bg-red-50 rounded-lg  opacity-0 opacity-100"
                                        title="Bỏ ghim"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PinnedMessagesListModal;
