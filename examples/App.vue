<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-md mx-auto">
      <h1 class="text-3xl font-bold mb-6">DateRangePicker Demo</h1>
      <DateRangePicker />
    </div>
  </div>
</template>

<script>
import DateRangePicker from "../src/DateRangePicker.vue";

export default {
  name: "App",
  components: {
    DateRangePicker,
  },
};
</script>
