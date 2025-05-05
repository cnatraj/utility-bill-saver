<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const agreeToTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Handle registration
const handleRegister = async () => {
  // Validate form
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }
  
  if (!agreeToTerms.value) {
    errorMessage.value = 'You must agree to the terms and conditions.'
    return
  }
  
  // Basic password strength check
  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    return
  }
  
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await authStore.register(
      {
        email: email.value,
      },
      password.value
    )
    
    // Redirect to dashboard after successful registration
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = 'Registration failed. Please try again or use a different email.'
    console.error('Registration error:', error)
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
    
    // Redirect to dashboard after successful sign in
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = 'Google sign in failed. Please try again.'
    console.error('Google sign in error:', error)
  } finally {
    isLoading.value = false
  }
}

// Navigate to login page
const navigateToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-display font-bold text-gray-900 mb-6">Create your account</h2>

    <!-- Google sign in button -->
    <button
      type="button"
      @click="handleGoogleSignIn"
      class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
      :disabled="isLoading"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        class="w-5 h-5 mr-2"
      />
      Sign up with Google
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
    
    <!-- Error message -->
    <div v-if="errorMessage" class="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md">
      {{ errorMessage }}
    </div>
    
    <form @submit.prevent="handleRegister">
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
      <div class="mb-4">
        <label for="password" class="form-label">Password</label>
        <input 
          id="password" 
          v-model="password"
          type="password" 
          autocomplete="new-password"
          required 
          class="form-input"
        />
        <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
      </div>
      
      <!-- Terms and conditions -->
      <div class="mb-6">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input 
              id="terms" 
              v-model="agreeToTerms"
              type="checkbox" 
              required
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" 
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="text-gray-600">
              I agree to the 
              <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
              and
              <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Submit button -->
      <div>
        <button 
          type="submit" 
          class="w-full btn-primary flex justify-center items-center mb-4"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Creating account...' : 'Create account' }}
        </button>

      </div>
    </form>
    
    <!-- Sign in link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Already have an account?
        <button 
          type="button" 
          @click="navigateToLogin" 
          class="font-medium text-primary-600 hover:text-primary-500 ml-1"
        >
          Sign in
        </button>
      </p>
    </div>
  </div>
</template>