<script setup>
import { ref, computed } from "vue";
import { useHomesStore } from "../../stores/homes";

const homesStore = useHomesStore();
const isDropdownOpen = ref(false);

const selectedHome = computed(() => homesStore.selectedHome);
const homes = computed(() => homesStore.homes);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectHome = (homeId) => {
  homesStore.selectHome(homeId);
  isDropdownOpen.value = false;
};
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
      @click="toggleDropdown"
    >
      <span>{{ selectedHome?.name || "Select Home" }}</span>
      <svg
        class="ml-2 -mr-0.5 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isDropdownOpen"
      class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100"
    >
      <div class="py-1">
        <button
          v-for="home in homes"
          :key="home.id"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          :class="{ 'bg-gray-50': home.id === selectedHome?.id }"
          @click="selectHome(home.id)"
        >
          {{ home.name }}
          <span v-if="home.isPrimary" class="ml-2 text-xs text-primary-600"
            >(Primary)</span
          >
        </button>
      </div>
      <div class="py-1">
        <button
          class="w-full text-left px-4 py-2 text-sm text-primary-600 hover:bg-gray-100 font-medium"
          @click="openAddHomeModal"
        >
          + Add New Home
        </button>
      </div>
    </div>
  </div>
</template>
