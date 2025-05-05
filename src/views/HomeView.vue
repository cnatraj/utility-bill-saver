<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Redirect to dashboard if already authenticated
if (authStore.isAuthenticated) {
  router.push('/dashboard')
}

const navigateToLogin = () => {
  router.push('/login')
}

const navigateToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Hero Section -->
    <header class="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="md:w-1/2 mb-10 md:mb-0">
            <h1 class="text-4xl md:text-5xl font-display font-bold leading-tight mb-4 animate-fade-in">
              Reduce Your Energy Bills with Smart Insights
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
              Upload your utility bills, get personalized recommendations, and start saving today.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button @click="navigateToLogin" class="btn bg-white text-primary-700 hover:bg-primary-50 focus:ring-white">
                Sign In
              </button>
              <button @click="navigateToRegister" class="btn bg-primary-500 text-white border border-primary-400 hover:bg-primary-400 focus:ring-primary-300">
                Create Account
              </button>
            </div>
          </div>
          <div class="md:w-1/2 flex justify-center md:justify-end">
            <img src="https://images.pexels.com/photos/3780104/pexels-photo-3780104.png" alt="Energy saving concept" class="rounded-lg shadow-xl max-w-full h-auto max-h-96 object-cover" />
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-display font-bold text-center text-gray-900 mb-12">How EnergySave Works</h2>
        
        <div class="grid md:grid-cols-3 gap-10">
          <!-- Feature 1 -->
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Upload Your Bills</h3>
            <p class="text-gray-600">Simply take a photo or upload PDF of your utility bills. Our smart OCR technology extracts all the important data.</p>
          </div>
          
          <!-- Feature 2 -->
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Get Insights</h3>
            <p class="text-gray-600">View your energy usage patterns and how you compare to similar homes in your area.</p>
          </div>
          
          <!-- Feature 3 -->
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Save Money</h3>
            <p class="text-gray-600">Receive personalized AI-powered recommendations and find available rebates to reduce your energy costs.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-display font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Testimonial 1 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold mr-3">
                JD
              </div>
              <div>
                <h4 class="font-bold text-gray-900">John D.</h4>
                <p class="text-sm text-gray-500">San Francisco, CA</p>
              </div>
            </div>
            <p class="text-gray-600">"I've reduced my electricity bill by 22% after following the recommendations from EnergySave. The bill analysis feature is incredibly helpful!"</p>
          </div>
          
          <!-- Testimonial 2 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-800 font-semibold mr-3">
                SM
              </div>
              <div>
                <h4 class="font-bold text-gray-900">Sarah M.</h4>
                <p class="text-sm text-gray-500">Austin, TX</p>
              </div>
            </div>
            <p class="text-gray-600">"The rebate finder saved me over $300 on my new smart thermostat and LED lighting. I wouldn't have known these incentives existed without this app."</p>
          </div>
          
          <!-- Testimonial 3 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-800 font-semibold mr-3">
                RK
              </div>
              <div>
                <h4 class="font-bold text-gray-900">Robert K.</h4>
                <p class="text-sm text-gray-500">Chicago, IL</p>
              </div>
            </div>
            <p class="text-gray-600">"Being able to upload my bills and get automatic tracking of my energy usage has made it so much easier to monitor my progress. Great app!"</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-secondary-600 to-secondary-800 text-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-display font-bold mb-6">Ready to Start Saving?</h2>
        <p class="text-xl text-secondary-100 mb-8 max-w-2xl mx-auto">Join thousands of households already saving money and energy with EnergySave.</p>
        <button @click="navigateToRegister" class="btn bg-white text-secondary-700 hover:bg-secondary-50 focus:ring-white">
          Create Free Account
        </button>
      </div>
    </section>
    
    <!-- Footer for landing page -->
    <footer class="bg-gray-800 text-gray-300 py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo and description -->
          <div class="md:col-span-1">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
              </div>
              <span class="text-xl font-display font-bold text-white">EnergySave</span>
            </div>
            <p class="mt-3 text-sm">We help households reduce their energy consumption, save money, and contribute to a more sustainable future.</p>
          </div>
          
          <!-- Links 1 -->
          <div>
            <h4 class="text-white font-bold mb-4">Product</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-sm hover:text-white">Features</a></li>
              <li><a href="#" class="text-sm hover:text-white">Pricing</a></li>
              <li><a href="#" class="text-sm hover:text-white">How It Works</a></li>
              <li><a href="#" class="text-sm hover:text-white">FAQ</a></li>
            </ul>
          </div>
          
          <!-- Links 2 -->
          <div>
            <h4 class="text-white font-bold mb-4">Company</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-sm hover:text-white">About Us</a></li>
              <li><a href="#" class="text-sm hover:text-white">Blog</a></li>
              <li><a href="#" class="text-sm hover:text-white">Careers</a></li>
              <li><a href="#" class="text-sm hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <!-- Links 3 -->
          <div>
            <h4 class="text-white font-bold mb-4">Legal</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-sm hover:text-white">Terms of Service</a></li>
              <li><a href="#" class="text-sm hover:text-white">Privacy Policy</a></li>
              <li><a href="#" class="text-sm hover:text-white">Cookie Policy</a></li>
              <li><a href="#" class="text-sm hover:text-white">Data Processing</a></li>
            </ul>
          </div>
        </div>
        
        <div class="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm">&copy; {{ new Date().getFullYear() }} EnergySave. All rights reserved.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-white">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <span class="sr-only">Instagram</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>