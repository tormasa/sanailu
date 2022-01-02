import React from 'react';
import './button.css';

export const Button = ({
    children,
    onClick
}) => {
    return (
        <button onClick={onClick}>
            {children}
        </button>
    );
};