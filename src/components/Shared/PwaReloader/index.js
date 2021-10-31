import React, { Fragment } from "react";
import { messaging } from "../../../init-fcm";
import * as firebase from 'firebase';
export const PwaReloader = () => {

    const versionRef = firebase.database().ref('AppVersion');
    if (versionRef) {
        versionRef.on('value', snapshot => {
            const getVersion = snapshot.val();
            
            if (localStorage.getItem('version') === null || localStorage.getItem('version') !== getVersion.version) {
                window.location.reload()
                localStorage.setItem('version', getVersion.version)
            }
            //
        })

    }
    return (
        <React.Fragment>

        </React.Fragment>
    )
}
