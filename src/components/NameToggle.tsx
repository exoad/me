import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NameToggleProps {
    names: string[][];
}

export default function NameToggle({ names }: Readonly<NameToggleProps>) {
    const [nameIndex, setNameIndex] = useState(0);
    const navigate = useNavigate();

    return (
        <button
            className="text-white text-lg md:text-xl font-bold font-playfair cursor-pointer hover:scale-105 transition-transform duration-300 bg-transparent border-none"
            style={{
                textShadow: `2px 2px ${names[nameIndex][1]}`,
                paddingBottom: '0.25rem'
            }}
            onClick={() => {
                setNameIndex((nameIndex + 1) % names.length);
                navigate('/');
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    setNameIndex((nameIndex + 1) % names.length);
                    navigate('/');
                }
            }}
        >
            {names[nameIndex][0]}
        </button>
    );
}
