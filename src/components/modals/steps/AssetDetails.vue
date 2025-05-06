<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../../../stores/auth";
import { useFirebaseStorage } from "../../../composables/useFirebaseStorage";
import homeAssetChecklist from "../../../configs/homeAssetChecklist";

const props = defineProps({
  homeId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["assetsComplete", "previous"]);

const authStore = useAuthStore();
const { uploadFile, uploadStatus } = useFirebaseStorage();
const assetPhotos = ref({});
const assetUrls = ref([]);

// Compute if all uploaded photos are complete
const isAllUploadsComplete = computed(() => {
  return Object.values(assetPhotos.value).every((photos) =>
    photos.every((photo) => photo.uploadStatus === "complete")
  );
});

const handleAppliancePhotosSelect = async (event, assetId) => {
  const files = Array.from(
    event.target.files || event.dataTransfer?.files || []
  );

  // Process each file individually
  for (const file of files) {
    // Create photo object with initial uploading state
    const photo = {
      file,
      previewUrl: URL.createObjectURL(file),
      uploadStatus: "uploading",
    };

    // Initialize the asset's photo array if it doesn't exist
    if (!assetPhotos.value[assetId]) {
      assetPhotos.value[assetId] = [];
    }

    // Add new photo to the asset's array
    const photoIndex = assetPhotos.value[assetId].length;
    assetPhotos.value[assetId].push(photo);

    try {
      const userId = authStore.user.id;
      const storagePath = `users/${userId}/homes/${props.homeId}/assets/${assetId}`;
      const downloadUrl = await uploadFile(file, storagePath);

      // Update status for the uploaded photo
      if (assetPhotos.value[assetId][photoIndex]) {
        assetPhotos.value[assetId][photoIndex].uploadStatus = "complete";
        assetPhotos.value[assetId][photoIndex].downloadUrl = downloadUrl;
      }

      // Update assetUrls array
      const existingAssetIndex = assetUrls.value.findIndex(
        (asset) => asset.asset_id === assetId
      );
      if (existingAssetIndex !== -1) {
        assetUrls.value[existingAssetIndex].images.push(downloadUrl);
      } else {
        assetUrls.value.push({
          asset_id: assetId,
          images: [downloadUrl],
        });
      }
    } catch (error) {
      console.error("Error uploading home asset:", error);
      if (assetPhotos.value[assetId][photoIndex]) {
        assetPhotos.value[assetId][photoIndex].uploadStatus = "error";
      }
    }
  }
};

const removeAppliancePhoto = (assetId, index) => {
  const photo = assetPhotos.value[assetId][index];
  URL.revokeObjectURL(photo.previewUrl);

  // Remove the URL from assetUrls array
  const assetUrlIndex = assetUrls.value.findIndex(
    (asset) => asset.asset_id === assetId
  );
  if (assetUrlIndex !== -1) {
    const downloadUrl = photo.downloadUrl;
    const imageIndex =
      assetUrls.value[assetUrlIndex].images.indexOf(downloadUrl);
    if (imageIndex !== -1) {
      assetUrls.value[assetUrlIndex].images.splice(imageIndex, 1);

      // If no more images for this asset, remove the entire asset entry
      if (assetUrls.value[assetUrlIndex].images.length === 0) {
        assetUrls.value.splice(assetUrlIndex, 1);
      }
    }
  }

  // Remove the photo from assetPhotos
  assetPhotos.value[assetId].splice(index, 1);
};

const handleNext = () => {
  emit("assetsComplete", assetUrls.value);
};

const handlePrevious = () => {
  emit("previous");
};
</script>

<template>
  <div>
    <div class="mb-8">
      <label class="form-label">Help Us Understand Your Home</label>
      <p class="mt-1 text-sm text-gray-500 mb-4">
        Upload photos of your home's key systems to help us provide personalized
        energy-saving recommendations.
      </p>

      <!-- Asset sections -->
      <div v-for="asset in homeAssetChecklist" :key="asset.id" class="mb-8">
        <div class="flex items-start mb-2">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">{{ asset.label }}</h3>
            <p class="text-sm text-gray-500">{{ asset.description }}</p>
          </div>
        </div>

        <!-- Photo Grid -->
        <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 mb-4">
          <div
            v-for="(photo, index) in assetPhotos[asset.id]"
            :key="index"
            class="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
          >
            <!-- Upload Status Overlay -->
            <div
              v-if="photo.uploadStatus === 'uploading'"
              class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10"
            >
              <div class="animate-spin h-5 w-5 text-primary-500">
                <svg
                  class="h-5 w-5"
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
            </div>

            <img
              :src="photo.previewUrl"
              class="w-full h-full object-cover"
              :alt="`${asset.label} photo`"
            />

            <button
              type="button"
              class="absolute top-0.5 right-0.5 bg-white text-error-500 rounded-full p-1 shadow-md hover:bg-error-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-error-500"
              @click="removeAppliancePhoto(asset.id, index)"
            >
              <svg
                class="w-3 h-3"
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

            <!-- Upload Status Indicator -->
            <div
              v-if="photo.uploadStatus === 'complete'"
              class="absolute bottom-0.5 right-0.5 bg-success-500 text-white rounded-full p-1 shadow-md"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div
              v-if="photo.uploadStatus === 'error'"
              class="absolute bottom-0.5 right-0.5 bg-error-500 text-white rounded-full p-1 shadow-md"
            >
              <svg
                class="w-3 h-3"
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
            </div>
          </div>

          <!-- Upload Button -->
          <label
            class="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
          >
            <div class="text-center">
              <svg
                class="mx-auto h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span class="mt-1 block text-xs font-medium text-gray-600">
                Add
              </span>
            </div>
            <input
              type="file"
              class="sr-only"
              accept="image/*"
              multiple
              capture="environment"
              @change="(event) => handleAppliancePhotosSelect(event, asset.id)"
            />
          </label>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-6">
      <button type="button" class="btn-outline" @click="handlePrevious">
        Back
      </button>
      <button
        type="button"
        class="btn-primary"
        :disabled="!isAllUploadsComplete"
        :class="{ 'opacity-50 cursor-not-allowed': !isAllUploadsComplete }"
        @click="handleNext"
      >
        Next
      </button>
    </div>
  </div>
</template>
