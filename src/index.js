import DateRangePicker from "./DateRangePicker.vue";
import "./style.css";

export default DateRangePicker;

// Optional: Allow use as a plugin
export function install(app) {
  app.component("DateRangePicker", DateRangePicker);
}
