import { Photo } from "@capacitor/camera";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import useCollectionPagination from "../hooks/useCollectionPagination";
import { UserProfile } from "../types";

interface Props {
  chats: any;
  unreadMessages: number;
  chatItems:chatItem[]
}
const initialProps: Props = { chats: null, unreadMessages: 0 ,chatItems:[]};

export const context = createContext<Props>(initialProps);

export default function ChatProvider(props: {
  children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User | null>();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chats, loading, error] = useCollection(
    query(
      collection(getFirestore(), "chats"),
      where("chaters", "array-contains", user ? user.uid : "null")
    )
  );
  
  const {items:chatItems} = useChatItems(chats);

  useEffect(() => {
    if (!chats || chats.empty) return;
    chats.forEach((snap) => {
      getCountFromServer(
        query(
          collection(getFirestore(), "chats/" + snap.id + "/messages"),
          where("isRead", "==", false)
        )
      ).then((data) => setUnreadMessages(unreadMessages + data.data().count));
    });
  }, [chats]);

  useEffect(() => {
    return onAuthStateChanged(getAuth(), (user) => {
      setUser(user);
    });
  }, []);

  return (
    <context.Provider value={{ chats, unreadMessages,chatItems }}>
      {props.children}
    </context.Provider>
  );
}
export const useChat = () => {
  const {chats,chatItems,unreadMessages} = useContext(context);

  async function getChatIdWithUser(userId:string){
    var snap  
    if(chats || !chats.empty){ snap =chats.docs.find((doc:any)=>doc.data().chaters.includes(userId))}
      if(snap) return snap.id
      else{
        const newchatId = await startChatWithUserIfExist(userId)
        return newchatId? newchatId: null
      }

  }
  async function startChatWithUserIfExist(userId:string){
    
      let thisUserUid = getAuth().currentUser?.uid
      const chat = await addDoc(collection(getFirestore(),"chats"),{chaters:[thisUserUid,userId],})
      const message :MessageProps={
        data:'',
        isRead  :false,
        time:new Date(),
        from:thisUserUid!,
        iconURL:'',
        name:'',
        text:'hello',
      }
       addDoc(collection(getFirestore(),"chats/"+chat.id+"/messages"),message)
      return chat.id
    
     
  }
  
  
  return {unreadMessages,chatItems,getChatIdWithUser}
};

type chatItem = {
  id: string;
  icon: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadMessages: number;
};
export const useSingleChatItem = (chatId: string) => {
  const [item, setItem] = useState<Pick<chatItem, "icon" | "name" | "id">>({
    icon: "",
    id: chatId,
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"no profile found" | "no chat found" | "">(
    ""
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    const getItem = async () => {
      const document = await getDoc(doc(getFirestore(), "chats/" + chatId));
      if (!document.exists()) {
        setError("no chat found");
        return;
      }
      let userUID = getAuth().currentUser?.uid;
      let otherChaterId = document
        ? document
            .data()
            ?.chaters.filter((chaterId: string) => chaterId !== userUID)[0]
        : null;
      otherChaterId && (await getItemData(chatId, otherChaterId));

      return;
    };
    getItem().finally(() => setLoading(false));
  }, [chatId]);

  async function getItemData(chatId: string, profile_id: string) {
    const profileData = await getDoc(
      doc(getFirestore(), "users/" + profile_id)
    ).then((snap) =>
      snap.exists()
        ? (snap.data() as UserProfile)
        : setError("no profile found")
    );
      var item
    if (!profileData) {
      item = {
        icon: ``,
        id: chatId,
        name: "",
      };
    }else{
      item = {
        icon:  profileData.photoURL ,
        id: chatId,
        name:  profileData.name,
      };
    }
    
    item && setItem(item);
  }

  return { item, loading, error };
};
export const useChatItems = (chats:any) => {
  const [items, setItems] = useState<chatItem[]>([]);

  useEffect(() => {
    setItems([]);
    chats &&
      chats.forEach((snap: any) => {
        let userUID = getAuth().currentUser?.uid;
        let otherChater =
          snap
            .data()
            .chaters.filter((chaterId: string) => chaterId !== userUID)[0] ||
          null;
        otherChater && getItemData(snap.id, otherChater);
      });

    chats || setItems([]);
  }, [chats]);

  async function getItemData(chatId: string, profile_id: string) {
    const unreadMessagesCount = await getCountFromServer(
      query(
        collection(getFirestore(), "chats/" + chatId + "/messages"),
        where("isRead", "==", false)
      )
    ).then((data) => data.data().count);
    const profileData = await getDoc(
      doc(getFirestore(), "users/" + profile_id)
    ).then((snap) => snap.data() as UserProfile);
    const lastMessageData = await getDocs(
      query(
        collection(getFirestore(), "chats/" + chatId + "/messages"),
        orderBy("time", "desc"),
        limit(1)
      )
    ).then((snaps) => !snaps.empty && (snaps.docs[0].data() as MessageProps));

    let Item: chatItem = {
      icon: profileData.photoURL,
      id: chatId,
      lastMessage: lastMessageData ? lastMessageData.text : "",
      lastMessageTime: lastMessageData
        ? new Date(lastMessageData.time.seconds * 1000)
        : new Date(),
      name: profileData.name,
      unreadMessages: unreadMessagesCount,
    };
    Item && setItems([...items, Item]);
  }

  return { items };
};
type MessageProps = {
  iconURL: string;
  name: string;
  time: any;
  text: string;
  data: any;
  from: string;
  isRead?: boolean;
};
export const useMessages = (chatId: string) => {
  const chatItem = useSingleChatItem(chatId);
  const thisUserUid = getAuth().currentUser?.uid;
  const pagination = useCollectionPagination(
    query(
      collection(getFirestore(), "chats/" + chatId + "/messages"),
      orderBy("time", "desc"),
      limit(10)
    )
  );
    useEffect(() => {
      if(pagination.items){
        pagination.items.forEach((item) => {

          if (item.exists()&& !item.data().isRead && item.data().from !== thisUserUid) {
            setMessageViewed(item.ref);
          }
        });
      }

    }, [pagination.items]);
  async function sendMessage(data: MessageProps, photo: null | Photo) {
    if (!chatId) return;

    var url = "";
    try {
      if (photo && photo.base64String) {
        const reff = ref(
          getStorage(),
          `chat/${chatId}/${new Date().toISOString()}.${photo.format}`
        );
        uploadBytes(reff, b64toBlob(photo.base64String, "base64", 210));
        url = await getDownloadURL(reff);
      } else {
        console.log("photo shall be base64String only ");
      }

      addDoc(collection(getFirestore(), "chats/" + chatId + "/messages"), {
        ...data,
        data: url,
      });
      return true;
    } catch (error) {
      return error;
    }
  }
  function setMessageViewed(messageRef:DocumentReference){
    updateDoc(messageRef,{isRead:true})
  }
  return { ...pagination, sendMessage,chatItem,setMessageViewed };
};

//# data64 converter to blob data
export function b64toBlob(
  b64Data: string,
  contentType: any,
  sliceSize: number
) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
