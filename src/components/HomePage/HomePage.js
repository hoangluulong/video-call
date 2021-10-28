import { useHistory, Link } from 'react-router-dom';
import { faKeyboard, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './HomePage.scss'
import { Card, Button, Alert } from "react-bootstrap"
import shortid from "shortid";
import Header from './Header/Header';
import React, { useState } from "react"
import ListCall from './ListCall/ListCall';
import { useAuth } from "../../contexts/AuthContext"
import  databasedb from '../../sever/firebase'
import { ref ,child, onChildAdded, onChildChanged, onValue, update, push, set} from '@firebase/database';

const HomePage = () => {
    // const history = useHistory();
    const startCall = () => {
        const uid = shortid.generate();
        const status = ref(databasedb, uid);
        set(status, {
            status: true
        })
        history.push(`/${uid}#init`);
    }

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    const id = currentUser.email.replaceAll('.' , '_').replaceAll('@', '_');

    const db = ref(databasedb, 'users/'+id+'/username');
    let name = null;

    onValue(db, (snap) => {
        name = snap.val();
    });

    return (
        <div className="home-page">
            <Header />
            <div className="body">
                <div className="left-side">

                    <div className="content">
                        <h2>App video call</h2>
                        <p>
                            Họp free
                        </p>
                        <div className="action-btn">
                            <button className="btn green" onClick={startCall}>
                                <FontAwesomeIcon className="icon-block" icon={faVideo} />
                                Cuộc họp mới
                            </button>
                            <div className="input-block">
                                <div className="input-section">
                                    <FontAwesomeIcon className="icon-block" icon={faKeyboard} />
                                    <input placeholder="Enter a code or link" />
                                </div>
                                <button className="btn no-bg" >Join</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-side">
                    <ListCall />
                    <button>Add</button>
                </div>
            </div>
        </div>
    )
}

export default HomePage;