<template>
  <h1 class="text-3xl font-display font-bold text-gray-900 mb-6">
    Get Your Savings Report
  </h1>

  <!-- Content -->
  <div class="mx-auto">
    <form class="bg-white rounded-lg shadow-sm p-8">
      <!-- Header -->
      <Header :steps="steps" :current-step="currentStep" />

      <!-- Step 1: Home Details -->
      <HomeDetails
        v-if="currentStep === 1"
        @homeDetailsComplete="handleHomeDetailsComplete"
      />

      <!-- Step 2: Appliance Photos -->
      <AssetDetails
        v-else-if="currentStep === 2"
        :home-id="homeId"
        @assetsComplete="handleAssetsComplete"
      />

      <!-- Step 3: Finalizing -->
      <Finalizing
        v-else-if="currentStep === 3"
        :home-id="homeId"
        :utility-bill-fullpath="utilityBillFullpath"
        :asset-urls="assetUrls"
      />
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useHomesStore } from "@/stores/homes";
import { v4 as uuidv4 } from "uuid";

import HomeDetails from "@/components/addReport/HomeDetails.vue";
import AssetDetails from "@/components/addReport/AssetDetails.vue";
import Finalizing from "@/components/addReport/Finalizing.vue";
import Header from "../components/addReport/Header.vue";

// import HomeDetails from "@/steps/HomeDetails.vue";
// import AssetDetails from "@/steps/AssetDetails.vue";
// import Finalizing from "@/steps/Finalizing.vue";

const authStore = useAuthStore();
const homesStore = useHomesStore();
const currentStep = ref(1);
const homeName = ref("");
const homeId = ref(null);
const utilityBillFullpath = ref(null);
const assetUrls = ref([]);

const steps = [
  { id: 1, name: "Home Details" },
  { id: 2, name: "Assets" },
  { id: 3, name: "Finalizing" },
];

const isFirstStep = computed(() => currentStep.value === 1);
const isLastStep = computed(() => currentStep.value === steps.length);

const nextStep = () => {
  if (!isLastStep.value) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (!isFirstStep.value) {
    currentStep.value--;
  }
};

const handleHomeDetailsComplete = (data) => {
  console.log("handleHomeDetailsComplete");

  homeName.value = data.homeName;
  homeId.value = data.homeId;
  utilityBillFullpath.value = data.utilityBillFullpath;

  nextStep();
  console.log("data", data);
};

const handleAssetsComplete = (urls) => {
  console.log("handleAssetsComplete", urls);
  assetUrls.value = urls;
  nextStep();
};
</script>
