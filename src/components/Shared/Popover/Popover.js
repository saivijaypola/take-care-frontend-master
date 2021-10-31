import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Popover.css'


export default function PopOver(props) {

   
    const { title, description, type, text, info } = props
    return (
        <div className="outer-shadow">
            <div className={type === "top" ? "pop" : "pop-right"}>
                <h3>{text}</h3>
                <p className="lookodu-zone stick-left">{description}</p>
                <span  className="pop-over-continue-btn">Click to continue</span>
            </div>
        </div>
    )
}