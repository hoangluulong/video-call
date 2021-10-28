import { useAuth } from "././contexts/AuthContext";
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { ref, push, onValue, set, child, onChildAdded, onChildChanged, onChildRemoved, onDisconnect } from '@firebase/database';
import databasedb from "./sever/firebase";
import CallPage from "./components/CallPage/CallPage";
import {
  setMainStream,
  addParticipant,
  setUser,
  removeParticipant,
  updateParticipant,
} from "./store/actioncreator";
import { connect } from "react-redux";

function Meet(props) {
  const history = useHistory();
  let { id } = useParams();
  const isAdim = window.location.hash == "#init" ? true : false;
  const url = `${window.location.origin}${window.location.pathname}`;

  const { currentUser } = useAuth();
  const id_user = currentUser.email.replaceAll('.', '_').replaceAll('@', '_');

  const db = ref(databasedb, 'users/' + id_user + '/username');
  let username = null;

  onValue(db, (snap) => {
    username = snap.val();

  });

  if (currentUser) {

  } else {
    history.push(`/login/${id}`);
  }

  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    return localStream;
  };

  useEffect(async () => {

    const stream = await getUserStream();
    stream.getVideoTracks()[0].enabled = false;
    props.setMainStream(stream);

    onValue(connectedRef, (snap) => {
      if (snap.val()) {
        const defaultPreference = {
          audio: false,
          video: false,
          screen: false,
        };

        console.log(username);

        const newPost = push(participantRef);
        set(newPost, {
          userName : username,
          preferences: defaultPreference,
        })

        props.setUser({
          [newPost.key]: { name: username, ...defaultPreference },
        });

        // Xóa người dùng khi ngắt kết nối
        onDisconnect(newPost).remove();
      }
    });
  }, []);

  const connectedRef = ref(databasedb, ".info/connected");
  const participantRef = ref(databasedb, id + "/participants");


  const isUserSet = !!props.user;
  const isStreamSet = !!props.stream;

  useEffect(() => {
    if (isStreamSet && isUserSet) {
      onChildAdded(participantRef, (snap) => {
        onChildChanged(child(participantRef, snap.key + "/preferences"), (preferenceSnap) => {
          props.updateParticipant({
            [snap.key]: {
              [preferenceSnap.key]: preferenceSnap.val(),
            },
          });
        });
        const { userName: name, preferences = {} } = snap.val();
        props.addParticipant({
          [snap.key]: {
            name,
            ...preferences,
          },
        });
      });

      onChildRemoved(participantRef, (snap) => {  
        props.removeParticipant(snap.key);
      });
    }
  }, [isStreamSet, isUserSet]);


  return (
    <div>
      <CallPage />
    </div>
  );


}


const mapStateToProps = (state) => {

  return {
    stream: state.mainStream,
    user: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {

  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    addParticipant: (user) => dispatch(addParticipant(user)),
    setUser: (user) => dispatch(setUser(user)),
    removeParticipant: (userId) => dispatch(removeParticipant(userId)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meet);