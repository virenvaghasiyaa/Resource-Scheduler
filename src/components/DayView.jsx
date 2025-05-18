import React, { useState, useEffect, useRef } from "react";
import schedulerConfig from "../config/schedulerConfig";
import TimeColumn from "./TimeColumn";
import ResourceHeader from "./ResourceHeader";
import AppointmentItem from "./AppointmentItem";
import AddAppointmentButton from "./AddAppointmentButton";
import { format } from "date-fns";

function DayView({
  resources,
  appointments,
  startHour = schedulerConfig.startHour,
  endHour = schedulerConfig.endHour,
  timeSlotDuration = schedulerConfig.timeSlotDuration,
  date = new Date(),
  onDateChange,
  onAddAppointment,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const schedulerRef = useRef(null);
  const timeIndicatorRef = useRef(null);
  const formattedDate = format(date, "EEEE, MMMM d");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      scrollToCurrentTime();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isCurrentTimeVisible()) {
      setTimeout(() => scrollToCurrentTime(), 300);
    }
  }, []);

  const hours = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    hours.push(hour);
  }

  const totalMinutes = (endHour - startHour) * 60;

  const isCurrentTimeVisible = () => {
    const now = new Date();
    const nowHour = now.getHours();
    return nowHour >= startHour && nowHour < endHour;
  };

  const formatCurrentTime = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const scrollToCurrentTime = () => {
    if (
      !isCurrentTimeVisible() ||
      !schedulerRef.current ||
      !timeIndicatorRef.current
    )
      return;

    const schedulerHeight = schedulerRef.current.clientHeight;
    const indicatorPosition = timeIndicatorRef.current.offsetTop;

    schedulerRef.current.scrollTop = indicatorPosition - schedulerHeight / 2;
  };

  const handlePreviousDay = () => {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange && onDateChange(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange && onDateChange(nextDay);
  };

  const handleTodayClick = () => {
    onDateChange && onDateChange(new Date());
  };

  const isSlotAvailable = (resourceId, start, end) => {
    const resourceAppointments = appointments.filter(
      (appt) => appt.resourceId === resourceId
    );

    return !resourceAppointments.some(
      (appt) =>
        (start >= appt.start && start < appt.end) ||
        (end > appt.start && end <= appt.end) ||
        (start <= appt.start && end >= appt.end)
    );
  };

  return (
    <div className="day-view-wrapper">
      <div className="day-navigation-header flex justify-between items-center mb-4 bg-white sticky top-0 z-20 py-2">
        <div className="day-navigation flex items-center gap-3">
          <button
            onClick={handleTodayClick}
            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors ml-2 text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={handlePreviousDay}
            className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100 transition-colors"
          >
            &lt;
          </button>
          <div className="px-4 py-1 border border-gray-300 font-medium">
            <div className="text-lg font-medium text-gray-700">
              {formattedDate}
            </div>
          </div>
          <button
            onClick={handleNextDay}
            className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors"
          >
            &gt;
          </button>
        </div>

        <AddAppointmentButton
          resources={resources}
          onAddAppointment={onAddAppointment}
          isSlotAvailable={isSlotAvailable}
          date={date}
          startHour={startHour}
          endHour={endHour}
        />
      </div>

      <div className="day-view-container border border-gray-300 rounded shadow-sm">
        <div className="grid grid-cols-[80px_1fr] h-full">
          <TimeColumn
            hours={hours}
            timeSlotDuration={timeSlotDuration}
            currentTime={isCurrentTimeVisible() ? currentTime : null}
          />

          <div
            className="resources-container grid"
            style={{
              gridTemplateColumns: `repeat(${resources.length}, 1fr)`,
              gridTemplateRows: "auto 1fr",
              gap: 0,
            }}
          >
            <div
              className="resource-headers col-span-full grid"
              style={{
                gridTemplateColumns: `repeat(${resources.length}, 1fr)`,
                marginBottom: 0,
              }}
            >
              {resources.map((resource, index) => (
                <ResourceHeader
                  key={resource.id}
                  resource={resource}
                  isLastColumn={index === resources.length - 1}
                />
              ))}
            </div>

            <div
              ref={schedulerRef}
              className="resource-columns col-span-full grid relative"
              style={{
                gridTemplateColumns: `repeat(${resources.length}, 1fr)`,
                marginTop: 0,
              }}
            >
              {resources.map((resource, index) => (
                <div
                  key={resource.id}
                  className={`resource-column relative ${
                    index < resources.length - 1
                      ? "border-r border-gray-300"
                      : ""
                  }`}
                >
                  {hours.map((hour, hourIndex) => (
                    <div
                      key={`${resource.id}-hour-${hour}`}
                      className="absolute left-0 right-0 border-t border-gray-100"
                      style={{
                        top: `${hourIndex * schedulerConfig.hourHeight}rem`,
                        height: `${schedulerConfig.hourHeight}rem`,
                      }}
                    />
                  ))}

                  {appointments
                    .filter(
                      (appointment) => appointment.resourceId === resource.id
                    )
                    .map((appointment) => (
                      <AppointmentItem
                        key={appointment.id}
                        appointment={appointment}
                        startHour={startHour}
                        totalMinutes={totalMinutes}
                        colors={schedulerConfig.colors}
                      />
                    ))}
                </div>
              ))}

              {schedulerConfig.showCurrentTime && isCurrentTimeVisible() && (
                <div
                  ref={timeIndicatorRef}
                  className={`current-time-indicator absolute left-0 right-0 border-t-2 ${schedulerConfig.colors.currentTime} z-20`}
                  style={{
                    top: `${
                      (currentTime.getHours() -
                        startHour +
                        currentTime.getMinutes() / 60) *
                      schedulerConfig.hourHeight
                    }rem`,
                    boxShadow: "0 1px 3px rgba(255, 0, 0, 0.3)",
                  }}
                >
                  <div
                    className={`absolute -mt-1.5 -ml-1 w-3 h-3 rounded-full bg-red-500 shadow-sm`}
                  ></div>
                  <div className="absolute -mt-3.5 -ml-16 text-xs font-semibold text-red-500 bg-white px-1.5 py-0.5 rounded shadow-sm border border-red-200">
                    {formatCurrentTime()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayView;
