<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Handle login
const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }
  
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await authStore.login(email.value, password.value)
    
    // Redirect to the requested page or dashboard
    const redirectPath = route.query.redirect as string || '/dashboard'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = 'Invalid email or password. Please try again.'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle Google sign in
const handleGoogleSignIn = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await authStore.loginWithGoogle()
    
    // Redirect to the requested page or dashboard
    const redirectPath = route.query.redirect as string || '/dashboard'
    router.push(redirectPath)
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      errorMessage.value = 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.'
    } else {
      errorMessage.value = 'Google sign in failed. Please try again.'
    }
    console.error('Google sign in error:', error)
  } finally {
    isLoading.value = false
  }
}

// Navigate to register page
const navigateToRegister = () => {
  router.push('/register')
}

// Navigate to forgot password page
const navigateToForgotPassword = () => {
  router.push('/forgot-password')
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-display font-bold text-gray-900 mb-6">Sign in to your account</h2>
    
    <!-- Error message -->
    <div v-if="errorMessage" class="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md">
      {{ errorMessage }}
    </div>

    <!-- Google sign in button -->
    <button
      type="button"
      @click="handleGoogleSignIn"
      class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none mb-6"
      :disabled="isLoading"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        class="w-5 h-5 mr-2"
      />
      Sign in with Google
    </button>

    <!-- Divider -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">OR</span>
      </div>
    </div>
    
    <form @submit.prevent="handleLogin">
      <!-- Email -->
      <div class="mb-4">
        <label for="email" class="form-label">Email address</label>
        <input 
          id="email" 
          v-model="email"
          type="email" 
          autocomplete="email"
          required 
          class="form-input"
        />
      </div>
      
      <!-- Password -->
      <div class="mb-6">
        <label for="password" class="form-label">Password</label>
        <input 
          id="password" 
          v-model="password"
          type="password" 
          autocomplete="current-password"
          required 
          class="form-input"
        />
      </div>
      
      <!-- Remember me / Forgot password -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <input 
            id="remember-me" 
            v-model="rememberMe"
            type="checkbox" 
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" 
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <div>
          <button 
            type="button" 
            @click="navigateToForgotPassword" 
            class="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot your password?
          </button>
        </div>
      </div>
      
      <!-- Submit button -->
      <div>
        <button 
          type="submit" 
          class="w-full btn-primary flex justify-center items-center"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>
    </form>
    
    <!-- Sign up link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <button 
          type="button" 
          @click="navigateToRegister" 
          class="font-medium text-primary-600 hover:text-primary-500 ml-1"
        >
          Sign up now
        </button>
      </p>
    </div>
  </div>
</template>