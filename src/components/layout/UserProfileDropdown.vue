<template>
  <div class="flex items-center">
    <!-- User dropdown -->
    <div class="ml-3 relative">
      <div>
        <button
          type="button"
          class="flex items-center max-w-xs bg-white rounded-full focus:outline-none"
          @click="toggleProfileMenu"
        >
          <span class="sr-only">Open user menu</span>
          <div
            class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold"
          >
            {{ user?.firstName?.charAt(0) || "U" }}
          </div>

          <ChevronDownIcon class="h-5 w-5 text-gray-400 ml-1" />
        </button>
      </div>

      <!-- Dropdown menu -->
      <div
        v-if="isProfileMenuOpen"
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="flex px-2 py-2">
          <div
            class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold"
          >
            {{ user?.firstName?.charAt(0) || "U" }}
          </div>
          <div class="ml-2">
            <div class="text-sm text-gray-700 font-semibold">
              {{ user?.firstName || "User" }}
            </div>
            <div class="text-gray-700 font-thin text-xs">
              {{ user?.email || "User" }}
            </div>
          </div>
        </div>

        <hr class="h-px mx-2 bg-gray-200 border-0 dark:bg-gray-700" />

        <!-- Mobile Menu Links -->
        <div class="md:hidden">
          <router-link
            :to="link.path"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="isProfileMenuOpen = false"
            v-for="link in props.navLinks"
            :key="link.path"
          >
            {{ link.name }}
          </router-link>
          <hr class="h-px mx-2 bg-gray-200 border-0 dark:bg-gray-700" />
        </div>

        <!-- Profile Links -->
        <router-link
          to="/profile"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="isProfileMenuOpen = false"
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { ChevronDownIcon, Bars3Icon } from "@heroicons/vue/24/outline";

const props = defineProps({
  navLinks: {
    type: Array,
    required: true,
  },
});
const router = useRouter();
const authStore = useAuthStore();
const isProfileMenuOpen = ref(false);

const user = computed(() => authStore.user);

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const logout = async () => {
  authStore.logout();
  router.push("/login");
};
</script>
