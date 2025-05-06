<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import OpenAIService from "../../../services/openai.service";
import statusMessages from "../../../configs/statusMessages";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  homeId: {
    type: String,
    required: true,
  },
  utilityBillFullpath: {
    type: String,
    required: true,
  },
  assetUrls: {
    type: Array,
    required: true,
  },
});

const reportId = ref("");
const analysisStatus = ref("analyzing"); // analyzing, complete, error
const error = ref(null);
const currentMessageIndex = ref(0);
const currentMessage = ref(statusMessages[0].message);
const currentIcon = ref(statusMessages[0].icon);
let messageInterval = null;

onMounted(() => {
  reportId.value = uuidv4();
  performAnalysis();

  // Start cycling through status messages
  messageInterval = setInterval(() => {
    currentMessageIndex.value =
      (currentMessageIndex.value + 1) % statusMessages.length;
    currentMessage.value = statusMessages[currentMessageIndex.value].message;
    currentIcon.value = statusMessages[currentMessageIndex.value].icon;
  }, 3000);
});

onUnmounted(() => {
  clearInterval(messageInterval);
});

const performAnalysis = async () => {
  try {
    analysisStatus.value = "analyzing";
    error.value = null;

    // Generate analysis using OpenAI
    const result = await OpenAIService.analyzeUtilityBill(
      props.homeId,
      props.utilityBillFullpath
    );

    analysisStatus.value = "complete";
    clearInterval(messageInterval);

    console.log("result", result);

    analysisStatus.value = "complete";
  } catch (err) {
    console.error("Error analyzing home:", err);
    error.value = err.message;
    analysisStatus.value = "error";
    clearInterval(messageInterval);
  }
};
</script>

<template>
  <div class="text-center p-6">
    <!-- In progress-->
    <div v-if="analysisStatus === 'analyzing'">
      <div
        class="w-10 h-10 flex items-center justify-center rounded-md bg-primary-100 mx-auto"
      >
        <component :is="currentIcon" class="h-6 w-6 text-primary-500" />
      </div>
      <div class="text-xl font-semibold text-primary-900 mx-auto mt-4">
        {{ currentMessage }}
      </div>
    </div>

    <!-- Complete -->
    <div v-if="analysisStatus === 'complete'">
      <div
        class="w-10 h-10 flex items-center justify-center rounded-md bg-primary-100 mx-auto"
      >
        <CheckIcon class="h-6 w-6 text-primary-500" />
      </div>
      <div class="text-xl font-semibold text-primary-900 mx-auto mt-4">
        Analysis Complete!
      </div>
      <button @click="$router.push('/report')" class="btn-primary mt-4">
        View Report
      </button>
    </div>

    <!-- Error -->
    <div v-if="analysisStatus === 'error'">
      <div
        class="w-10 h-10 flex items-center justify-center rounded-md bg-error-100 mx-auto"
      >
        <ExclamationTriangleIcon class="h-6 w-6 text-error-500" />
      </div>
      <div class="text-xl font-semibold text-error-900 mx-auto mt-4">
        {{ error }}
      </div>
    </div>
  </div>
</template>
