import React, {useState} from "react";
import "../Styles/Button.css";
import {Link} from "react-router-dom";
import {Typography} from '@material-ui/core';

const STYLES = ["btn--primary", "btn--outline", "btn--test"];

const SIZES = ["btn--medium", "btn--large"];

const Button = ({
                    className,
                    children,
                    type,
                    onClick,
                    buttonStyle,
                    buttonSize,
                    destination,
                    isSelected,
                    conditionalLink,
                }) => {
    const checkButtonStyle = STYLES.includes(buttonStyle)
        ? buttonStyle
        : STYLES[0];

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    return (
        <Link to={conditionalLink ? destination : ""} className="btn-mobile">
            <button
                className={isSelected ? className + " selected" : className}
                onClick={onClick}
                type={type}
                // children={children}
                // style={{border: "10px solid green"}}
                
            >
                <Typography noWrap 
                style={{
                    display:"flex",
                    flexGrow: "1",
                    alignItems:"center",
                    // border: "10px solid red"
                  }}
                >
                <div style={{}}>{children}</div>
                    
                </Typography>
            </button>

            {/*className={`btn ${checkButtonStyle} ${checkButtonSize}`}*/}
            {/*className={className}*/}
            {/*onClick={onClick}*/}
            {/*type={type}*/}

            <br/>
        </Link>
    );
};

export {Button};
