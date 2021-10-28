import React from "react";

const ItemChat = ({username, message, time}) => {
    return (
        <div className="chat-block">
            <div className="sender">
                {username} <small>{time}</small>
            </div>
            <p className="msg">{message}</p>
        </div>
    );
}

export default ItemChat;