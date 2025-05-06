<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import HomeDropdown from "./HomeDropdown.vue";
import UserProfileDropdown from "./UserProfileDropdown.vue";
const router = useRouter();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);

const user = computed(() => authStore.user);

// Navigation links
const navLinks = [
  { name: "Dashboard", path: "/dashboard", icon: "chart-bar" },
  { name: "Rebate Finder", path: "/rebates", icon: "cash" },
];

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const logout = async () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and desktop navigation -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/dashboard" class="flex items-center">
              <div
                class="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center mr-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  />
                </svg>
              </div>
              <span class="text-lg font-display font-bold text-primary-600"
                >EnergySave</span
              >
            </router-link>
          </div>

          <!-- Home Selector -->
          <!-- <div class="ml-6">
            <HomeDropdown />
          </div> -->

          <!-- Desktop Navigation -->
          <nav class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150"
              :class="[
                $route.path === link.path
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              ]"
            >
              {{ link.name }}
            </router-link>
          </nav>
        </div>

        <!-- User profile dropdown -->
        <UserProfileDropdown :nav-links="navLinks" />
      </div>
    </div>
  </header>
</template>
