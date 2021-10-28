import React, { useEffect, useState, useRef } from 'react'
import { faCopy, faShieldAlt, faTimes, faUser, faUserFriends, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../StyleCallPage/record.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pill from "./Pill";
import useScreenRecorder from "use-screen-recorder";

const Record = ({startRecording,blobUrl,resetRecording,status,stopRecording} ) => {


    const videoRef = useRef();
    return (
        <div className="record">

            <Pill
                style={{ flexGrow: 1 }}
                title="Blob URL"
                value={ blobUrl|| "Waiting..."}

            />
            <div className="buttons">


            </div>

            <div className="row">
                <div className="col-md">
                    {(status === "idle" || status === "error") && (
                        <button className="btn btn-danger" onClick={startRecording}>Start recording</button>
                    )}
                    {(status === "recording" || status === "paused") && (
                        <button className="btn btn-danger" onClick={stopRecording}>Stop recording</button>
                    )}
                    {status === "stopped" && (
                        <button className="btn btn-danger"
                            onClick={() => {
                                resetRecording();

                            }}
                        >
                            Reset recording
                        </button>
                    )}
                </div>
                <div className="col-md">
                    <button className="btn btn-danger"> Record camera</button>
                </div>

            </div>

        </div>


    )

}
export default Record;