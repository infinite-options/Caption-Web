import React, { useState } from "react";
import "../Styles/Button.css";
import { Link } from "react-router-dom";

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
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <Link to={destination} className="btn-mobile">
      {isSelected ? (
        <button
          style={{ backgroundColor: "red" }}
          className={className}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      ) : (
        <button
          className={className}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      )}
      {/* <button

        // className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        className={className}
        onClick={onClick}
        type={type}
      >
        {children}
      </button> */}
      <br></br>
    </Link>
  );
};

export { Button };
