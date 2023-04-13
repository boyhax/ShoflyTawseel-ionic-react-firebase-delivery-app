//firestore collection pagination hook
import { useState, useEffect } from "react";
import {
  Query,
  getDocs,
  startAfter,
  query,
  limit,
} from "firebase/firestore";

export default function useCollectionPagination(
  theQuery: Query,
  limitNum: number
) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setDocuments([]);
    setLastDoc(undefined);
    setHasMore(true);
  }, [theQuery]);

  useEffect(() => {
      setLoading(true);
      const q = query(theQuery, limit(limitNum));
      getDocs(q).then((snapshot) => {
        if (snapshot.docs.length) {
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
          setDocuments((prev) => [...prev, ...snapshot.docs]);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      });
    
  }, [theQuery,limitNum]);
  function getMore() {
    if (hasMore) {
      setLoading(true);
      const q = query(theQuery, startAfter(lastDoc), limit(limitNum));
      getDocs(q).then((snapshot) => {
        if (snapshot.docs.length) {
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
          setDocuments((prev) => [...prev, ...snapshot.docs]);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      });
    }
  }
  return { documents, loading, hasMore, getMore };
}
