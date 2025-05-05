import { defineStore } from 'pinia'
import { ref } from 'vue'
import AuthService from '../services/auth.service'
import { auth } from '../lib/firebase'
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(null) // Initialize as null to indicate "unknown" state
  const authError = ref(null)
  const isLoading = ref(false)

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      isLoading.value = true
      authError.value = null
      
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Create user object from Google data
      const userData = {
        id: result.user.uid,
        email: result.user.email || '',
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Update store state
      user.value = userData
      isAuthenticated.value = true
      
      return userData
    } catch (error) {
      console.error('Google sign in error:', error)
      authError.value = error.code === 'auth/popup-closed-by-user' 
        ? 'Sign in cancelled. Please try again.'
        : 'Google sign in failed. Please try again.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      isLoading.value = true
      authError.value = null
      
      const response = await AuthService.login(email, password)
      const { user: userData } = response
      
      // Update store state
      user.value = userData
      isAuthenticated.value = true
      
      return userData
    } catch (error) {
      authError.value = 'Invalid email or password.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Register new user
  const register = async (userData, password) => {
    try {
      isLoading.value = true
      authError.value = null
      
      const response = await AuthService.register(userData, password)
      const { user: newUser } = response
      
      // Update store state
      user.value = newUser
      isAuthenticated.value = true
      
      return newUser
    } catch (error) {
      authError.value = 'Registration failed. Please try again.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Logout user
  const logout = () => {
    auth.signOut()
    user.value = null
    isAuthenticated.value = false
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      isLoading.value = true
      
      const updatedUser = await AuthService.updateProfile(userData)
      user.value = updatedUser
      
      return updatedUser
    } catch (error) {
      authError.value = 'Failed to update profile.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Set up auth state listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userData = await AuthService.validateToken()
        user.value = userData
        isAuthenticated.value = true
      } catch (error) {
        console.error('Error validating token:', error)
        user.value = null
        isAuthenticated.value = false
      }
    } else {
      user.value = null
      isAuthenticated.value = false
    }
  })

  return {
    user,
    isAuthenticated,
    authError,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile
  }
})