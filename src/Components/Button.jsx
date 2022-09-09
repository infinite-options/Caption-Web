import React  from "react";
import "../Styles/Button.css";
import {Link} from "react-router-dom";
import {Typography} from '@material-ui/core';

// const STYLES = ["btn--primary", "btn--outline", "btn--test"];

// const SIZES = ["btn--medium", "btn--large"];

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
                    copied,
                }) => {
    // const checkButtonStyle = STYLES.includes(buttonStyle)
    //     ? buttonStyle
    //     : STYLES[0];

    // const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    return (
        <Link to={conditionalLink ? destination : ""} className="btn-mobile" style = {{textDecoration: 'none'}}>
            <button
                className={isSelected ? className + " selected" : className}
                onClick={onClick}
                type={type}
                // children={children}
                
            >
                <div style = {{display: 'flex', flexDirection: 'column', flexGrow: '1'}}>
                    <Typography
                        style={{
                            display:"flex",
                            flexGrow: "1",
                            // textAlign: 'center',
                            // alignItems:"center",
                            justifyContent: 'center',
                            wordBreak: 'break-word',
                        }}
                    >
                        {copied ? 'Copied!' : children}
                        
                    </Typography>
                </div>
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
