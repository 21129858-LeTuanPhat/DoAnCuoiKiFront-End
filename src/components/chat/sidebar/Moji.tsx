import { Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { BoardContext } from '../Context/BoardProvider';

function Moji() {
    const { darkMode, setDarkMode } = useBoardContext();
    return (
        <div className="w-full flex justify-between items-center p-3 bg-gradient-to-r from-purple-700 to-pink-400 rounded-2xl shadow-md">
            <p className="font-bold text-white">Moji</p>
            <div className="flex space-x-2">
                <Sun size={18} className="text-white" />
                <button
                    className={
                        darkMode === false
                            ? 'relative w-12 h-6 rounded-2xl bg-slate-300 shadow-sm'
                            : 'relative w-12 h-6 rounded-2xl bg-gray-600 shadow-sm'
                    }
                    onClick={() => setDarkMode(!darkMode)}
                >
                    <span
                        className={
                            darkMode === false
                                ? 'absolute w-5 h-5 left-0 top-0.5 bottom-0.5 bg-white rounded-full transition-transform translate-x-0 '
                                : 'absolute w-5 h-5 left-0 top-0.5 bottom-0.5 bg-black rounded-full transition-transform translate-x-7'
                        }
                    ></span>
                </button>

                <Moon size={18} className="text-white" />
            </div>
        </div>
    );
}

export default Moji;
