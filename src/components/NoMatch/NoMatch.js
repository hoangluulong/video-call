import './NoMatch.scss';
import Header from '../HomePage/Header/Header';
import {Link} from "react-router-dom";

const NoMatch = () => {
    return (
        <div className="no-match">
            <Header />
            <div className="no-match_content">
                <h2>Không tồn tại</h2>
                <div className="action-btn">
                    <Link className="btn green" to="/">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NoMatch;