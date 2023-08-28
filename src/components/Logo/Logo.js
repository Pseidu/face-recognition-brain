import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className="Tilt">
                <div className="pa4">
                    <img src={brain} title="brain icon by icons8.com" alt="Logo"/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;