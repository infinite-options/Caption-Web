import React, { useState } from "react";
import "../Styles/Button.css";

export default function Bubbles(props){

    return (
    <ul className="flex-container">
        {props.items.map((value) => (
            <li className="flex-item">
                {value !== "" ? <i className="fas fa-circle fa-3x" style = {{
                    height: "200px",
                    color: "purple"
                }}/> : ""}
                {value}
            </li>
        ))}
    </ul>);
}


