<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import HomeDropdown from './HomeDropdown.vue'

const router = useRouter()
const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const user = computed(() => authStore.user)

// Navigation links
const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: 'chart-bar' },
  { name: 'Bill Analysis', path: '/bill-analysis', icon: 'document-text' },
  { name: 'Recommendations', path: '/recommendations', icon: 'light-bulb' },
  { name: 'Rebates', path: '/rebates', icon: 'cash' }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const logout = async () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and desktop navigation -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/dashboard" class="flex items-center">
              <div class="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
              </div>
              <span class="text-lg font-display font-bold text-primary-600">EnergySave</span>
            </router-link>
          </div>
          
          <!-- Home Selector -->
          <div class="ml-6">
            <HomeDropdown />
          </div>
          
          <!-- Desktop Navigation -->
          <nav class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link 
              v-for="link in navLinks" 
              :key="link.path" 
              :to="link.path"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150"
              :class="[$route.path === link.path ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
            >
              {{ link.name }}
            </router-link>
          </nav>
        </div>
        
        <!-- User profile dropdown -->
        <div class="flex items-center">
          <!-- User dropdown -->
          <div class="ml-3 relative">
            <div>
              <button 
                type="button" 
                class="flex items-center max-w-xs bg-white rounded-full focus:outline-none"
                @click="toggleMobileMenu"
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                  {{ user?.firstName?.charAt(0) || 'U' }}
                </div>
                <span class="ml-2 text-sm text-gray-700 hidden sm:block">{{ user?.firstName || 'User' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            
            <!-- Dropdown menu -->
            <div 
              v-if="isMobileMenuOpen" 
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="isMobileMenuOpen = false"
              >
                Your Profile
              </router-link>
              <button 
                @click="logout" 
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden ml-2">
            <button 
              type="button" 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              @click="toggleMobileMenu"
            >
              <span class="sr-only">Open main menu</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6" 
                :class="[isMobileMenuOpen ? 'hidden' : 'block']" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6" 
                :class="[isMobileMenuOpen ? 'block' : 'hidden']" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div :class="[isMobileMenuOpen ? 'block' : 'hidden', 'md:hidden']">
      <div class="pt-2 pb-3 space-y-1">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path" 
          :to="link.path"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[$route.path === link.path ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800']"
          @click="isMobileMenuOpen = false"
        >
          {{ link.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>