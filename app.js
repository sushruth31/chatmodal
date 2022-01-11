import useInterval from "./Components/useInterval.js";
import updateOnlineTime from "./updateonlinetime.js";
import { useEffect } from "react";
import { useUser } from "./Components/useUser.jsx";


function App() {
  const userInfo = useUser();

  useEffect(() => {
    updateOnlineTime(userInfo);
  }, [userInfo]);

  useInterval(() => updateOnlineTime(userInfo), 1200000, false, [userInfo]);
  
  return "rest of your app content"
  
}
