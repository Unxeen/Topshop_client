import React, { useEffect, useRef } from 'react';

const ClickOutside = ({ onClickOutside, children }) => {
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            onClickOutside();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={ref}>
            {children}
        </div>
    );
};

export default ClickOutside;
