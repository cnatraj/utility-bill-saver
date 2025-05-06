<script setup>
import { ref, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import OpenAIService from "../../../services/openai.service";

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
const analysisStatus = ref("pending"); // pending, analyzing, complete, error
const error = ref(null);

onMounted(() => {
  reportId.value = uuidv4();
  performAnalysis();
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

    console.log("result", result);

    analysisStatus.value = "complete";
  } catch (err) {
    console.error("Error analyzing home:", err);
    error.value = err.message;
    analysisStatus.value = "error";
  }
};
</script>

<template>
  <div v-if="analysisStatus === 'analyzing'">Loading...</div>
  <div v-else-if="analysisStatus === 'complete'">complete</div>
  <div v-if="analysisStatus === 'error'">Error...</div>
</template>
