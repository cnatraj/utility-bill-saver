<script setup>
import { ref, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../../lib/firebase'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import OpenAIService from '../../../services/openai.service'

const props = defineProps({
  homeId: {
    type: String,
    required: true
  },
  uploadStatus: {
    type: Object,
    required: true
  }
})

const reportId = ref('')
const analysisStatus = ref('pending') // pending, analyzing, complete, error
const error = ref(null)

onMounted(() => {
  reportId.value = uuidv4()
  if (uploadStatus.utilityBill.status === 'complete' && uploadStatus.homeAssets.status === 'complete') {
    performAnalysis()
  }
})

const performAnalysis = async () => {
  try {
    analysisStatus.value = 'analyzing'
    error.value = null

    // Generate analysis using OpenAI
    const result = await OpenAIService.generateHomeAnalysis(
      props.homeId,
      props.uploadStatus.utilityBill.url,
      props.uploadStatus.homeAssets.urls || []
    )

    // Store analysis in Firestore
    const reportRef = doc(db, `homes/${props.homeId}/reports/${reportId.value}`)
    await setDoc(reportRef, {
      id: reportId.value,
      homeId: props.homeId,
      analysis: result.analysis,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Update home document with reportId
    const homeRef = doc(db, 'homes', props.homeId)
    await updateDoc(homeRef, {
      reportId: reportId.value,
      updatedAt: new Date()
    })

    analysisStatus.value = 'complete'
  } catch (err) {
    console.error('Error analyzing home:', err)
    error.value = err.message
    analysisStatus.value = 'error'
  }
}
</script>

<template>
  <div>
    <!-- Utility Bill Upload Status -->
    <div class="flex items-center">
      <div class="mr-4">
        <div v-if="uploadStatus.utilityBill.status === 'uploading'" class="animate-spin h-6 w-6 text-primary-500">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="uploadStatus.utilityBill.status === 'complete'" class="h-6 w-6 text-success-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div v-else-if="uploadStatus.utilityBill.status === 'error'" class="h-6 w-6 text-error-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <div>
        <p class="font-medium text-gray-900">Uploading Utility Bill</p>
        <p v-if="uploadStatus.utilityBill.error" class="text-sm text-error-600">
          {{ uploadStatus.utilityBill.error }}
        </p>
      </div>
    </div>

    <!-- Home Assets Upload Status -->
    <div class="flex items-center mt-4">
      <div class="mr-4">
        <div v-if="uploadStatus.homeAssets.status === 'uploading'" class="animate-spin h-6 w-6 text-primary-500">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="uploadStatus.homeAssets.status === 'complete'" class="h-6 w-6 text-success-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div v-else-if="uploadStatus.homeAssets.status === 'error'" class="h-6 w-6 text-error-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <div>
        <p class="font-medium text-gray-900">Processing Home Assets</p>
        <p v-if="uploadStatus.homeAssets.error" class="text-sm text-error-600">
          {{ uploadStatus.homeAssets.error }}
        </p>
      </div>
    </div>

    <!-- Analysis Status -->
    <div class="flex items-center mt-4" v-if="uploadStatus.utilityBill.status === 'complete' && uploadStatus.homeAssets.status === 'complete'">
      <div class="mr-4">
        <div v-if="analysisStatus === 'analyzing'" class="animate-spin h-6 w-6 text-primary-500">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="analysisStatus === 'complete'" class="h-6 w-6 text-success-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div v-else-if="analysisStatus === 'error'" class="h-6 w-6 text-error-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <div>
        <p class="font-medium text-gray-900">Analyzing Your Home</p>
        <p v-if="error" class="text-sm text-error-600">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>