import { defineStore } from 'pinia'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useUserStore } from '@/stores/user/user'
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signInWithPopup,
    signInWithCustomToken,
    sendPasswordResetEmail,
    updatePassword,
    signOut,
    getAuth,
    updateProfile,
} from 'firebase/auth'

import {
    auth,
    db
} from '@/firebase'

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore'

const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()
const functions = getFunctions()
const lineSignIn = httpsCallable(functions, 'lineSignIn')

export const useAccountStore = defineStore('account', {
    state: () => ({
        isLoggerIn: false,
        isAdmin: false,
        user: null,
        profile: {},
        posts: []
    }),
    actions: {
        async initializeAuth() {
            return new Promise((resolve) => {
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        this.user = user
                        console.log('user', user)

                        this.isLoggerIn = true
                        const storedProfile = localStorage.getItem('user-profile')
                        if (storedProfile) {
                            this.profile = JSON.parse(storedProfile)
                        } else {
                            const docRef = doc(db, 'user', user.uid)
                            const docSnap = await getDoc(docRef)

                            if (docSnap.exists()) {
                                this.profile = docSnap.data()
                                console.log('profile', this.profile)
                                if (this.profile.role === 'admin') {
                                    this.isAdmin = true
                                }
                                this.profile.email = user.email
                            }
                        }
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            })
        },

        async loadUserProfile() {
            if (!this.user || !this.user.uid) {
                throw new Error('No user is logged in')
            }
            try {
                const docRef = doc(db, 'user', this.user.uid)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    this.profile = docSnap.data()
                    if (!this.profile.email && this.user.email) {
                        this.profile.email = this.user.email
                        await updateDoc(docRef, { email: this.user.email })
                    }
                    console.log('Loaded profile:', this.profile)
                } else {
                    console.log('No such document!')
                }
            } catch (error) {
                console.error('Error loading user profile:', error)
                throw new Error('Failed to load user profile')
            }
        },

        async updateProfile(userData) {
            try {
                const updateUserData = {
                    backgroundImage: userData.backgroundImage || '',
                    profileImage: userData.profileImage || '',
                    name: userData.name || '',
                    companyName: userData.companyName || '',
                    university: userData.university || ''
                }
                const userRef = doc(db, `user/${this.user.uid}`)
                await updateDoc(userRef, updateUserData)
                this.profile = { ...this.profile, ...updateUserData }
                console.log('Profile updated in Firestore:', updateUserData)

                // Update posts with new profile data
                await this.updatePostsWithNewProfile(updateUserData)
            } catch (error) {
                console.error('Error updating profile:', error)
            }
        },
        
        async signInEmail(email, password) {
            try {
                const result = await signInWithEmailAndPassword(auth, email, password)
                this.user = result.user
                this.isLoggerIn = true
            } catch (error) {
                console.log('Error signing in:', error.code)
                switch (error.code) {
                    case 'auth/invalid-email':
                        throw new Error('อีเมลไม่ถูกต้อง')
                    case 'auth/wrong-password':
                        throw new Error('รหัสผ่านไม่ถูกต้อง')
                    default:
                        throw new Error('มีปัญหาเกี่ยวกับการล็อกอิน')
                }
            }
        },

        async signInWithGoogle() {
            try {
                const result = await signInWithPopup(auth, googleProvider)
                this.user = result.user
                this.isLoggerIn = true
            } catch (error) {
                console.log('Error signing in with Google:', error)
                throw new Error('การล็อกอินด้วย Google ล้มเหลว')
            }
        },

        async signInWithFacebook() {
            try {
                const result = await signInWithPopup(auth, facebookProvider)
                this.user = result.user
                this.isLoggerIn = true
            } catch (error) {
                console.log('Error signing in with Facebook:', error)
                throw new Error('การล็อกอินด้วย Facebook ล้มเหลว')
            }
        },

        async signInWithLine(accessToken) {
            try {
                const result = await lineSignIn({ accessToken })
                const { token } = result.data
                await signInWithCustomToken(auth, token)
                this.user = auth.currentUser
                this.isLoggerIn = true
            } catch (error) {
                console.error('Error signing in with Line:', error)
                throw new Error('การล็อกอินด้วย Line ล้มเหลว')
            }
        },

        async Forget(email) {
            const auth = getAuth()
            try {
                if (!email) {
                    throw new Error('กรุณากรอกอีเมล')
                }
                await sendPasswordResetEmail(auth, email)
                console.log('Reset password email sent successfully.')
            } catch (error) {
                console.error('Error sending reset password email:', error)
                throw new Error('ไม่สามารถส่งลิงก์รีเซ็ทรหัสผ่านได้')
            }
        },

        async updatePassword(newPassword) {
            const user = auth.currentUser
            if (!user) {
                throw new Error('No user is currently signed in.')
            }
            try {
                await updatePassword(user, newPassword)
            } catch (error) {
                console.error('Error updating password:', error)
                throw error
            }
        },

        async logout() {
            try {
                await signOut(auth)
                this.isLoggerIn = false
                this.isAdmin = false
                this.user = null
            } catch (error) {
                console.error('Error during logout:', error)
                throw new Error('การออกจากระบบล้มเหลว')
            }
        },

        async deleteAccount() {
            const user = auth.currentUser
            if (!user) {
                throw new Error('No user is currently signed in.')
            }
            try {
                await deleteDoc(doc(db, 'user', user.uid))
                await user.delete()
            } catch (error) {
                console.error('Error deleting account:', error)
                throw error
            }
        },

        async signInEmailAdmin(email, password) {
            try {
                const result = await signInWithEmailAndPassword(auth, email, password)
                this.user = result.user
                this.isLoggerIn = true
                this.isAdmin = true
            } catch (error) {
                console.log('Error signing in admin:', error.code)
                switch (error.code) {
                    case 'auth/invalid-email':
                        throw new Error('อีเมลไม่ถูกต้อง')
                    case 'auth/wrong-password':
                        throw new Error('รหัสผ่านไม่ถูกต้อง')
                    default:
                        throw new Error('มีปัญหาเกี่ยวกับการล็อกอิน')
                }
            }
        },
    }
})
