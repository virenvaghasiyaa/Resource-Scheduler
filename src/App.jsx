import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DayView from "./components/DayView";
import AddAppointmentModal from "./components/AddAppointmentModal";
import { mockResources, mockAppointments } from "../mockData";
import "./App.css";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resources] = useState(mockResources);
  const [appointments, setAppointments] = useState(mockAppointments);


  const getFilteredAppointments = () => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.start);
      return (
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  const handleAddAppointment = (newAppointment) => {
    setAppointments([
      ...appointments,
      {
        id: `appointment-${appointments.length + 1}`,
        ...newAppointment,
      },
    ]);
    setIsAddModalOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col w-full md:w-auto">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
                  Appointments
                </h1>
              </div>
            </div>
          </div>

          <div className="transition-all duration-300 ease-in-out">
            <DayView
              resources={resources}
              appointments={getFilteredAppointments()}
              date={selectedDate}
              onDateChange={setSelectedDate}
              onAddAppointment={handleAddAppointment}
            />
          </div>

          <AddAppointmentModal
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddAppointment}
            resources={resources}
            date={selectedDate}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default App;
