import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, collection, addDoc, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBLyr4YKZaFbrsbsc3eETCsORCaUenor_M",
    authDomain: "findwork-f79e5.firebaseapp.com",
    databaseURL: "https://findwork-f79e5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "findwork-f79e5",
    storageBucket: "findwork-f79e5.appspot.com",
    messagingSenderId: "103690621276",
    appId: "1:103690621276:web:4514b42277a3ba36b9f199"
  }

  
  const app = initializeApp(firebaseConfig)
  
  const db = getFirestore(app)
  const auth = getAuth()
  const storage = getStorage()
  
console.log(import.meta.env)

  if (false && import.meta.env.DEV) {
    // ย้าย emulator มาข้างล่างทั้งหมดแทน
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
    connectAuthEmulator(auth, 'http://127.0.0.1:9099')
    connectStorageEmulator(storage, '127.0.0.1', 9199)
  }
  export {
    db,
    auth,
    storage,
    getAuth,
    collection, 
    addDoc,
    doc, 
    setDoc,
    getDoc,
    updateDoc
  }