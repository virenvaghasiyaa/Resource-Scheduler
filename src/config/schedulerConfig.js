/**
 * Scheduler configuration options
 */
const schedulerConfig = {
  startHour: 9,
  endHour: 17,

  timeSlotDuration: 15,

  hourHeight: 4,

  showCurrentTime: true,

  colors: {
    appointment: {
      background: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-800",
    },
    unavailable: {
      background: "bg-gray-200",
      border: "border-gray-400",
      text: "text-gray-600",
    },
    currentTime: "border-red-500",
  },

  animation: {
    appointmentHover: 200,
    modalTransition: 300,
  },

  validation: {
    minAppointmentDuration: 15,
    maxAppointmentDuration: 240,
  },
};

export default schedulerConfig;
