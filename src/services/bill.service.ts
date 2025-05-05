import axios from 'axios'
import Tesseract from 'tesseract.js'
import { Bill, BillData } from '../types/bill'

// For demo purposes, we'll simulate API calls and use Tesseract.js for OCR
class BillService {
  // Base API URL
  private apiUrl = '/api/bills'
  
  // Get all bills for the current user
  async getUserBills(): Promise<Bill[]> {
    // Simulate API call
    // In production: return axios.get(`${this.apiUrl}`)
    
    // For demo purposes, return mock bills
    return this.getMockBills()
  }
  
  // Get a single bill by ID
  async getBill(billId: string): Promise<Bill> {
    // Simulate API call
    // In production: return axios.get(`${this.apiUrl}/${billId}`)
    
    // For demo purposes
    const bills = this.getMockBills()
    const bill = bills.find(b => b.id === billId)
    
    if (!bill) {
      throw new Error('Bill not found')
    }
    
    return bill
  }
  
  // Upload bill image
  async uploadBillImage(billImage: File): Promise<Bill> {
    // In a real app, this would upload the file to a server
    // const formData = new FormData()
    // formData.append('billImage', billImage)
    // return axios.post(`${this.apiUrl}/upload`, formData)
    
    // For demo purposes, create a new mock bill
    const mockBill: Bill = {
      id: `bill-${Date.now()}`,
      userId: '123456',
      imageUrl: URL.createObjectURL(billImage), // Create a temporary URL for the image
      billDate: new Date(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      billingPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      billingPeriodEnd: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      utilityType: 'electric',
      energyUsage: 0, // Will be filled by OCR
      totalAmount: 0, // Will be filled by OCR
      baseFee: 0,
      usageFee: 0,
      taxesAndFees: 0,
      previousBalance: 0,
      payments: 0,
      provider: '',
      accountNumber: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending'
    }
    
    return mockBill
  }
  
  // Extract bill data using OCR
  async extractBillData(billId: string): Promise<BillData> {
    // In a real app, this would be done server-side
    // return axios.post(`${this.apiUrl}/${billId}/extract`)
    
    // For demo purposes, we'll run a simple OCR using Tesseract.js
    // Since we don't have real bill images, we'll simulate OCR results
    
    // Simulate OCR processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Return simulated bill data
    return {
      energyUsage: Math.floor(Math.random() * 1000) + 500, // Random kWh between 500-1500
      totalAmount: Math.floor(Math.random() * 200) + 80, // Random amount between $80-$280
      baseFee: 20, // Standard base fee
      usageFee: Math.floor(Math.random() * 150) + 50, // Random usage fee
      taxesAndFees: Math.floor(Math.random() * 20) + 5, // Random taxes
      provider: 'EcoElectric',
      accountNumber: '1234567890',
      status: 'processed',
      ocrConfidence: {
        overall: 0.85,
        dates: 0.9,
        amounts: 0.85,
        usage: 0.8
      }
    }
  }
  
  // Update bill data (manual correction or additional info)
  async updateBillData(billId: string, data: BillData): Promise<Bill> {
    // Simulate API call
    // In production: return axios.put(`${this.apiUrl}/${billId}`, data)
    
    // For demo purposes
    const bills = this.getMockBills()
    const billIndex = bills.findIndex(b => b.id === billId)
    
    if (billIndex === -1) {
      throw new Error('Bill not found')
    }
    
    // Update bill with new data
    const updatedBill = {
      ...bills[billIndex],
      ...data,
      updatedAt: new Date(),
      status: 'verified'
    }
    
    return updatedBill
  }
  
  // Delete a bill
  async deleteBill(billId: string): Promise<void> {
    // Simulate API call
    // In production: return axios.delete(`${this.apiUrl}/${billId}`)
    
    // For demo purposes, just return success
    return Promise.resolve()
  }
  
  // Helper to generate mock bills for demo purposes
  private getMockBills(): Bill[] {
    const currentDate = new Date()
    const bills: Bill[] = []
    
    // Generate bills for the last 6 months
    for (let i = 0; i < 6; i++) {
      const monthOffset = i
      const billDate = new Date(currentDate)
      billDate.setMonth(billDate.getMonth() - monthOffset)
      
      const periodEnd = new Date(billDate)
      periodEnd.setDate(periodEnd.getDate() - 5)
      
      const periodStart = new Date(periodEnd)
      periodStart.setDate(periodStart.getDate() - 30)
      
      const dueDate = new Date(billDate)
      dueDate.setDate(dueDate.getDate() + 15)
      
      // Calculate a somewhat realistic usage pattern (higher in summer/winter)
      const baseUsage = 700 // kWh
      const seasonalVariation = Math.abs(((billDate.getMonth() + 6) % 12) - 6) / 3 * 300
      const randomVariation = Math.random() * 100 - 50
      const usage = baseUsage + seasonalVariation + randomVariation
      
      // Calculate cost based on usage
      const baseFee = 20
      const ratePerKWh = 0.14
      const usageFee = usage * ratePerKWh
      const taxesAndFees = usageFee * 0.08
      const totalAmount = baseFee + usageFee + taxesAndFees
      
      bills.push({
        id: `bill-${i}`,
        userId: '123456',
        imageUrl: `https://via.placeholder.com/800x1000?text=Utility+Bill+${billDate.toLocaleDateString()}`,
        billDate: billDate,
        dueDate: dueDate,
        billingPeriodStart: periodStart,
        billingPeriodEnd: periodEnd,
        utilityType: 'electric',
        energyUsage: Math.round(usage),
        totalAmount: Math.round(totalAmount * 100) / 100,
        baseFee: baseFee,
        usageFee: Math.round(usageFee * 100) / 100,
        taxesAndFees: Math.round(taxesAndFees * 100) / 100,
        previousBalance: 0,
        payments: Math.round(totalAmount * 100) / 100, // Assume previous bill was paid
        provider: 'EcoElectric',
        accountNumber: '1234567890',
        meterNumber: 'E123456',
        createdAt: new Date(billDate),
        updatedAt: new Date(billDate),
        status: 'verified'
      })
    }
    
    return bills
  }
}

export default new BillService()