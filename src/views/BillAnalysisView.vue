<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-display font-bold text-gray-900 mb-6">Bill Analysis</h1>
    
    <!-- Upload section -->
    <div class="card p-6 mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Upload Utility Bill</h2>
      <div class="flex items-center justify-center w-full">
        <label class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="mb-2 text-sm text-gray-500">
              <span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500">PDF, PNG, or JPG (MAX. 10MB)</p>
          </div>
          <input type="file" class="hidden" accept=".pdf,.png,.jpg,.jpeg" />
        </label>
      </div>
    </div>

    <!-- Bill history -->
    <div class="card p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Bill History</h2>
      <p class="text-gray-600">Upload your first bill to start tracking your energy usage.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Bill analysis component logic will be implemented here
</script>