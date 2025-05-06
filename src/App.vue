<script setup>
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import { useAuthStore } from "./stores/auth";

const route = useRoute();
const authStore = useAuthStore();
const isLoading = ref(true);

// Remove auth check since it's now handled in the store
onMounted(() => {
  isLoading.value = false;
});

// Determine if the current route should have a full-height layout
const isFullHeightRoute = computed(() => {
  return ["login", "register", "forgot-password"].includes(route.name || "");
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-white z-50"
    >
      <div class="animate-pulse-slow flex flex-col items-center">
        <div
          class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="mt-4 text-gray-600">Loading application...</p>
      </div>
    </div>

    <!-- App content -->
    <template v-else>
      <!-- Header for authenticated routes -->
      <AppHeader v-if="authStore.isAuthenticated" />

      <!-- Main content area -->
      <main
        :class="[
          'flex-grow w-full transition-all duration-300 ease-in-out',
          isFullHeightRoute
            ? 'flex items-center justify-center p-4'
            : 'container mx-auto px-4 py-6 sm:px-6 lg:px-8',
        ]"
      >
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </main>

      <!-- Footer for authenticated routes -->
      <AppFooter v-if="authStore.isAuthenticated" />
    </template>
  </div>
</template>
