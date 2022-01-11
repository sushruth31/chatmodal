function App() {
  const userInfo = useUser();

  useEffect(() => {
    updateOnlineTime(userInfo);
  }, [userInfo]);

  useInterval(() => updateOnlineTime(userInfo), 1200000, false, [userInfo]);
  
  return "rest of your app content"
  
}
