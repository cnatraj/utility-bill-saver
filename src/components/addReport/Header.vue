<template>
  <div class="mt-1 flex items-center space-x-2 mb-8">
    <span v-for="step in props.steps" :key="step.id" class="flex items-center">
      <div
        class="flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium"
        :class="[
          props.currentStep === step.id
            ? 'bg-primary-500 text-white'
            : props.currentStep > step.id
            ? 'bg-primary-200 text-primary-700'
            : 'bg-gray-200 text-gray-500',
        ]"
      >
        {{ step.id }}
      </div>
      <span
        class="ml-2 text-sm font-medium"
        :class="[
          props.currentStep === step.id ? 'text-gray-900' : 'text-gray-500',
        ]"
      >
        {{ step.name }}
      </span>
      <ChevronRightIcon
        v-if="step.id !== steps.length"
        class="size-4 ml-2"
        :class="
          props.currentStep === step.id ? 'text-primary-700' : 'text-gray-300'
        "
      />
    </span>
  </div>
</template>

<script setup>
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
});
</script>
