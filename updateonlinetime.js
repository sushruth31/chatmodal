import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export default function updateOnlineTime(userInfo) {
  const { uid } = userInfo;

  if (uid) setDoc(doc(db, "usersonline", uid), { ...userInfo, _lastonline: new Date().getTime() }, { merge: true });
}
