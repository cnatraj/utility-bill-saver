import { getFunctions, httpsCallable } from 'firebase/functions'

class OpenAIService {
  constructor() {
    const functions = getFunctions()
    this.analyzeHome = httpsCallable(functions, 'analyzeHome')
  }

  async generateHomeAnalysis(homeId, utilityBillUrl, assetUrls) {
    try {
      const result = await this.analyzeHome({
        homeId,
        utilityBillUrl,
        assetUrls
      })
      
      return result.data
    } catch (error) {
      console.error('Error generating home analysis:', error)
      throw error
    }
  }
}

export default new OpenAIService()