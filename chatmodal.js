import { forwardRef, useState } from "react";
import { getInitalsImg } from "./getInitialsImg";
import { capFirstLetters } from "./capfirstletter";
import ChatMessages from "./chatmessages";
import { useUser } from "./useUser";
import moment from "moment";
import ModalBackDrop from "./modalbackdrop";

const ChatModal = forwardRef(({ usersOnline, unreadObj }, ref) => {
  const { uid: userId } = useUser();
  const [selectedUser, setSelectedUser] = useState();
  const [chatOpen, setChatOpen] = useState(false);

  const closeChat = () => setChatOpen(false);
  const wipeSelectedUser = () => setSelectedUser();

  return (
    <ModalBackDrop>
      <div
        ref={ref}
        style={{
          position: "fixed",
          height: "400px",
          width: "450px",
          backgroundColor: "#f4f4f4",
          zIndex: 6000,
          left: 600,
          top: 100,
          borderRadius: 15,
          padding: 15,
        }}
        className="chatmodal">
        {chatOpen ? (
          <ChatMessages wipeSelectedUser={wipeSelectedUser} closeChat={closeChat} selectedUser={selectedUser} />
        ) : (
          <>
            <div style={{ fontWeight: "bold" }}>Online Contacts</div>
            <div style={{ fontSize: 12 }}>Click on a user to chat</div>
            <ul style={{ width: 320, marginTop: 15 }} className="list-group-flush">
              {usersOnline
                .filter(({ data: { uid } }) => uid !== userId)
                .map(({ data: { firstname, lastname, uid, _lastonline, profilepicsrc } }) => (
                  <li
                    onClick={() => {
                      setChatOpen(true);
                      setSelectedUser({ uid, firstname, lastname, profilepicsrc, _lastonline });
                    }}
                    style={{ marginLeft: -40, backgroundColor: "transparent", cursor: "pointer", width: "150%" }}
                    className="list-group-item">
                    <div className="flex2">
                      <img
                        style={{ borderRadius: 20, marginRight: 15 }}
                        height={40}
                        src={getInitalsImg(firstname[0])}
                      />
                      <div>
                        <div className="bold">
                          {capFirstLetters(
                            `${firstname} ${lastname} ${(new Date().getTime() - _lastonline) / 60000 < 5 ? "🟢" : "🟡"}`
                          )}
                        </div>
                        <div style={{ fontSize: 12 }}>{`Last seen: ${moment(_lastonline).fromNow()}`}</div>
                      </div>
                      {unreadObj[uid] > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            right: 10,
                            backgroundColor: "#669933",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 3,
                            borderRadius: 50,
                            width: 30,
                            color: "white",
                          }}>
                          {unreadObj[uid]}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
    </ModalBackDrop>
  );
});

export default ChatModal;
