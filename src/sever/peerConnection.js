import databasedb from "./firebase";
import { ref, child, set, update, push, onChildAdded } from "@firebase/database";
import { store } from "../index";


let id = "";
let roomID = "";
const setID = setInterval(() => {
  if (id !== "" && id !== "/") { 
    roomID = id.replaceAll('/', '');
    clearInterval(setID);
    return;
  } else {
  id = window.location.pathname;
  }
}, 1);

export const updatePreference = (userId, preference) => {
  setTimeout(() => {
    update(child(ref(databasedb), `${roomID}/participants/${userId}/preferences`), preference);
  });
};

export const createOffer = async (peerConnection, receiverId, createdID) => {
  const currentParticipantRef = ref(databasedb, roomID + '/participants/' + receiverId + '/offerCandidates');
  const currentParticipantRef2 = ref(databasedb, roomID + '/participants/' + receiverId + '/offers');
  
  peerConnection.onicecandidate = (event) => {
    event.candidate && set(push(currentParticipantRef), { ...event.candidate.toJSON(), userId: createdID });
  };

  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
    userId: createdID,
  };
  await set(push(currentParticipantRef2), { offer });
};

export const initializeListensers = async (userId) => {
  onChildAdded(child(ref(databasedb), roomID + "/participants/"  + userId + "/offers"), async (snapshot) => {
    const data = snapshot.val();
    if (data?.offer) {
      const pc = store.getState().participants[data.offer.userId].peerConnection;
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      await createAnswer(data.offer.userId, userId);
    }
  });

  onChildAdded(child(ref(databasedb), roomID + "/participants/"  + userId +"/offerCandidates"), (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = store.getState().participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  });

  onChildAdded(child(ref(databasedb), roomID + "/participants/"  + userId + "/answers"), (snapshot) => {
    const data = snapshot.val();
    if (data?.answer) {
      const pc =
        store.getState().participants[data.answer.userId].peerConnection;
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  onChildAdded(child(ref(databasedb), roomID + "/participants/"  + userId + "/answerCandidates"), (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = store.getState().participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  });
};

const createAnswer = async (otherUserId, userId) => {
  const pc = store.getState().participants[otherUserId].peerConnection;
  const participantRef1 = child(ref(databasedb), roomID+"/participants/"+otherUserId+"/answerCandidates");
  const participantRef2 = child(ref(databasedb), roomID+"/participants/"+otherUserId+"/answers");
  pc.onicecandidate = (event) => {
    event.candidate && set(push(participantRef1), {...event.candidate.toJSON(), userId: userId});
  };

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
    userId: userId,
  };

  await set(push(participantRef2) ,{ answer });
};