<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Logo and tagline -->
        <div class="mb-4 md:mb-0">
          <div class="flex items-center">
            <div class="w-6 h-6 bg-primary-500 rounded-md flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
            </div>
            <span class="text-base font-display font-bold text-primary-600">EnergySave</span>
          </div>
          <p class="text-sm text-gray-500 mt-1">Save energy, reduce costs, help the planet.</p>
        </div>
        
        <!-- Links -->
        <div class="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-4 md:mb-0">
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">Terms</a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">Help</a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">Contact</a>
        </div>
        
        <!-- Copyright -->
        <div class="text-sm text-gray-500">
          &copy; {{ currentYear }} EnergySave App
        </div>
      </div>
    </div>
  </footer>
</template>