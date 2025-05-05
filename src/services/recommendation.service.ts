import axios from 'axios'
import { Recommendation, RecommendationRequest, RebateInfo } from '../types/recommendation'

// For demo purposes, we'll simulate API calls
class RecommendationService {
  // Base API URLs
  private recommendationsUrl = '/api/recommendations'
  private aiUrl = '/api/ai'
  private rebatesUrl = '/api/rebates'
  
  // Get all recommendations for current user
  async getUserRecommendations(): Promise<Recommendation[]> {
    // Simulate API call
    // In production: return axios.get(this.recommendationsUrl)
    
    // For demo purposes, return mock recommendations
    return this.getMockRecommendations()
  }
  
  // Generate new recommendations using OpenAI
  async generateRecommendations(): Promise<Recommendation[]> {
    // In a real app, this would call your OpenAI-integrated API
    // const request: RecommendationRequest = { ... user data ... }
    // return axios.post(`${this.aiUrl}/generate-recommendations`, request)
    
    // For demo purposes, return a few new mock recommendations
    const mockRecommendations = this.getMockRecommendations()
    
    // Pick 2-3 recommendations that haven't been "generated" yet
    const newRecommendations = mockRecommendations
      .filter(r => !r.implemented)
      .slice(0, Math.floor(Math.random() * 2) + 2)
      .map(r => ({
        ...r,
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    
    return newRecommendations
  }
  
  // Mark recommendation as implemented
  async markAsImplemented(recommendationId: string, implementationDate: Date): Promise<Recommendation> {
    // Simulate API call
    // In production: return axios.put(`${this.recommendationsUrl}/${recommendationId}/implement`, {
    //   implementationDate
    // })
    
    // For demo purposes
    const recommendations = this.getMockRecommendations()
    const recommendation = recommendations.find(r => r.id === recommendationId)
    
    if (!recommendation) {
      throw new Error('Recommendation not found')
    }
    
    return {
      ...recommendation,
      implemented: true,
      implementationDate,
      updatedAt: new Date()
    }
  }
  
  // Delete a recommendation
  async deleteRecommendation(recommendationId: string): Promise<void> {
    // Simulate API call
    // In production: return axios.delete(`${this.recommendationsUrl}/${recommendationId}`)
    
    // For demo purposes, just return success
    return Promise.resolve()
  }
  
  // Get available rebates based on user location
  async getAvailableRebates(zipCode: string): Promise<RebateInfo[]> {
    // Simulate API call to ENERGY STAR Rebate Finder API
    // In production: return axios.get(`${this.rebatesUrl}/find?zipCode=${zipCode}`)
    
    // For demo purposes, return mock rebates
    return this.getMockRebates()
  }
  
  // Helper to generate mock recommendations for demo purposes
  private getMockRecommendations(): Recommendation[] {
    return [
      {
        id: 'rec-1',
        userId: '123456',
        title: 'Replace incandescent bulbs with LED lighting',
        description: 'Switching to LED light bulbs can save up to 75% of energy used for lighting. LED bulbs also last 25 times longer than traditional incandescent bulbs.',
        category: 'lighting',
        difficulty: 'easy',
        upfrontCost: 120,
        estimatedSavings: 150,
        actualSavings: 0,
        paybackPeriod: 0.8,
        environmentalImpact: {
          co2Reduction: 650
        },
        steps: [
          'Count how many incandescent bulbs you currently have',
          'Purchase equivalent LED bulbs (check lumens, not watts)',
          'Replace each bulb as the old ones burn out or all at once',
          'Properly dispose of old incandescent bulbs'
        ],
        implemented: false,
        source: 'ai',
        relatedRebates: ['rebate-1'],
        createdAt: new Date('2023-09-15'),
        updatedAt: new Date('2023-09-15')
      },
      {
        id: 'rec-2',
        userId: '123456',
        title: 'Install programmable thermostat',
        description: 'A programmable thermostat automatically adjusts your home\'s temperature at different times of day, saving up to 10% on heating and cooling costs annually.',
        category: 'hvac',
        difficulty: 'medium',
        upfrontCost: 150,
        estimatedSavings: 180,
        actualSavings: 195,
        paybackPeriod: 0.83,
        environmentalImpact: {
          co2Reduction: 1200
        },
        steps: [
          'Purchase a programmable thermostat compatible with your HVAC system',
          'Turn off power to your HVAC system at the breaker',
          'Remove old thermostat carefully, labeling wires if necessary',
          'Install new thermostat following manufacturer instructions',
          'Program optimal temperature schedules for different times of day'
        ],
        implemented: true,
        implementationDate: new Date('2023-10-10'),
        source: 'ai',
        relatedRebates: [],
        createdAt: new Date('2023-09-15'),
        updatedAt: new Date('2023-10-10')
      }
    ]
  }
  
  // Helper to generate mock rebates for demo purposes
  private getMockRebates(): RebateInfo[] {
    return [
      {
        id: 'rebate-1',
        title: 'LED Lighting Rebate Program',
        provider: 'EcoElectric Utility',
        description: 'Receive $1-3 back per LED bulb purchased, up to 20 bulbs per household annually.',
        eligibilityCriteria: [
          'Must be an EcoElectric residential customer',
          'Must purchase ENERGY STAR certified LED bulbs',
          'Original receipts required'
        ],
        amount: 60,
        expirationDate: new Date('2023-12-31'),
        applicationUrl: 'https://example.com/eco-electric/rebates',
        applicableCategories: ['lighting'],
        location: {
          state: 'CA',
          country: 'USA'
        },
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ]
  }
}

export default new RecommendationService()