import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc
} from "firebase/firestore/lite";
import { Currency, CurrencyUpperCase } from "./utils/currencyUtils";

const currencyApiKey = `${import.meta.env.VITE_CURRENCY_API_KEY}`

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
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

export interface DocData{
  data?: DocumentData,
  id?: string;
  error: boolean | unknown
}

async function createFetchDoc(docRef: DocumentReference<DocumentData>){
  return async function(){
    try{
      const querySnapshot = await getDoc<DocumentData>(docRef);
      return{
        data: querySnapshot.data(),
        error: false
      }
    } catch(error){
      console.log(error)
      return{
        data: undefined,
        error: error
      }
    }
  }
}

export interface CollectionData{
  collectionData: {
    [key: string]: any;
  };
  error: boolean | unknown;
}

async function createFetchCollection(collectionRef: CollectionReference<DocumentData>){
  return async function(): Promise<CollectionData>{
    try{
      const querySnapshot = await getDocs(collectionRef);
      const dataArr = querySnapshot.docs.map((doc) => ({
        data: {...doc.data() },
        id: doc.id,
      }));
      return {collectionData: dataArr, error: false};
    } catch (error) {
      console.log(error);
      return {collectionData:[], error: error};
    }
  }
}
//Home Section

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

const cathegoriesCollectionRef = collection(db, "home", "cathegories/cathegories")

export const getCathegoriesData = await createFetchCollection(cathegoriesCollectionRef)

const coopBrandsRef = collection(db, "home", "coop_brands", "coop_brands");

export const getCoopBrandsData = await createFetchCollection(coopBrandsRef);

const heroRef = doc(db, "/home", "hero");

export const getHeroData = await createFetchDoc(heroRef);

const specialOfferRef = doc(db, "/home", "special_offer");

export const getSpecialOfferData = await createFetchDoc(specialOfferRef);

//Store section:
const productsRef = collection(db, "/store");

export const getProductsData = await createFetchCollection(productsRef)

export const getProductRating = async (ratingPath: string = "/ratings/0") =>{
  const ratingRef = doc(db, ratingPath)
  try{
    const querySnapshot = await getDoc(ratingRef)
    let data = querySnapshot.data()
    if(!data) data = {
      description: "",
      rating: 0
    } 
    return {
      data,
      id: querySnapshot.id
    }
  }catch(error){
    console.error(error)
    return{
      data: {
        description: "",
        rating: 0
      }, id: "0"
    }
  }
} 

export interface ProductData{
  count: number,
  currency: Currency,
  discount: boolean,
  discount_price: number,
  home_page_display: boolean,
  name: string,
  photo: string,
  price: number,
  rating: string,
  cathegory: string,
}
export async function addStoreProduct(data: ProductData, id: string){
    try {
      const newDocRef = doc(db, "store", id);
      await setDoc(newDocRef, {
        ...data
      })
    console.log("Document written with ID: ", newDocRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export type CurrencyRatios = {
  meta: {last_updated_at: string },
  data: {[key in CurrencyUpperCase]: {
    code: CurrencyUpperCase,
    value: number
  }}
}
type CurrencyParams = {
  [key: string]: string
}
class CurrencyAPI {
    baseUrl = 'https://api.currencyapi.com/v3/';

    headers
    constructor(apiKey = '') {
        this.headers = {
            apikey: apiKey
        };
    }

    call (endpoint: any, params = {}) {
        const paramString = new URLSearchParams({
            ...params
        }).toString();

        return fetch(`${this.baseUrl}${endpoint}?${paramString}`, { headers: this.headers })
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    status () {
        return this.call('status');
    }

    currencies (params: CurrencyParams) {
        return this.call('currencies', params);
    }

    latest (params: CurrencyParams) {
        return this.call('latest', params);
    }

    historical (params: CurrencyParams) {
        return this.call('historical', params);
    }

    range (params: CurrencyParams) {
        return this.call('range', params);
    }

    convert (params: CurrencyParams) {
        return this.call('convert', params);
    }
}
// it always returns JSON
export async function getCurrencyData(){
  const currencyApi = new CurrencyAPI(`${currencyApiKey}`);
  const result = currencyApi.latest({
    base_currency: "PLN",
    currencies: "EUR,USD,PLN,GBP"
  }).then(response => {
    return response.ok ? response : false;
  })
  if(await result){
    return await result
  }else{
    return {
      "meta": {
        "last_updated_at": "2023-05-29T23:59:59Z"
      },
      "data": {
        "EUR": {
          "code": "EUR",
          "value": 0.221321
        },
        "GBP": {
          "code": "GBP",
          "value": 0.191902
        },
        "PLN": {
          "code": "PLN",
          "value": 1
        },
        "USD": {
          "code": "USD",
          "value": 0.236975
        }
      }
    }
  }
}
// użyj też w submitTransaction
export async function checkForTransaction(transactionID: string){
  try{
    const newDocRef = doc(db, "transactions", transactionID)
    if(newDocRef){
      return true
    }else{
      return false
    }
  }catch(e){
    return false
  }
}

// export async function submitTransaction()

// odejmij potem od counta w produkcie ilość zamówionych produktów, jeśli produkt count = 0, daj mu klasę wyprzedane, daj też w productPage odpowiedni komunikat zamiast buttona dodaj do koszyka, typu produkt obecnie wyczerpany.