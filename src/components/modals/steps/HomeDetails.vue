<script setup>
import { ref, computed, watch } from "vue";
import { useAuthStore } from "../../../stores/auth";
import { useFirebaseStorage } from "../../../composables/useFirebaseStorage";

const { uploadFile, uploadStatus } = useFirebaseStorage();

const props = defineProps({
  homeId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["homeDetailsComplete"]);

const authStore = useAuthStore();
const homeName = ref("");
const utilityBillFullpath = ref(null);
const selectedBillFile = ref(null);
const billPreviewUrl = ref(null);
const isDragging = ref(false);

const isNextButtonEnabled = computed(() => {
  return homeName.value !== "" && utilityBillFullpath.value !== null;
});

const handleBillSelect = async (event) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file) {
    selectedBillFile.value = file;
    billPreviewUrl.value = URL.createObjectURL(file);

    try {
      const userId = authStore.user.id;
      const storagePath = `users/${userId}/homes/${props.homeId}/utilityBills`;
      utilityBillFullpath.value = await uploadFile(file, storagePath);
      console.log("utilityBillFullpath.value", utilityBillFullpath.value);
      console.log("uploadStatus", uploadStatus);
    } catch (error) {
      console.error("Error uploading utility bill:", error);
    }
  }
};

const handleNext = () => {
  emit("homeDetailsComplete", {
    homeName: homeName.value,
    utilityBillFullpath: utilityBillFullpath.value,
  });
};
const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  handleBillSelect(event);
};

const clearBillFile = () => {
  selectedBillFile.value = null;
  if (billPreviewUrl.value) {
    URL.revokeObjectURL(billPreviewUrl.value);
    billPreviewUrl.value = null;
  }
};
</script>

<template>
  <div>
    <!-- Home Name -->
    <div class="mb-8">
      <label for="home-name" class="form-label">Home Name</label>
      <input
        id="home-name"
        v-model="homeName"
        type="text"
        class="form-input mt-1"
        placeholder="e.g., Main Residence"
        required
      />
      <p class="mt-2 text-sm text-gray-500">
        Choose a name that helps you identify this property easily.
      </p>
    </div>

    <!-- Bill Upload -->
    <div class="mb-8">
      <label class="form-label">Upload Most Recent Utility Bill</label>
      <div
        class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-lg transition-colors duration-150 relative"
        :class="[
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : selectedBillFile
            ? 'border-primary-200 bg-primary-50 border-solid'
            : 'border-gray-300 border-dashed hover:border-primary-400',
        ]"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <!-- Upload Status Overlay -->
        <div
          v-if="uploadStatus.status === 'uploading'"
          class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg z-10"
        >
          <div class="text-center">
            <div class="animate-spin h-8 w-8 text-primary-500 mx-auto mb-2">
              <svg
                class="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p class="text-sm text-primary-700">Uploading bill...</p>
          </div>
        </div>

        <div class="space-y-1 text-center">
          <!-- Preview -->
          <div v-if="selectedBillFile" class="mb-4">
            <div class="relative inline-block">
              <img
                v-if="
                  billPreviewUrl && selectedBillFile.type.startsWith('image/')
                "
                :src="billPreviewUrl"
                class="max-h-48 rounded-lg shadow-md"
                alt="Bill preview"
              />
              <div
                v-else
                class="bg-primary-50 p-6 rounded-lg shadow-sm border border-primary-100 text-primary-700"
              >
                <svg
                  class="h-8 w-8 mx-auto mb-2 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {{ selectedBillFile.name }}
              </div>
              <button
                type="button"
                class="absolute -top-2 -right-2 bg-white text-error-500 rounded-full p-1.5 shadow-md hover:bg-error-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-error-500"
                @click="clearBillFile"
              >
                <svg
                  class="w-4 h-4"
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

          <!-- Upload UI -->
          <div v-if="!selectedBillFile" class="py-4">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="flex text-sm text-gray-600 mt-4 justify-center">
              <label
                class="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
              >
                <span>Upload a file</span>
                <input
                  type="file"
                  class="sr-only"
                  accept=".pdf,.png,.jpg,.jpeg"
                  @change="handleBillSelect"
                />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              PDF, PNG, or JPG up to 10MB
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-end mt-6">
      <button
        type="button"
        class="btn-primary"
        :class="{ 'opacity-50 cursor-not-allowed': !isNextButtonEnabled }"
        :disabled="!isNextButtonEnabled"
        @click="handleNext"
      >
        Next
      </button>
    </div>
  </div>
</template>
