import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Recommendation } from '../types/recommendation'
import RecommendationService from '../services/recommendation.service'

export const useRecommendationStore = defineStore('recommendation', () => {
  const recommendations = ref<Recommendation[]>([])
  const selectedRecommendation = ref<Recommendation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Get all recommendations for current user
  const fetchRecommendations = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const userRecommendations = await RecommendationService.getUserRecommendations()
      recommendations.value = userRecommendations
      
      return userRecommendations
    } catch (err) {
      error.value = 'Failed to fetch recommendations.'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Generate new recommendations based on user data
  const generateRecommendations = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const newRecommendations = await RecommendationService.generateRecommendations()
      
      // Add new recommendations to the list
      recommendations.value = [...recommendations.value, ...newRecommendations]
      
      return newRecommendations
    } catch (err) {
      error.value = 'Failed to generate recommendations.'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Mark recommendation as implemented
  const markAsImplemented = async (recommendationId: string, implementationDate: Date) => {
    try {
      isLoading.value = true
      error.value = null
      
      const updatedRecommendation = await RecommendationService.markAsImplemented(
        recommendationId,
        implementationDate
      )
      
      // Update in recommendations array
      const index = recommendations.value.findIndex(r => r.id === recommendationId)
      if (index >= 0) {
        recommendations.value[index] = updatedRecommendation
      }
      
      // Update selected recommendation if it's the one being modified
      if (selectedRecommendation.value?.id === recommendationId) {
        selectedRecommendation.value = updatedRecommendation
      }
      
      return updatedRecommendation
    } catch (err) {
      error.value = 'Failed to mark recommendation as implemented.'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Delete a recommendation
  const deleteRecommendation = async (recommendationId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await RecommendationService.deleteRecommendation(recommendationId)
      
      // Remove from recommendations array
      recommendations.value = recommendations.value.filter(r => r.id !== recommendationId)
      
      // Clear selected recommendation if it's the one being deleted
      if (selectedRecommendation.value?.id === recommendationId) {
        selectedRecommendation.value = null
      }
      
      return true
    } catch (err) {
      error.value = 'Failed to delete recommendation.'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Computed: Get not implemented recommendations
  const pendingRecommendations = computed(() => {
    return recommendations.value.filter(r => !r.implemented)
  })
  
  // Computed: Get implemented recommendations
  const implementedRecommendations = computed(() => {
    return recommendations.value.filter(r => r.implemented)
  })
  
  // Computed: Calculate total estimated savings
  const totalEstimatedSavings = computed(() => {
    return recommendations.value.reduce((total, rec) => total + rec.estimatedSavings, 0)
  })
  
  // Computed: Calculate realized savings from implemented recommendations
  const realizedSavings = computed(() => {
    return implementedRecommendations.value.reduce((total, rec) => total + rec.actualSavings, 0)
  })
  
  return {
    recommendations,
    selectedRecommendation,
    isLoading,
    error,
    pendingRecommendations,
    implementedRecommendations,
    totalEstimatedSavings,
    realizedSavings,
    fetchRecommendations,
    generateRecommendations,
    markAsImplemented,
    deleteRecommendation
  }
})