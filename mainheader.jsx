import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { MdChat } from "react-icons/md";
import ChatModal from "./chatmodal";
import useWindowClick from "./useWindowClick";
import { db } from "../firebase";
import { collection, orderBy, query, limit } from "firebase/firestore";
import { useCollectionData } from "./useCollectionData";
import { useUser } from "./useUser";

export default function MainHeader({ title, nobackarrow }) {
  const [chatOpen, setChatOpen] = useState(false);
  const iconRef = useRef();
  const modalRef = useRef();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadObj, setunreadObj] = useState({});
  const [usersOnline] = useCollectionData(
    query(collection(db, "usersonline"), orderBy("_lastonline", "desc"), limit(25))
  );
  useWindowClick(() => setChatOpen(false), [iconRef, modalRef]);

  const { uid } = useUser();

  useEffect(() => {
    //get unread count
    const unreadObj = usersOnline.find(({ docid }) => docid === uid)?.data?.unreadMessages;

    if (!unreadObj) return;

    setUnreadCount(Object.values(unreadObj)?.reduce((a, b) => a + b));
    setunreadObj(unreadObj);
  }, [usersOnline]);

  const history = useHistory();
  return (
    <>
      {chatOpen && <ChatModal unreadObj={unreadObj} usersOnline={usersOnline} ref={modalRef} />}
      <div className="mainheadercontainer flex">
        <div className="flex">
          {!nobackarrow && (
            <span onClick={() => history.goBack()} className="material-icons-outlined backbtn">
              arrow_back
            </span>
          )}
          <div className="mainheadertitle">{title}</div>
        </div>
        <div style={{ cursor: "pointer" }} onClick={() => setChatOpen(ps => !ps)} className="flex2" ref={iconRef}>
          <MdChat />
          {unreadCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                backgroundColor: "#669933",
                borderRadius: 50,
                paddingInline: 3,
                width: 25,
                color: "white",
              }}>
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
