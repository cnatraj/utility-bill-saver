<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useBillStore } from "../stores/bill";
import { useRecommendationStore } from "../stores/recommendation";
import { PlusIcon } from "@heroicons/vue/24/outline";

// Router
const router = useRouter();

// Stores
const authStore = useAuthStore();
const billStore = useBillStore();
const recommendationStore = useRecommendationStore();

// Loading states
const isLoading = ref(true);
const loadingMessage = ref("Loading your energy data...");

// User info
const user = computed(() => authStore.user);

// Create new report
const createNewReport = () => {
  router.push("/bill-analysis");
};

// Fetch data on component mount
onMounted(async () => {
  try {
    loadingMessage.value = "Loading your bills...";
    await billStore.fetchUserBills();

    loadingMessage.value = "Loading your recommendations...";
    await recommendationStore.fetchRecommendations();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
});

// Chart data for energy usage (last 6 months)
const energyUsageData = computed(() => {
  const bills = billStore.sortedBills.slice(0, 6).reverse();

  return {
    labels: bills.map((bill) => {
      const date = new Date(bill.billDate);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }),
    datasets: [
      {
        label: "Energy Usage (kWh)",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        borderColor: "rgb(52, 211, 153)",
        borderWidth: 2,
        data: bills.map((bill) => bill.energyUsage),
      },
    ],
  };
});

// Chart data for billing (last 6 months)
const billingData = computed(() => {
  const bills = billStore.sortedBills.slice(0, 6).reverse();

  return {
    labels: bills.map((bill) => {
      const date = new Date(bill.billDate);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }),
    datasets: [
      {
        label: "Total Cost ($)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        data: bills.map((bill) => bill.totalAmount),
      },
    ],
  };
});

// Recommendations for quick implementation
const quickRecommendations = computed(() => {
  return recommendationStore.pendingRecommendations
    .filter((rec) => rec.difficulty === "easy")
    .slice(0, 3);
});

// Calculate savings progress
const savingsProgress = computed(() => {
  const actualSavings = recommendationStore.realizedSavings;
  const potentialSavings = recommendationStore.totalEstimatedSavings;

  // Cap at 100% in case actual exceeds estimates
  const percentage = Math.min((actualSavings / potentialSavings) * 100, 100);

  return {
    percentage: isNaN(percentage) ? 0 : percentage,
    actual: actualSavings,
    potential: potentialSavings,
  };
});
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div
          class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-gray-600">{{ loadingMessage }}</p>
      </div>
    </div>

    <template v-else>
      <!-- Welcome header -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-display font-bold text-gray-900">
          Hi{{ " " + user?.firstName }}!
        </h1>
      </div>

      <!-- Create Report Section -->
      <div
        class="card p-6 mb-8 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200"
      >
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
              Ready to Slash Your Energy Costs?
            </h2>
            <p class="text-gray-600 mb-4">
              Upload your latest bill and we’ll show you simple ways to cut
              costs.
            </p>
          </div>
          <button
            @click="createNewReport"
            class="btn-primary flex items-center"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Get Started
          </button>
        </div>
      </div>

      <!-- Stats overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total energy used -->
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-md bg-primary-100 text-primary-700 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Total Energy Used</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ billStore.totalEnergyUsage }} kWh
              </p>
            </div>
          </div>
        </div>

        <!-- Total bills -->
        <div class="card p-6">
          <div class="flex items-center">
            <div
              class="p-3 rounded-md bg-secondary-100 text-secondary-700 mr-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Total Bills</p>
              <p class="text-2xl font-bold text-gray-900">
                ${{ billStore.totalCost.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Potential savings -->
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-md bg-accent-100 text-accent-700 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Potential Savings</p>
              <p class="text-2xl font-bold text-gray-900">
                ${{ recommendationStore.totalEstimatedSavings.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Realized savings -->
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-md bg-success-100 text-success-700 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Realized Savings</p>
              <p class="text-2xl font-bold text-gray-900">
                ${{ recommendationStore.realizedSavings.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Savings progress -->
      <div class="card p-6 mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4">
          Your Savings Progress
        </h2>

        <!-- Progress bar -->
        <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            class="bg-primary-500 h-4 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${savingsProgress.percentage}%` }"
          ></div>
        </div>

        <div class="flex justify-between text-sm text-gray-600">
          <span>Current: ${{ savingsProgress.actual.toFixed(2) }}</span>
          <span>Potential: ${{ savingsProgress.potential.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Charts section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Energy usage chart -->
        <div class="card p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">
            Energy Usage (Last 6 Months)
          </h2>
          <div class="h-64">
            <!-- Chart would go here in a real implementation -->
            <div
              class="bg-gray-100 h-full rounded-md flex items-center justify-center"
            >
              <p class="text-gray-500">Energy usage chart visualization</p>
            </div>
          </div>
        </div>

        <!-- Billing chart -->
        <div class="card p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">
            Bills (Last 6 Months)
          </h2>
          <div class="h-64">
            <!-- Chart would go here in a real implementation -->
            <div
              class="bg-gray-100 h-full rounded-md flex items-center justify-center"
            >
              <p class="text-gray-500">Billing chart visualization</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommended actions -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900">Recommended Actions</h2>
          <router-link
            to="/recommendations"
            class="text-sm text-primary-600 hover:text-primary-500"
          >
            View all
          </router-link>
        </div>

        <!-- List of quick recommendations -->
        <div v-if="quickRecommendations.length > 0" class="space-y-4">
          <div
            v-for="recommendation in quickRecommendations"
            :key="recommendation.id"
            class="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start">
              <div
                class="rounded-full p-2 bg-primary-100 text-primary-700 mr-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-gray-900">
                  {{ recommendation.title }}
                </h3>
                <p class="text-gray-600 text-sm mt-1">
                  {{ recommendation.description }}
                </p>

                <div class="flex flex-wrap items-center mt-3 text-sm">
                  <span
                    class="bg-primary-100 text-primary-800 px-2 py-1 rounded-md text-xs font-medium mr-2"
                  >
                    Save ~${{ recommendation.estimatedSavings.toFixed(2) }}
                  </span>
                  <span
                    class="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium mr-2"
                  >
                    {{
                      recommendation.difficulty.charAt(0).toUpperCase() +
                      recommendation.difficulty.slice(1)
                    }}
                  </span>
                  <span
                    class="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium"
                  >
                    {{
                      recommendation.category.charAt(0).toUpperCase() +
                      recommendation.category.slice(1)
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <div
            class="rounded-full bg-gray-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <p class="text-gray-600">No recommendations found.</p>
          <p class="text-sm text-gray-500 mt-1">
            Upload your utility bills to get personalized recommendations.
          </p>
          <router-link
            to="/bill-analysis"
            class="btn-primary inline-block mt-4"
          >
            Upload Bills
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>
