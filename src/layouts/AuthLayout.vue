<script setup lang="ts">
// Auth layout for login, register, and password reset pages
</script>

<template>
  <div class="bg-gray-50 min-h-screen flex flex-col justify-center">
    <div class="sm:mx-auto sm:w-full sm:max-w-md mb-8">
      <div class="flex justify-center">
        <div class="w-14 h-14 bg-primary-500 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
        </div>
        <div class="ml-4">
                <h2 class="text-center text-3xl font-display font-bold text-gray-900">EnergySave</h2>
      <p class="text-center text-sm text-gray-600">
        Save energy, reduce costs
      </p>
        </div>
      </div>

    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <router-view />
      </div>
    </div>
  </div>
</template>