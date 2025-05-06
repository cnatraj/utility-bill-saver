<script setup>
import { ref, computed } from "vue";
import report from "../configs/report";

const billingSummary = computed(() => report.billingSummary);
const keyObservations = computed(() => report.keyObservations);
const electricCostDrivers = computed(() => report.electricCostDrivers);
const gasCostDrivers = computed(() => report.gasCostDrivers);
const tips = computed(() => report.tips);
const quickWins = computed(() => report.quickWins);

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
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-display font-bold text-gray-900 mb-6">
      Energy Usage Report
    </h1>

    <!-- Billing Summary Card -->
    <div class="card p-6 mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Billing Summary</h2>
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
      <h2 class="text-xl font-bold text-gray-900 mb-4">Key Observations</h2>
      <ul class="space-y-3">
        <li
          v-for="(observation, index) in keyObservations"
          :key="index"
          class="flex items-start"
        >
          <div
            class="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-primary-500"
          ></div>
          <p class="ml-4 text-gray-600">{{ observation }}</p>
        </li>
      </ul>
    </div>

    <!-- Cost Drivers Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Electric Cost Drivers -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          Electric Cost Drivers
        </h2>
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
        <h2 class="text-xl font-bold text-gray-900 mb-4">Gas Cost Drivers</h2>
        <ul class="space-y-3">
          <li
            v-for="(driver, index) in gasCostDrivers"
            :key="index"
            class="flex items-start"
          >
            <div
              class="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-secondary-100 flex items-center justify-center"
            >
              <span class="text-sm font-medium text-secondary-700">{{
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
      <h2 class="text-xl font-bold text-gray-900 mb-4">Energy Saving Tips</h2>
      <ul class="space-y-3">
        <li v-for="(tip, index) in tips" :key="index" class="flex items-start">
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
      <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Wins</h2>
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
  </div>
</template>
