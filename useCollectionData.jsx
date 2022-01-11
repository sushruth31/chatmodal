import { useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";

export function useCollectionData(query, dependencies = []) {
  const [data, setData] = useState([]);

  useEffect(
    () =>
      onSnapshot(query, snapshot => {
        setData(
          snapshot.docs.map(doc => {
            return { docid: doc.id, data: doc.data() };
          })
        );
      }),
    dependencies
  );

  return [data];
}
