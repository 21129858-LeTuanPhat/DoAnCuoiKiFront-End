import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

function Moji() {
    const [dark, setDark] = useState(false);

    return (
        <div className="w-full flex justify-between items-center p-3 bg-gradient-to-r from-purple-700 to-pink-400 rounded-2xl shadow-md">
            <p className="font-bold text-white">Moji</p>
            <div className="flex space-x-2">
                <Sun size={18} className="text-white" />
                <button className="relative w-12 h-6 rounded-2xl bg-slate-300 shadow-sm" onClick={() => setDark(!dark)}>
                    <span
                        className={`absolute w-5 h-5 left-0 top-0.5 bottom-0.5 bg-white rounded-full 
                        transition-transform ${dark ? 'translate-x-7' : 'translate-x-0'}`}
                    ></span>
                </button>

                <Moon size={18} className="text-white" />
            </div>
        </div>
    );
}

export default Moji;
