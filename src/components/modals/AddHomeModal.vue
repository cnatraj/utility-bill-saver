<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useHomesStore } from "../../stores/homes";
import { v4 as uuidv4 } from "uuid";
import HomeDetails from "./steps/HomeDetails.vue";
import AssetDetails from "./steps/AssetDetails.vue";
import Finalizing from "./steps/Finalizing.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const authStore = useAuthStore();
const homesStore = useHomesStore();
const currentStep = ref(1);
const homeName = ref("");
const homeId = ref(null);
const utilityBillFullpath = ref(null);
const assetUrls = ref([]);
const uploadStatus = ref({
  utilityBill: { status: "pending", error: null },
  homeAssets: { status: "pending", error: null },
});

onMounted(() => {
  homeId.value = uuidv4();
});

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

const handleSubmit = async () => {
  if (!homeName.value) {
    return;
  }

  try {
    emit("close");
  } catch (error) {
    console.error("Error adding home:", error);
  }
};

const resetForm = () => {
  currentStep.value = 1;
  homeName.value = "";
  assetUrls.value = [];
  uploadStatus.value = {
    utilityBill: { status: "pending", error: null },
    homeAssets: { status: "pending", error: null },
  };
  homeId.value = uuidv4(); // Generate new homeId when form is reset
};

const handleClose = () => {
  resetForm();
  emit("close");
};

const handleHomeDetailsComplete = (data) => {
  console.log("handleHomeDetailsComplete");

  homeName.value = data.homeName;
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

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity"
      @click="handleClose"
    ></div>

    <!-- Modal -->
    <div class="fixed inset-0 z-10 overflow-y-auto bg-gray-50">
      <div class="min-h-screen">
        <!-- Header -->
        <div
          class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 shadow-sm"
        >
          <div class="flex items-center justify-between max-w-5xl mx-auto">
            <div>
              <h2 class="text-2xl font-display font-bold text-gray-900">
                Add New Home
              </h2>
              <div class="mt-1 flex items-center space-x-2">
                <span
                  v-for="step in steps"
                  :key="step.id"
                  class="flex items-center"
                >
                  <div
                    class="flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium"
                    :class="[
                      currentStep === step.id
                        ? 'bg-primary-500 text-white'
                        : currentStep > step.id
                        ? 'bg-primary-200 text-primary-700'
                        : 'bg-gray-200 text-gray-500',
                    ]"
                  >
                    {{ step.id }}
                  </div>
                  <span
                    class="ml-2 text-sm font-medium"
                    :class="[
                      currentStep === step.id
                        ? 'text-gray-900'
                        : 'text-gray-500',
                    ]"
                  >
                    {{ step.name }}
                  </span>
                  <svg
                    v-if="step.id !== steps.length"
                    class="ml-2 h-5 w-5 text-gray-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <button
              type="button"
              class="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              @click="handleClose"
            >
              <span class="sr-only">Close</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="max-w-5xl mx-auto px-4 py-8 sm:px-6">
          <form
            @submit.prevent="handleSubmit"
            class="bg-white rounded-lg shadow-sm p-6"
          >
            <!-- Step 1: Home Details -->
            <HomeDetails
              v-if="currentStep === 1"
              :home-id="homeId"
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
      </div>
    </div>
  </div>
</template>
