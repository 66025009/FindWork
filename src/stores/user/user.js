import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where
} from 'firebase/firestore'
import { db } from '@/firebase'
import { getAuth } from 'firebase/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    loaded: false,
    currentUser: null // ใช้ currentUser แทน list
  }),
  actions: {
    async loadUserByUid() {
      try {
        const auth = getAuth()
        const user = auth.currentUser
        if (user) {
          const uid = user.uid
          const userRef = doc(db, 'user', uid)
          const userSnapshot = await getDoc(userRef)
          if (userSnapshot.exists()) {
            this.currentUser = userSnapshot.data()
            this.currentUser.uid = userSnapshot.id
          } else {
            console.error('User not found')
            this.currentUser = null
          }
          this.loaded = true
        } else {
          console.error('No user is logged in.')
          this.loaded = false
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        this.loaded = false
      }
    },
    
    async getUser(uid) {
      try {
        const userRef = doc(db, 'user', uid)
        const userSnapshot = await getDoc(userRef)
        if (userSnapshot.exists()) {
          return userSnapshot.data()
        } else {
          console.error('No such document!')
          return null
        }
      } catch (error) {
        console.log('Error getting document:', error)
      }
    },

    async updateUser(userData) {
      try {
        const auth = getAuth()
        const user = auth.currentUser
        if (user) {
          const uid = user.uid
          const docRef = doc(db, 'user', uid)
          await setDoc(docRef, userData, { merge: true }) // merge: true เพื่ออัปเดตเฉพาะฟิลด์ที่ระบุ
        } else {
          console.error('No user is logged in.')
        }
      } catch (error) {
        console.log('Error updating document:', error)
      }
    }
  }
})
