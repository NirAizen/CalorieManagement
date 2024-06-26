import React, { useState, useEffect } from 'react';
import './teamCss.css'
const Team = () => {
    const useTypewriter = (text, speed = 50) => {
        const [displayText, setDisplayText] = useState('');

        useEffect(() => {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(prevText => prevText + text.charAt(i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, speed);

            return () => {
                clearInterval(typingInterval);
            };
        }, [text, speed]);

        return displayText;
    };

    const text = "  Naama Rizel\n" +
        "ID:315585661\n" +
        "Nir Aizen\n" +
        "ID:313262537";
    const speed = 50;
    const displayText = useTypewriter(text, speed);

    return (
        <div>
            <h1>Team Members:</h1>
            <h2>{displayText}</h2>
        </div>
    );
};

export default Team;
