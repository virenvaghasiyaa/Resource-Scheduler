import { motion } from "framer-motion";
import { useState } from "react";

function AppointmentItem({
  appointment,
  startHour,
  colors,
  isWeekView = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const startHourVal = appointment.start.getHours();
  const startMinuteVal = appointment.start.getMinutes();
  const endHourVal = appointment.end.getHours();
  const endMinuteVal = appointment.end.getMinutes();

  const startMinutesFromDayStart =
    (startHourVal - startHour) * 60 + startMinuteVal;
  const endMinutesFromDayStart = (endHourVal - startHour) * 60 + endMinuteVal;
  const durationMinutes = endMinutesFromDayStart - startMinutesFromDayStart;

  const topPosition = (startHourVal - startHour + startMinuteVal / 60) * 4;
  const heightPosition = (durationMinutes / 60) * 4;

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const isUnavailable = appointment.type === "unavailable";
  let bgColor, borderColor, textColor;

  if (isUnavailable) {
    bgColor = "bg-gray-200";
    borderColor = "border-gray-300";
    textColor = "text-gray-600";
  } else {
    bgColor = colors.appointment.background;
    borderColor = colors.appointment.border;
    textColor = colors.appointment.text;
  }

  if (isUnavailable) {
    return (
      <div
        className={`absolute left-1 right-1 ${bgColor} ${borderColor} border rounded-md`}
        style={{
          top: `${topPosition}rem`,
          height: `${heightPosition}rem`,
          backgroundImage: `repeating-linear-gradient(135deg, rgba(0,0,0,0.07), rgba(0,0,0,0.07) 5px, rgba(0,0,0,0) 5px, rgba(0,0,0,0) 10px)`,
          backgroundSize: "10px 10px",
        }}
      />
    );
  }

  if (isWeekView) {
    return (
      <motion.div
        className={`absolute left-1 right-1 ${bgColor} ${borderColor} ${textColor} border rounded-md overflow-hidden transition-all duration-300 cursor-pointer z-10`}
        style={{
          top: `${topPosition}rem`,
          height: `${heightPosition}rem`,
          minHeight: "1.5rem",
        }}
        initial={{ opacity: 1 }}
        whileHover={{
          scale: 1.03,
          zIndex: 50,
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
          backgroundColor: "#dbeafe",
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
      >
        <div className="p-1 h-full flex flex-col transition-all duration-300">
          <div className="text-xs font-semibold truncate">
            {appointment.title}
          </div>

          <div
            className={`flex-grow overflow-hidden transition-all duration-300 ${
              isExpanded ? "opacity-100 mt-1" : "opacity-0 h-0"
            }`}
          >
            <div className="text-xs text-gray-600">
              {formatTime(appointment.start)} - {formatTime(appointment.end)}
            </div>

            {appointment.client && (
              <div className="text-xs mt-1">
                <span className="font-medium">Client:</span>{" "}
                {appointment.client}
              </div>
            )}

            {appointment.location && (
              <div className="text-xs mt-1">
                <span className="font-medium">Location:</span>{" "}
                {appointment.location}
              </div>
            )}

            {appointment.details && (
              <div className="text-xs mt-1">
                <span className="font-medium">Details:</span> {appointment.details}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`absolute left-1 right-1 ${bgColor} ${borderColor} ${textColor} border rounded-md p-1.5 overflow-hidden cursor-pointer z-10`}
      style={{
        top: `${topPosition}rem`,
        height: `${heightPosition}rem`,
        minHeight: "1.5rem",
        transformOrigin: "top center",
      }}
      initial={{ opacity: 1 }}
      whileHover={{
        scale: 1.03,
        zIndex: 50,
        boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        backgroundColor: "#dbeafe",
        transition: {
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
          height: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
        },
        height: isExpanded
          ? `${Math.max(heightPosition, 6)}rem`
          : `${heightPosition}rem`,
      }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
    >
      <div className="h-full flex flex-col">
        <div className="text-xs font-semibold truncate">
          {appointment.title}
        </div>
        <div className="text-xs mt-0.5 opacity-80">
          {formatTime(appointment.start)} - {formatTime(appointment.end)}
        </div>

        <motion.div
          className="flex-grow overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? "auto" : 0,
            marginTop: isExpanded ? "0.25rem" : 0
          }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {appointment.client && (
            <div className="text-xs mt-1">
              <span className="font-medium">Client:</span> {appointment.client}
            </div>
          )}

          {appointment.location && (
            <div className="text-xs mt-1">
              <span className="font-medium">Location:</span>{" "}
              {appointment.location}
            </div>
          )}

          {appointment.details && (
            <div className="text-xs mt-1">
              <span className="font-medium">Details:</span> {appointment.details}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AppointmentItem;
