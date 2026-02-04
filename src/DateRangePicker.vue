<script>
export default {
  name: "DateRangePicker",

  props: {
    placeholder: {
      type: String,
      default: "Select date range",
    },
    dateFormat: {
      type: String,
      default: "MM/DD/YYYY",
      validator: (value) => {
        const validFormats = [
          "MM/DD/YYYY",
          "DD/MM/YYYY",
          "YYYY-MM-DD",
          "DD-MM-YYYY",
          "MM-DD-YYYY",
        ];
        return validFormats.includes(value);
      },
    },
  },

  data() {
    return {
      isOpen: false,
      startDate: null,
      endDate: null,

      // Temporary start and end dates used during selection
      tempStartDate: null,
      tempEndDate: null,

      // The current month and year being displayed
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),

      // Array of month names
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],

      // Array of day names
      dayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    };
  },

  // Computed properties
  computed: {
    // Generate an array of days for the current month
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const startingDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      const days = [];

      // Add blank days for the beginning of the week
      for (let i = 0; i < startingDayOfWeek; i++) days.push(null);

      // Add days for the current month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(this.currentYear, this.currentMonth, i));
      }

      return days;
    },
  },

  // Methods
  methods: {
    // Toggle the dropdown open or closed
    toggleDropdown() {
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        // Save the current start and end dates
        this.tempStartDate = this.startDate;
        this.tempEndDate = this.endDate;

        // Add an event listener to close the dropdown when clicking outside
        this.$nextTick(() => {
          document.addEventListener("click", this.handleClickOutside);
        });
      } else {
        // Remove the event listener
        this.removeClickListener();
      }
    },

    // Handle clicks outside the dropdown
    handleClickOutside(event) {
      // If the click is within the dropdown, do nothing
      if (this.$refs.pickerContainer?.contains(event.target)) return;

      // Close the dropdown
      this.isOpen = false;
      this.removeClickListener();
    },

    // Select a date
    selectDate(date) {
      // If the date is invalid or disabled, do nothing
      if (!date || this.isDisabled(date)) return;

      // If no start date is selected, set the start date
      if (!this.tempStartDate || this.tempEndDate) {
        this.resetSelection(date);
      }
      // If the date is before the start date, update the start date
      else if (date < this.tempStartDate) {
        this.updateStartDate(date);
      }
      // Otherwise, update the end date
      else {
        this.updateEndDate(date);
      }
    },

    // Reset the selection to a single date
    resetSelection(date) {
      this.tempStartDate = this.startDate = date;
      this.tempEndDate = this.endDate = null;
    },

    // Update the start date
    updateStartDate(date) {
      this.tempStartDate = this.startDate = date;
    },

    // Update the end date
    updateEndDate(date) {
      this.tempEndDate = this.endDate = date;
    },

    // Check if a date is selected
    isSelected(date) {
      if (!date) return false;
      const time = date.getTime();
      return (
        this.tempStartDate?.getTime() === time ||
        this.tempEndDate?.getTime() === time
      );
    },

    // Check if a date is within the selected range
    isInRange(date) {
      if (!date || !this.tempStartDate || !this.tempEndDate) return false;
      const time = date.getTime();
      return (
        time > this.tempStartDate.getTime() && time < this.tempEndDate.getTime()
      );
    },

    // Check if a date is disabled
    isDisabled(date) {
      return false;
    },

    // Go to the previous month
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },

    // Go to the next month
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },

    // Format a date based on the dateFormat prop
    formatDate(date) {
      if (!date) return "";

      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();

      const formatMap = {
        "MM/DD/YYYY": `${month}/${day}/${year}`,
        "DD/MM/YYYY": `${day}/${month}/${year}`,
        "YYYY-MM-DD": `${year}-${month}-${day}`,
        "DD-MM-YYYY": `${day}-${month}-${year}`,
        "MM-DD-YYYY": `${month}-${day}-${year}`,
      };

      return formatMap[this.dateFormat] || `${month}/${day}/${year}`;
    },

    // Clear the selection
    clearSelection() {
      this.tempStartDate = this.tempEndDate = null;
      this.startDate = this.endDate = null;
      this.isOpen = false;
      this.removeClickListener();
    },

    // Apply the selection
    applySelection() {
      if (!this.tempStartDate || !this.tempEndDate) return;

      this.startDate = this.tempStartDate;
      this.endDate = this.tempEndDate;
      this.isOpen = false;
      this.removeClickListener();
    },

    // Remove the event listener
    removeClickListener() {
      document.removeEventListener("click", this.handleClickOutside);
    },
  },

  beforeUnmount() {
    this.removeClickListener();
  },
};
</script>

<template>
  <div class="date-range-picker relative" ref="pickerContainer">
    <div
      @click="toggleDropdown"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white flex items-center justify-between"
    >
      <span v-if="!startDate && !endDate" class="text-gray-400">
        {{ placeholder }}
      </span>
      <span v-else-if="startDate && !endDate" class="text-gray-900">
        {{ formatDate(startDate) }} -
      </span>
      <span v-else class="text-gray-900">
        {{ formatDate(startDate) }} - {{ formatDate(endDate) }}
      </span>
      <svg
        class="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full"
    >
      <div class="flex items-center justify-between mb-4">
        <button
          @click="previousMonth"
          class="p-1 hover:bg-gray-100 rounded"
          type="button"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div class="font-semibold text-gray-900">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </div>
        <button
          @click="nextMonth"
          class="p-1 hover:bg-gray-100 rounded"
          type="button"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in dayNames"
          :key="day"
          class="text-center text-xs font-medium text-gray-500 py-1"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="selectDate(day)"
          :class="[
            'text-center py-2 text-sm rounded-full cursor-pointer ',
            day ? 'hover:bg-blue-100' : 'invisible',
            isSelected(day) ? 'bg-blue-500 text-white hover:bg-blue-600' : '',
            isInRange(day) ? 'bg-blue-100' : '',
            !day || isDisabled(day) ? 'cursor-not-allowed opacity-50' : '',
          ]"
        >
          {{ day ? day.getDate() : "" }}
        </div>
      </div>

      <div class="flex gap-2 mt-4 pt-4 border-t border-gray-200">
        <button
          @click="clearSelection"
          class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          type="button"
        >
          Clear
        </button>
        <button
          @click="applySelection"
          class="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          type="button"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</template>
