import React, { useRef, useEffect, useState } from "react";
import './StyleCallPage/CallPage.scss';
import CallPageFoodter from './UI/CallPageFoodter';
import firebaseDb from '../../sever/firebase';
import { useHistory, Link } from 'react-router-dom';

import Participants from "./UI/Participants";
import { connect } from "react-redux";
import { setMainStream, updateUser } from "../../store/actioncreator";
import Messenger from "./UI/Messenger";
import Record from "./UI/Record";
import useScreenRecorder from "use-screen-recorder";
import { ReactMediaRecorder } from "react-media-recorder";
import { ref, onValue, orderByChild, push, set, onChildChanged, onChildAdded, child, onDisconnect, remove } from '@firebase/database';


const CallPage = (props) => {

    const roomID = window.location.pathname.replaceAll('/', '');
    const checkSize = ref(firebaseDb, `${roomID}/status`);
    const history = useHistory()

    const {
        startRecording,
        pauseRecording,
        blobUrl,
        resetRecording,
        resumeRecording,
        status,
        stopRecording,
    } = useScreenRecorder({ audio: true }) ;


    const participantRef = useRef(props.participants);

    const onMicClick = (micEnabled) => {
        if (props.stream) {
            props.stream.getAudioTracks()[0].enabled = micEnabled;
            props.updateUser({ audio: micEnabled });
        }
    };
    const onVideoClick = (videoEnabled) => {
        if (props.stream) {
            props.stream.getVideoTracks()[0].enabled = videoEnabled;
            props.updateUser({ video: videoEnabled });
        }
    };

    useEffect(() => {
        participantRef.current = props.participants;
    }, [props.participants]);

    const updateStream = (stream) => {
        for (let key in participantRef.current) {
            const sender = participantRef.current[key];
            if (sender.currentUser) continue;
            const peerConnection = sender.peerConnection
                .getSenders()
                .find((s) => (s.track ? s.track.kind === "video" : false));
            peerConnection.replaceTrack(stream.getVideoTracks()[0]);
        }
        props.setMainStream(stream);
    };

    const onScreenShareEnd = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });

        localStream.getVideoTracks()[0].enabled = Object.values(
            props.currentUser
        )[0].video;

        updateStream(localStream);

        props.updateUser({ screen: false });
    };

    const onScreenClick = async () => {
        let mediaStream;
        if (navigator.getDisplayMedia) {
          mediaStream = await navigator.getDisplayMedia({ video: true });
        } else if (navigator.mediaDevices.getDisplayMedia) {
          mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
        } else {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { mediaSource: "screen" },
          });
        }
    
        mediaStream.getVideoTracks()[0].onended = onScreenShareEnd;
    
        updateStream(mediaStream);
    
        props.updateUser({ screen: true });
      };

  
    let irecord =false
    const [record,setrecord]=useState(false);
    useEffect(() => {
       if(irecord){
           setrecord(true);
       }
    },[]);
    // const recordclick = () => {
    //    setrecord(false);

    // };
    
    const [messenger, setMessenger] = useState(false);  
    const sms = false;
    useEffect(() => {
        if (sms) {
            setMessenger(true);
        }
    }, []);

    useEffect(() => {
        try {
            onValue(checkSize, (snapshot) => {
                console.log(snapshot.val());
                if (snapshot.val() == false) {
                    history.push(`/`);
                }
            }, {
                onlyOnce: false
            })
        } catch (e) {

        }
    }, []);


    return (
        <div className="callpage-container">
            {/* <video className="aaa" src="" controls></video> */}

            <div className="main-screen">
                <Participants />
            </div>
            {/* <CallPageHeader /> */}
            <CallPageFoodter
             onScreenClick={onScreenClick}
                onMicClick={onMicClick}
                onVideoClick={onVideoClick}
                setMessenger = {setMessenger}
                messenger = {messenger}
                setrecord={setrecord}
                record ={record} />
                  {messenger && <Messenger />}
            {/* {isAdim && meetInfoPopup &&
                // <MeetingInfo setMeetInfoPopup={setMeetInfoPopup} a={meetInfoPopup} url={url} />}
            <Messenger /> */}
            {record && <Record startRecording={startRecording} blobUrl={blobUrl} resetRecording={resetRecording} status={status} stopRecording={stopRecording} />}
            

        </div>
        
    )
    
}


const mapStateToProps = (state) => {
    return {
        stream: state.mainStream,
        participants: state.participants,
        currentUser: state.currentUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMainStream: (stream) => dispatch(setMainStream(stream)),
        updateUser: (user) => dispatch(updateUser(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CallPage);