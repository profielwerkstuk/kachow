import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC556xEWQ6bn9dXxnND7zn22K_YMjqGG5k",
  authDomain: "ai-profielwerkstuk.firebaseapp.com",
  projectId: "ai-profielwerkstuk",
  storageBucket: "ai-profielwerkstuk.appspot.com",
  messagingSenderId: "458512798569",
  appId: "1:458512798569:web:edd96f8243b2c18a54e3f8"
};

const app = initializeApp(firebaseConfig);

const firebase = getFirestore(app);

async function getServerURL() {
    return (await getDoc(doc(firebase, "remoteConfig/tunnelInfo"))).data()?.url
}

export { firebase, getServerURL };