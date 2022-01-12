import { capFirstLetters } from "./capfirstletter";
import { MdKeyboardArrowLeft } from "react-icons/md";
import {
  query,
  collection,
  where,
  limit,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useCollectionData } from "./useCollectionData";
import { useUser } from "./useUser";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./loadingspinner";
import { MdSend } from "react-icons/md";
import moment from "moment";
import { rootserverurl } from "./rooturl";
import { getInitalsImg } from "./getInitialsImg";
import updateOnlineTime from "../updateonlinetime";
import useAxios from "./useAxios";

export default function ChatMessages({
  selectedUser: {
    firstname: otherUserFirstName,
    uid: otherUid,
    profilepicsrc: otherUserProfilePic,
    email: otherUserEmail,
  },
  closeChat,
  wipeSelectedUser,
}) {
  const {
    uid,
    profilepicsrc,
    firstname: thisUserFirstName,
    lastname: thisUserLastName,
    email: thisUserEmail,
  } = useUser();
  const axios = useAxios();
  const userInfo = useUser();
  const [messagesFromOtherUser] = useCollectionData(
    query(collection(db, "usersonline", otherUid, "sentMessages"), orderBy("sentTime", "desc"), limit(20))
  );
  const [otherUserData] = useCollectionData(
    query(collection(db, "usersonline"), where("uid", "==", otherUid), limit(1))
  );
  const _lastonline = otherUserData?.[0]?.data?._lastonline;
  const isOtherUserOnline = (new Date().getTime() - _lastonline) / 60000 < 5;
  const [messagesFromThisUser] = useCollectionData(
    query(collection(db, "usersonline", uid, "sentMessages"), orderBy("sentTime", "desc"), limit(20))
  );
  const [allMessages, setAllMessages] = useState();

  const scrollRef = useRef();
  const [loading, setLoading] = useState(false);

  const lastMessageRef = useRef();

  useEffect(() => {
    if (lastMessageRef?.current) lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  useEffect(() => {
    setAllMessages(
      [
        ...messagesFromOtherUser.filter(({ data: { sentTo } }) => sentTo === uid).map(el => ({ ...el, isUser: false })),
        ...messagesFromThisUser
          .filter(({ data: { sentTo } }) => sentTo === otherUid)
          .map(el => ({ ...el, isUser: true })),
      ].sort((a, b) => a?.data?.sentTime?.seconds - b?.data?.sentTime?.seconds)
    );

    //update unreadcount
    setDoc(
      doc(db, "usersonline", uid),
      {
        unreadMessages: { [otherUid]: 0 },
      },
      { merge: true }
    );
  }, [messagesFromOtherUser, messagesFromThisUser]);

  const userInputRef = useRef();

  useEffect(() => {
    if (userInputRef?.current) userInputRef?.current.focus();
  }, []);

  const handleSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    const text = userInputRef.current.value;
    const data = {
      message: text,
      sentFrom: uid,
      sentTo: otherUid,
      sentTime: serverTimestamp(),
    };

    await addDoc(collection(db, "usersonline", uid, "sentMessages"), data);

    updateOnlineTime(userInfo);

    setLoading(false);
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    userInputRef.current.value = "";

    //get count and increment by 1

    const docRef = await getDoc(doc(db, "usersonline", otherUid));
    const docData = docRef.data();

    let count = 1;

    try {
      if (docData?.unreadMessages[uid]) {
        count = docData?.unreadMessages[uid] + 1;
      }
      setDoc(
        doc(db, "usersonline", otherUid),
        {
          unreadMessages: { [uid]: count },
        },
        { merge: true }
      );
    } catch (e) {
      setDoc(
        doc(db, "usersonline", otherUid),
        {
          unreadMessages: { [uid]: count },
        },
        { merge: true }
      );
    }

    if (!isOtherUserOnline) sendEmail(text);
  };

  const sendEmail = async message => {
    const res = await axios("POST", `your api for email`, {
      sender: { fullname: `${thisUserFirstName} ${thisUserLastName}`, email: thisUserEmail },
      recip: { firstname: otherUserFirstName, email: otherUserEmail },
      message: message,
    });

    // console.log(res);
  };

  function UserMsg({
    data: {
      data: { message, sentTime },
    },
    isLastMsg,
  }) {
    return (
      <li
        ref={node => (isLastMsg ? (lastMessageRef.current = node) : null)}
        style={{
          listStyleType: "none",
          backgroundColor: "#669933",
          marginLeft: 170,
          marginBottom: 20,
          borderRadius: 15,
          color: "white",
          padding: 10,
        }}>
        <div className="flex2">
          <img width={40} height={40} style={{ borderRadius: 50, marginRight: 5 }} src={profilepicsrc}></img>
          <div>{message}</div>
        </div>
        <div style={{ fontSize: 10 }}>{`Sent ${moment(sentTime?.seconds * 1000).fromNow()}`}</div>
      </li>
    );
  }

  function OtherUserMsg({
    data: {
      data: { message, sentTime },
    },
    isLastMsg,
  }) {
    return (
      <li
        ref={node => (isLastMsg ? (lastMessageRef.current = node) : null)}
        style={{
          listStyleType: "none",
          backgroundColor: "darkgrey",
          marginRight: 170,
          marginBottom: 20,
          borderRadius: 15,
          color: "white",
          padding: 10,
        }}>
        <div className="flex2">
          <img
            width={40}
            height={40}
            style={{ borderRadius: 50, marginRight: 5 }}
            src={otherUserProfilePic || getInitalsImg(otherUserFirstName)}></img>
          <div>{message}</div>
        </div>
        <div style={{ fontSize: 10 }}>{`Sent ${moment(sentTime?.seconds * 1000).fromNow()}`}</div>
      </li>
    );
  }

  return (
    <>
      <div className="flex2">
        <MdKeyboardArrowLeft
          onClick={() => {
            wipeSelectedUser();
            closeChat();
          }}
          style={{ cursor: "pointer", fontSize: 30 }}
        />
        <div>
          <div style={{ fontWeight: "bold", marginLeft: 10 }}>{`Now Chatting with ${capFirstLetters(
            otherUserFirstName
          )}: `}</div>

          {!isOtherUserOnline && (
            <div style={{ fontSize: 12, marginLeft: 8 }}>User is offline - messages will be sent via email</div>
          )}
        </div>
      </div>
      <ul onScroll={e => null} style={{ padding: 10, width: "100%", height: 275, overflow: "auto" }}>
        {!allMessages ? (
          <div>Loading...</div>
        ) : allMessages.length === 0 ? (
          <div>No Messages</div>
        ) : (
          allMessages.map((data, idx) =>
            data.isUser ? (
              <UserMsg isLastMsg={idx === allMessages.length - 1} data={data} />
            ) : (
              <OtherUserMsg isLastMsg={idx === allMessages.length - 1} data={data} />
            )
          )
        )}
        <div ref={scrollRef}></div>
      </ul>

      <form onSubmit={handleSubmit}>
        <div style={{ width: "100%", display: "flex" }}>
          <input
            style={{ marginRight: 10 }}
            placeholder="Say something"
            className="form-control"
            ref={el => (userInputRef.current = el)}
          />
          <button
            disabled={loading}
            type="submit"
            style={{ borderRadius: 20, backgroundColor: "#669933", borderColor: "#669933" }}
            className="btn btn-primary">
            {loading ? <LoadingSpinner /> : <MdSend />}
          </button>
        </div>
      </form>
    </>
  );
}
