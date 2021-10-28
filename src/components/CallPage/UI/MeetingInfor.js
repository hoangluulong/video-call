import { faCopy, faShieldAlt, faTimes, faUser, faUserFriends, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../StyleCallPage/MeetingInfor.scss';


const MeetingInfo = ({ setMeetInfoPopup, url }) => {
    return (
        <div className="meeting-info-block">
            <div className="meeting-header">
                <h3>Cuộc họp đã sẵn sàng</h3>
                <FontAwesomeIcon className="icon" icon={faTimes} onClick={() =>  {setMeetInfoPopup(false)
                }} />
            </div>
            <button className="add-people-btn">
                <FontAwesomeIcon className="icon" icon={faUserPlus} />
                Thêm thành viên
            </button>
            <p className="info-text">
                chia sẻ cuộc họp
            </p>
            <div className="meet-link">
                <span>
                    {url}
                </span>
                <FontAwesomeIcon className="icon" icon={faCopy} onClick={() => navigator.clipboard.writeText(url)}/>
            </div>
            <p className="small-text">Tham gia bằng hoanghuulong.krn@gmail.com</p>
        </div>
    )
}

export default MeetingInfo;