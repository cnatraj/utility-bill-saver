import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Bill, BillData } from '../types/bill'
import BillService from '../services/bill.service'

export const useBillStore = defineStore('bill', () => {
  const bills = ref<Bill[]>([])
  const currentBill = ref<Bill | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Get all bills for the current user
  const fetchUserBills = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const userBills = await BillService.getUserBills()
      bills.value = userBills
      
      return userBills
    } catch (err) {
      error.value = 'Failed to fetch bills.'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Get a single bill by ID
  const fetchBill = async (billId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const bill = await BillService.getBill(billId)
      currentBill.value = bill
      
      return bill
    } catch (err) {
      error.value = 'Failed to fetch bill details.'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Upload a new bill image and extract data using OCR
  const uploadBill = async (billImage: File) => {
    try {
      isLoading.value = true
      error.value = null
      
      // First upload the bill image
      const uploadedBill = await BillService.uploadBillImage(billImage)
      
      // Then extract data using OCR
      const extractedData = await BillService.extractBillData(uploadedBill.id)
      
      // Update the current bill with extracted data
      currentBill.value = {
        ...uploadedBill,
        ...extractedData
      }
      
      // Add to bills array if not already present
      const existingIndex = bills.value.findIndex(b => b.id === uploadedBill.id)
      if (existingIndex >= 0) {
        bills.value[existingIndex] = currentBill.value
      } else {
        bills.value.push(currentBill.value)
      }
      
      return currentBill.value
    } catch (err) {
      error.value = 'Failed to upload or process bill.'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Save manually entered bill data
  const saveBillData = async (billId: string, data: BillData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const updatedBill = await BillService.updateBillData(billId, data)
      
      // Update the current bill
      currentBill.value = updatedBill
      
      // Update in bills array
      const index = bills.value.findIndex(b => b.id === billId)
      if (index >= 0) {
        bills.value[index] = updatedBill
      }
      
      return updatedBill
    } catch (err) {
      error.value = 'Failed to save bill data.'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Delete a bill
  const deleteBill = async (billId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await BillService.deleteBill(billId)
      
      // Remove from bills array
      bills.value = bills.value.filter(b => b.id !== billId)
      
      // Clear current bill if it's the one being deleted
      if (currentBill.value?.id === billId) {
        currentBill.value = null
      }
      
      return true
    } catch (err) {
      error.value = 'Failed to delete bill.'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Computed: Get bills sorted by date (newest first)
  const sortedBills = computed(() => {
    return [...bills.value].sort((a, b) => {
      return new Date(b.billDate).getTime() - new Date(a.billDate).getTime()
    })
  })
  
  // Computed: Calculate total energy usage across all bills
  const totalEnergyUsage = computed(() => {
    return bills.value.reduce((total, bill) => total + bill.energyUsage, 0)
  })
  
  // Computed: Calculate total cost across all bills
  const totalCost = computed(() => {
    return bills.value.reduce((total, bill) => total + bill.totalAmount, 0)
  })
  
  return {
    bills,
    currentBill,
    isLoading,
    error,
    sortedBills,
    totalEnergyUsage,
    totalCost,
    fetchUserBills,
    fetchBill,
    uploadBill,
    saveBillData,
    deleteBill
  }
})