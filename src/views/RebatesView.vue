<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-display font-bold text-gray-900 mb-6">Available Rebates</h1>
    
    <!-- Search section -->
    <div class="card p-6 mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Find Rebates in Your Area</h2>
      <div class="max-w-md">
        <label for="zipcode" class="form-label">Enter ZIP Code</label>
        <input
          type="text"
          id="zipcode"
          class="form-input"
          placeholder="e.g., 90210"
          pattern="[0-9]{5}"
        />
      </div>
    </div>

    <!-- Rebates list -->
    <div class="grid gap-6">
      <p class="text-gray-600">Enter your ZIP code to see available rebates in your area.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Rebates component logic will be implemented here
</script>