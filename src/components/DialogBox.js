import React from 'react'
import "../styles/DialogBox.css"

export default function Dialog({ show, title, description, confirm, cancel }) {

    if (! show) {
        return <></>;
    }

    return (
        <div className="overlay">
            <div className="dialog">
                <div className="dialog__content">
                    <h2 className="dialog__title">{title}</h2>
                    <p className="dialog__description">{description}</p>
                </div>
                <hr />
                <div className="dialog__footer">
                    <button onClick={cancel} className="dialog__cancel">Cancel</button>
                    <button onClick={confirm} className="dialog__confirm">Yes, delete it</button>
                </div>
            </div>
        </div>
    )
}