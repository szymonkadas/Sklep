// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore
} from "firebase/firestore/lite";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFXNIebzOMHMwjLXllW0odENh63DLFJjo",
  authDomain: "wordpress-store-1c240.firebaseapp.com",
  projectId: "wordpress-store-1c240",
  storageBucket: "wordpress-store-1c240.appspot.com",
  messagingSenderId: "839888316564",
  appId: "1:839888316564:web:2523b748a470855567ac81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export async function createUser(email:string, password:string){
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // return `Account created succesfuly`;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.log("Create user error", errorCode, errorMessage)
      // return `An error has occurred, ${errorCode}: ${errorMessage}`;
    });
}

export async function loginUser(email: string, password: string){
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

// export interface User {
//   userData: DocumentData | undefined;
//   error?: boolean | unknown
// }

// export async function getUser(email: string): Promise<User> {
//   try {
//     const userRef = doc(db, "users", email);
//     const userSnapshot = await getDoc<DocumentData>(userRef);
//     return {
//       userData: userSnapshot.data(),
//       error: false,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       userData: {},
//       error: error,
//     };
//   }
// }

// interface Credentials{
//   email: string,
//   password: string
// }

// export async function loginUser(creds: Credentials): Promise<boolean | unknown> {
//   const desiredUser = await getUser(creds.email);
//   if (!desiredUser.error) {
//     const data = desiredUser.userData;
//     if (data) {
//       return (Object.keys(creds) as Array<keyof typeof creds>).every((key) => {
//         return data[key] === creds[key];
//       });
//     }
//   }
//   return desiredUser.error;
// }














//Home Section

const cathegoriesCollectionRef = collection(db, "home", "cathegories/cathegories")

export interface Cathegory {
  cathegoriesData: {
    [key: string]: any;
  };
  id: string;
}

export async function getCathegories(): Promise<Cathegory[]> {
  try {
    const querySnapshot = await getDocs(cathegoriesCollectionRef);
    const dataArr = querySnapshot.docs.map((doc) => ({
      cathegoriesData: { ...doc.data() },
      id: doc.id,
    }));
    return dataArr;
  } catch (error) {
    console.log(error);
    return [];
  }
}

interface CathegoryData {
  description: string;
  title: string;
  cathegory: string;
}

export async function addCathegory(cathegoryData: CathegoryData) {
  try {
    const cathegoriesCollectionRef = collection(db, "home", "cathegories", "cathegories");
    const docRef = await addDoc(cathegoriesCollectionRef, cathegoryData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


const coopBrandsRef = collection(db, "home", "coop_brands", "coop_brands")

export interface CoopBrand {
  collectionData: {
    [key: string]: any;
  };
  id: string;
}

export async function getCoopBrands(): Promise<CoopBrand[]> {
  try {
    const querySnapshot = await getDocs(coopBrandsRef);
    const dataArr = querySnapshot.docs.map((doc) => ({
      collectionData: { ...doc.data() },
      id: doc.id,
    }));
    return dataArr;
  } catch (error) {
    console.log(error);
    return [];
  }
}


export interface HeroData{
  heroData: DocumentData | undefined,
  error: boolean | unknown
}

export async function getHeroData(): Promise<HeroData>{
  try{
    const heroRef = doc(db, "/home", "hero")
    const querySnapshot = await getDoc<DocumentData>(heroRef);
    return{
      heroData: querySnapshot.data(),
      error: false
    }
  } catch(error){
    console.log(error)
    return{
      heroData: undefined,
      error: error
    }
  }
}

export interface SpecialOfferData{
  specialOfferData: DocumentData | undefined,
  error: boolean | unknown
}

export async function getSpecialOfferData():Promise<SpecialOfferData>{
  try{
    const specialOfferRef = doc(db, "/home", "special_offer")
    const querySnapshot = await getDoc<DocumentData>(specialOfferRef);
    return{
      specialOfferData: querySnapshot.data(),
      error: false
    }
  } catch(error){
    console.log(error)
    return{
      specialOfferData: undefined,
      error: error
    }
  }
}






// export async function getHostVans() {
//     const q = query(vansCollectionRef, where("hostId", "==", "123"))
//     const querySnapshot = await getDocs(q)
//     const dataArr = querySnapshot.docs.map(doc => ({
//         ...doc.data(),
//         id: doc.id
//     }))
//     return dataArr
// }

