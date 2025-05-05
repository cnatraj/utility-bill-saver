import { auth, db } from '../lib/firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

class AuthService {
  async validateToken() {
    
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe()
        if (user) {
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            resolve({
              id: user.uid,
              email: user.email,
              ...userDoc.data()
            })
          } else {
            // If user exists in Auth but not in Firestore, create their document
            const userData = {
              id: user.uid,
              email: user.email,
              firstName: user.displayName?.split(' ')[0] || '',
              lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
              createdAt: new Date(),
              updatedAt: new Date()
            }
            await setDoc(userDocRef, userData)
            resolve(userData)
          }
        } else {
          reject(new Error('No user is currently signed in'))
        }
      }, reject)
    })
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)

      let userData
      if (userDoc.exists()) {
        userData = {
          id: user.uid,
          email: user.email,
          ...userDoc.data()
        }
      } else {
        // Create user document if it doesn't exist
        userData = {
          id: user.uid,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        await setDoc(userDocRef, userData)
      }

      return { user: userData }
    } catch (error) {
      throw error
    }
  }

  async register(userData, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password)
      const user = userCredential.user

      // Update display name in Firebase Auth
      await updateFirebaseProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`.trim()
      })

      // Create user document in Firestore
      const userDocRef = doc(db, 'users', user.uid)
      const firestoreData = {
        id: user.uid,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(userDocRef, firestoreData)

      return { user: firestoreData }
    } catch (error) {
      throw error
    }
  }

  async updateProfile(userData) {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('No user is currently signed in')
      }

      // Update Firebase Auth profile
      await updateFirebaseProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`.trim()
      })

      // Update Firestore document
      const userDocRef = doc(db, 'users', user.uid)
      const updateData = {
        ...userData,
        updatedAt: new Date()
      }
      await setDoc(userDocRef, updateData, { merge: true })

      // Get updated user data
      const userDoc = await getDoc(userDocRef)
      return {
        id: user.uid,
        email: user.email,
        ...userDoc.data()
      }
    } catch (error) {
      throw error
    }
  }
}

export default new AuthService()