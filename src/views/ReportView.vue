<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import ReportService from "../services/report.service";
import {
  BanknotesIcon,
  EyeIcon,
  BoltIcon,
  FireIcon,
  LightBulbIcon,
  TrophyIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const report = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format time
const formatTime = (dateTimeString) => {
  return new Date(dateTimeString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// Computed properties based on report data
const billingSummary = computed(() => report.value?.billingSummary || {});
const keyObservations = computed(() => report.value?.keyObservations || []);
const electricCostDrivers = computed(
  () => report.value?.electricCostDrivers || []
);
const gasCostDrivers = computed(() => report.value?.gasCostDrivers || []);
const tips = computed(() => report.value?.tips || []);
const quickWins = computed(() => report.value?.quickWins || []);

// Fetch report data
const fetchReport = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const { homeId, reportId } = route.query;
    if (!homeId || !reportId) {
      throw new Error("Missing homeId or reportId");
    }

    const reportData = await ReportService.getReport(homeId, reportId);
    report.value = reportData.utilityBillAnalysis;
  } catch (err) {
    console.error("Error fetching report:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchReport();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div
          class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Loading report...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <div class="bg-error-50 text-error-700 p-4 rounded-lg inline-block">
        <p class="font-medium">Error loading report</p>
        <p class="text-sm mt-1">{{ error }}</p>
      </div>
    </div>

    <!-- Report content -->
    <template v-else>
      <h1 class="text-3xl font-display font-bold text-gray-900 mb-6">
        Energy Usage Report
      </h1>

      <!-- Billing Summary Card -->
      <div class="card p-6 mb-8">
        <div class="flex items-center mb-4">
          <BanknotesIcon class="h-6 w-6 text-primary-500 mr-2" />
          <h2 class="text-xl font-bold text-gray-900">Billing Summary</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Billing Period -->
          <div>
            <h3 class="text-sm font-medium text-gray-500">Billing Period</h3>
            <p class="mt-1 text-lg text-gray-900">
              {{ formatDate(billingSummary.billingPeriodStart) }} -
              {{ formatDate(billingSummary.billingPeriodEnd) }}
            </p>
          </div>

          <!-- Electricity Usage -->
          <div>
            <h3 class="text-sm font-medium text-gray-500">Electricity Usage</h3>
            <p class="mt-1 text-lg text-gray-900">
              {{ billingSummary.electricity_kwh }} kWh
            </p>
            <p class="text-sm text-gray-500">
              {{ formatCurrency(billingSummary.electricity_cost) }}
            </p>
          </div>

          <!-- Gas Usage -->
          <div>
            <h3 class="text-sm font-medium text-gray-500">Gas Usage</h3>
            <p class="mt-1 text-lg text-gray-900">
              {{ billingSummary.gas_therms }} therms
            </p>
            <p class="text-sm text-gray-500">
              {{ formatCurrency(billingSummary.gas_cost) }}
            </p>
          </div>

          <!-- Rate Plan -->
          <div>
            <h3 class="text-sm font-medium text-gray-500">Rate Plan</h3>
            <p class="mt-1 text-lg text-gray-900">
              {{ billingSummary.rate_plan_name }}
            </p>
            <p class="text-sm text-gray-500">
              {{ billingSummary.utility_provider }}
            </p>
          </div>

          <!-- Solar Status -->
          <div>
            <h3 class="text-sm font-medium text-gray-500">Solar Status</h3>
            <p class="mt-1 text-lg text-gray-900">
              <span class="inline-flex items-center">
                {{ billingSummary.has_solar ? "Solar Installed" : "No Solar" }}
                <span
                  v-if="billingSummary.has_solar"
                  class="ml-2 text-success-500"
                  >●</span
                >
              </span>
            </p>
          </div>

          <!-- Peak Demand -->
          <div>
            <h3 class="text-sm font-medium text-gray-500">Highest Demand</h3>
            <p class="mt-1 text-lg text-gray-900">
              {{ billingSummary.highest_hourly_demand_kw }} kW
            </p>
            <p class="text-sm text-gray-500">
              at {{ formatTime(billingSummary.highest_demand_time) }}
            </p>
          </div>
        </div>

        <!-- Service Address -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-500">Service Address</h3>
          <p class="mt-1 text-lg text-gray-900">
            {{ billingSummary.serviceAddress.street }}<br />
            {{ billingSummary.serviceAddress.city }},
            {{ billingSummary.serviceAddress.state }}
            {{ billingSummary.serviceAddress.zipCode }}
          </p>
        </div>
      </div>

      <!-- Key Observations -->
      <div class="card p-6 mb-8">
        <div class="flex items-center mb-4">
          <EyeIcon class="h-6 w-6 text-secondary-500 mr-2" />
          <h2 class="text-xl font-bold text-gray-900">Key Observations</h2>
        </div>
        <ul class="space-y-3">
          <li
            v-for="(observation, index) in keyObservations"
            :key="index"
            class="flex items-start"
          >
            <div
              class="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-secondary-500"
            ></div>
            <p class="ml-4 text-gray-600">{{ observation }}</p>
          </li>
        </ul>
      </div>

      <!-- Cost Drivers Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Electric Cost Drivers -->
        <div class="card p-6">
          <div class="flex items-center mb-4">
            <BoltIcon class="h-6 w-6 text-primary-500 mr-2" />
            <h2 class="text-xl font-bold text-gray-900">
              Electric Cost Drivers
            </h2>
          </div>
          <ul class="space-y-3">
            <li
              v-for="(driver, index) in electricCostDrivers"
              :key="index"
              class="flex items-start"
            >
              <div
                class="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-primary-100 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-primary-700">{{
                  index + 1
                }}</span>
              </div>
              <p class="ml-3 text-gray-600">{{ driver }}</p>
            </li>
          </ul>
        </div>

        <!-- Gas Cost Drivers -->
        <div class="card p-6">
          <div class="flex items-center mb-4">
            <FireIcon class="h-6 w-6 text-accent-500 mr-2" />
            <h2 class="text-xl font-bold text-gray-900">Gas Cost Drivers</h2>
          </div>
          <ul class="space-y-3">
            <li
              v-for="(driver, index) in gasCostDrivers"
              :key="index"
              class="flex items-start"
            >
              <div
                class="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-accent-100 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-accent-700">{{
                  index + 1
                }}</span>
              </div>
              <p class="ml-3 text-gray-600">{{ driver }}</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Energy Saving Tips -->
      <div class="card p-6 mb-8">
        <div class="flex items-center mb-4">
          <LightBulbIcon class="h-6 w-6 text-accent-500 mr-2" />
          <h2 class="text-xl font-bold text-gray-900">Energy Saving Tips</h2>
        </div>
        <ul class="space-y-3">
          <li
            v-for="(tip, index) in tips"
            :key="index"
            class="flex items-start"
          >
            <div
              class="flex-shrink-0 w-8 h-8 mt-0.5 rounded-full bg-accent-100 flex items-center justify-center"
            >
              <span class="text-sm font-medium text-accent-700">{{
                index + 1
              }}</span>
            </div>
            <p class="ml-3 text-gray-600">{{ tip }}</p>
          </li>
        </ul>
      </div>

      <!-- Quick Wins -->
      <div class="card p-6">
        <div class="flex items-center mb-4">
          <TrophyIcon class="h-6 w-6 text-success-500 mr-2" />
          <h2 class="text-xl font-bold text-gray-900">Quick Wins</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(win, index) in quickWins"
            :key="index"
            class="p-4 bg-success-50 border border-success-200 rounded-lg"
          >
            <h3 class="font-medium text-success-900">{{ win.strategy }}</h3>
            <p class="mt-1 text-success-700">
              Estimated savings: {{ win.estimated_savings }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
