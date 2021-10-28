import './Header.scss';
import { useAuth } from "../../../contexts/AuthContext"
import databasedb from '../../../sever/firebase'
import { useHistory, Link } from 'react-router-dom';
import { ref, child, onChildAdded, onChildChanged, onValue, update, push } from '@firebase/database';
import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap"
import { Dropdown } from 'react-bootstrap';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../../image/logo.png'

const Header = () => {

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    const id = currentUser.email.replaceAll('.', '_').replaceAll('@', '_');

    const db = ref(databasedb, 'users/' + id + '/username');
    let name = null;

    onValue(db, (snap) => {
        name = snap.val();
    });

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push("/login")
        } catch {
            setError("không thể đăng xuất")
        }
    }

    return (
        <div className="header">
            <div className="logo">
                <img src={logo} />
            </div>
            <div className="action-btn">
                <Dropdown>
                    <Dropdown.Toggle className="user-infor" style={{ background: 'while', color: "black" }}>
                    {currentUser.email} <FontAwesomeIcon icon={faUser}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="light">
                        <Dropdown.Item><Link style={{ textDecoration: 'none', color: 'black' }} to="/update-profile" >
                            Update Profile
                        </Link></Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>

                    </Dropdown.Menu>
                </Dropdown>

                {/* <div class="btn-group">
                    <button class="btn btn-secondary btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Large button
                    </button>
                    <div class="dropdown-menu">
                        ...
                    </div>
                </div> */}

                {/* <FontAwesomeIcon className="icon-block" icon={faQuestionCircle} />
                <FontAwesomeIcon className="icon-block" icon={faExclamationCircle} />
                <FontAwesomeIcon className="icon-block" icon={faCog} /> */}
            </div>
        </div>
    )
}

export default Header;