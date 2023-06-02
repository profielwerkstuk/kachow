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
    return (await getDoc(doc(firebase, "remoteConfig/tunnelInfo"))).data()?.urls
}

async function uploadToServer(activationFunction: string, addNodeMR: number, populationSize: number, addConnectionMR: number, removeNodeMR: number, removeConnectionMR: number, changeWeightMR: number, c1: number, c2: number, c3: number, compatibilityThreshold: number, lastTimeActivated: number) {
  let attempt = 0;
  let finished = false;

  const baseurls = await getServerURL();

  while (!finished) {
    try {
      const url = `${baseurls[attempt]}/?activationFunction=${activationFunction}&addNodeMR=${addNodeMR}&populationSize=${populationSize}&addConnectionMR=${addConnectionMR}&removeNodeMR=${removeNodeMR}&removeConnectionMR=${removeConnectionMR}&changeWeightMR=${changeWeightMR}&c1=${c1}&c2=${c2}&c3=${c3}&compatibilityThreshold=${compatibilityThreshold}`;
      const response = await fetch(url);
      console.log(await response.json());
      finished = true;
      return "Uw netwerk is geupload";
    } catch (e) {
      attempt++;
      if (attempt - 1 > baseurls.length) {
        finished = true;
        lastTimeActivated = 0;
        localStorage.setItem('lastTimeActivated', lastTimeActivated.toString());
        return "Er is iets mis gegaan tijdens het uploaden van uw netwerk";
      }
    }
  }
  
  return "Uw netwerk kon niet geupload worden";
}

export { firebase, uploadToServer };