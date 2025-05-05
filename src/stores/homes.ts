import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Home } from '../types/user'

export const useHomesStore = defineStore('homes', () => {
  const homes = ref<Home[]>([])
  const selectedHomeId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Get selected home
  const selectedHome = computed(() => {
    return homes.value.find(home => home.id === selectedHomeId.value) || homes.value.find(home => home.isPrimary) || null
  })

  // Initialize homes
  const initializeHomes = (userHomes: Home[]) => {
    homes.value = userHomes
    if (userHomes.length > 0 && !selectedHomeId.value) {
      const primaryHome = userHomes.find(home => home.isPrimary)
      selectedHomeId.value = primaryHome?.id || userHomes[0].id
    }
  }

  // Select a home
  const selectHome = (homeId: string) => {
    selectedHomeId.value = homeId
  }

  return {
    homes,
    selectedHome,
    selectedHomeId,
    isLoading,
    error,
    initializeHomes,
    selectHome
  }
})