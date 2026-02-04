<template>
  <div class="date-range-picker">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Start Date</label>
        <input
          type="date"
          v-model="startDate"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">End Date</label>
        <input
          type="date"
          v-model="endDate"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div v-if="startDate && endDate" class="p-3 bg-gray-100 rounded-md">
        <p class="text-sm">Selected: {{ startDate }} to {{ endDate }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DateRangePicker",
  data() {
    return {
      startDate: "",
      endDate: "",
    };
  },
};
</script>
