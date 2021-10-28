import { faCommentAlt, faPaperPlane, faTimes, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemChat from './ItemChat'
import databasedb from '../../../sever/firebase';
import { useAuth } from "../../../contexts/AuthContext";
import { ref, onValue, orderByChild, push, set, onChildChanged, onChildAdded, child, onDisconnect, remove } from '@firebase/database';
import { useEffect, useState } from "react";
import '../StyleCallPage/Messenger.scss';

const Messenger = () => {

    const roomID = window.location.pathname.replaceAll('/', '');

    const { currentUser } = useAuth();
    const id_user = currentUser.email.replaceAll('.', '_').replaceAll('@', '_');
    const db = ref(databasedb, 'users/' + id_user + '/username');
    let username = null;

    onValue(db, (snap) => {
        username = snap.val();
    });

    const [inputValue, setInputValue] = useState("");

    const onChangeHandler = event => {
        setInputValue(event.target.value);
    };

    const dbRef = ref(databasedb, `${roomID}/message`);
    const checkSize = ref(databasedb, `${roomID}/participants`);

    const [chatHistory, setChatHistory] = useState([]);

    const sent = () => {
        if (inputValue !== "") {
            const newPost = push(dbRef);
            let today = new Date();
            let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            set(newPost, {
                username,
                time: time,
                message: inputValue
            });
        }

        setInputValue("");
    }

    const listItems = chatHistory.map((number) =>
        <ItemChat key={number.key} username={number.username} message={number.message} time={number.time} />
    )

    useEffect(() => {
        try {
            onValue(checkSize, (snapshot) => {
                let i = 0;
                snapshot.forEach((childSnapshot) => {
                    i ++;
                });
                if (i == 1) {
                    const onDisconnectRef = onDisconnect(dbRef);
                    onDisconnectRef.remove();
                }
            }, {
                onlyOnce: false
            })
            onValue(dbRef, (snapshot) => {
                let childData = [];
                snapshot.forEach((childSnapshot) => {
                    childData.push(childSnapshot.val());
                });
                setChatHistory(childData);
            }, {
                onlyOnce: false
            })
        } catch (e) {

        }
    }, []);


    return (
        <div className="messenger-container">
            <div className="messenger-header">
            </div>
            <div className="messenger-header-tabs">
                {/* <div className="tab">
                    <FontAwesomeIcon className="icon" icon={faUserFriends} />
                    <p>Thành viên (10)</p>
                </div> */}
                <div className="tab active">
                    <FontAwesomeIcon className="icon" icon={faCommentAlt} />
                    <p>Tin nhắn</p>
                </div>


            </div>

            {/* item */}
            <div className="chat-section">
                {listItems}
            </div>


            <div className="send-msg-section">
                <input type="text" placeholder="Send a message to everyone" onChange={onChangeHandler} value={inputValue} />
                <FontAwesomeIcon className="icon" icon={faPaperPlane} onClick={sent} />
            </div>
        </div>
    )
}

export default Messenger;