import { useState } from "react";
import AppointmentModal from "./AddAppointmentModal";
import { Button } from "@mui/material";

function AddAppointmentButton({
  resources,
  onAddAppointment,
  isSlotAvailable,
  date,
  startHour,
  endHour,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleAddAppointment = (appointmentData) => {
    if (
      !isSlotAvailable(
        appointmentData.resourceId,
        appointmentData.start,
        appointmentData.end
      )
    ) {
      return {
        success: false,
        message:
          "This time slot is not available. Please select another time or resource.",
      };
    }

    onAddAppointment(appointmentData);

    handleCloseModal();

    return { success: true };
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleOpenModal}
        variant="contained"
        sx={{
          backgroundColor: "#3b82f6",
          "&:hover": { backgroundColor: "#2563eb" },
          fontWeight: 500,
          boxShadow: "none",
          padding: "8px 16px",
        }}
      >
        Add Appointment
      </Button>

      {modalOpen && (
        <AppointmentModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAddAppointment}
          resources={resources}
          date={date}
          startHour={startHour}
          endHour={endHour}
        />
      )}
    </>
  );
}

export default AddAppointmentButton;
