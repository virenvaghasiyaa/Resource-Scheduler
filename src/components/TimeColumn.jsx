import React from "react";

function TimeColumn({ hours, timeSlotDuration }) {
  const formatTime = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00\n${period}`;
  };

  return (
    <div className="time-column border-r border-gray-300 bg-white">
      <div className="h-12 border-b border-gray-300 flex items-center justify-center bg-gray-100">
        <div className="font-semibold text-gray-700">Time</div>
      </div>
      <div className="time-slots">
        {hours.map((hour) => (
          <div
            key={hour}
            className="time-slot"
            style={{
              height: `${4}rem`,
              position: "relative",
            }}
          >
            <div className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center h-full">
              <div className="text-sm font-medium text-gray-700 whitespace-pre-line text-center">
                {formatTime(hour)}
              </div>
            </div>

            {timeSlotDuration < 60 && (
              <>
                {Array.from({ length: 60 / timeSlotDuration - 1 }, (_, i) => (
                  <div
                    key={`${hour}-${(i + 1) * timeSlotDuration}`}
                    className="absolute border-t border-gray-100 left-0 right-0 opacity-0"
                    style={{
                      top: `${(((i + 1) * timeSlotDuration) / 60) * 4}rem`,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeColumn;
