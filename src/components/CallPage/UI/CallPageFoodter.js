import {
    faAngleUp, faDesktop, faMicrophone,
    faVideo,
    faVideoSlash,
    faMicrophoneSlash,
    faPhone,faRecordVinyl,faStop,faSms
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../StyleCallPage/CallPageFoodter.scss';
import React, { useEffect, useState } from "react";

const CallPageFoodter = (props) => {

    const [streamState, setStreamState] = useState({
        mic: true,
        video: false,
        screen: false,
    });
    const micClick = () => {
        setStreamState((currentState) => {
            return {
                ...currentState,
                mic: !currentState.mic,
            };
        });
    };
    const recordclick = () => {
        if(props.record){
            props.setrecord(false);
        }
        else{props.setrecord(true);}
      
    };
    const onScreenClick = () => {
      props.onScreenClick(setScreenState);
    };

  const setScreenState = (isEnabled) => {
      setStreamState((currentState) => {
        return {
          ...currentState,
          screen: isEnabled,
        };
      });
    };

    const onVideoClick = () => {
        setStreamState((currentState) => {
            return {
                ...currentState,
                video: !currentState.video,
            };
        });
    };
  

    useEffect(() => {
        props.onMicClick(streamState.mic);
    }, [streamState.mic]);
    useEffect(() => {
        props.onVideoClick(streamState.video);
    }, [streamState.video]);

    const setMessengerClick = () => {
        if (props.messenger){
            props.setMessenger(false);
        }else {
            props.setMessenger(true);
        }
    }

    return (
        <div className="foodter-item">
            <div className="center-item">
                <div className={"icon-block"}
                    data-tip={streamState.mic ? "Mute Audio" : "Unmute Audio"}
                    onClick={micClick}>
                    <FontAwesomeIcon className="icon" icon={!streamState.mic ? faMicrophoneSlash : faMicrophone}
                        title="Mute" />
                </div>
                <div className={"icon-block"}
                    data-tip={streamState.video ? "Hide Video" : "Show Video"}
                    onClick={onVideoClick}>
                    <FontAwesomeIcon className="icon" icon={!streamState.video ? faVideoSlash : faVideo} />
                </div>
    
                <div className="icon-block" data-tip={streamState.video ? "Hide Video" : "Show Video"}
                 onClick={onScreenClick}
                >
                
                    <FontAwesomeIcon className="icon" icon={faDesktop} />
                </div>
                <div className="icon-block">
                    <FontAwesomeIcon className="icon red" icon={faPhone} />
                </div>
                
                <div className="icon-block"  onClick={recordclick}>
                    
                    <FontAwesomeIcon className="icon red" icon={faRecordVinyl} />
                </div>
                <div>
        </div>

            </div>

            <div className="right-item">
                <div className="icon-block" 
                    onClick={setMessengerClick}>
                    <FontAwesomeIcon className="icon" icon={faSms} />
                </div>
            </div>
        </div>
    )
}

export default CallPageFoodter;