import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { addMinutes, isAfter, setHours, setMinutes } from "date-fns";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  resourceId: yup.string().required("Stylist is required"),
  clientName: yup.string().required("Client name is required"),
  start: yup.date().required("Start time is required"),
  end: yup
    .date()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { start } = this.parent;
        return start && value ? isAfter(value, start) : true;
      }
    ),
  type: yup.string().required("Appointment type is required"),
  details: yup.string(),
});

function AppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  resources,
  date,
  startHour,
  endHour,
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      resourceId: "",
      clientName: "",
      start: setHours(setMinutes(new Date(date), 0), 9),
      end: setHours(setMinutes(new Date(date), 30), 9),
      type: "appointment",
      details: "",
    },
  });

  const startTime = watch("start");
  const appointmentType = watch("type");

  useEffect(() => {
    if (startTime) {
      setValue("end", addMinutes(new Date(startTime), 30));
    }
  }, [startTime, setValue]);

  useEffect(() => {
    if (appointmentType === "unavailable") {
      setValue("clientName", "Unavailable");
      setValue("details", "");
    } else if (
      appointmentType === "appointment" &&
      watch("clientName") === "Unavailable"
    ) {
      setValue("clientName", "");
    }
  }, [appointmentType, setValue, watch]);

  useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
        resourceId: "",
        clientName: "",
        start: setHours(setMinutes(new Date(date), 0), 9),
        end: setHours(setMinutes(new Date(date), 30), 9),
        type: "appointment",
        details: "",
      });
      setErrorMessage("");
    }
  }, [isOpen, reset, date]);

  const handleFormSubmit = (data) => {
    const startDateTime = new Date(date);
    startDateTime.setHours(
      data.start.getHours(),
      data.start.getMinutes(),
      0,
      0
    );

    const endDateTime = new Date(date);
    endDateTime.setHours(data.end.getHours(), data.end.getMinutes(), 0, 0);

    const startHourValue = startDateTime.getHours();
    const endHourValue = endDateTime.getHours();
    const endMinValue = endDateTime.getMinutes();

    if (
      startHourValue < startHour ||
      endHourValue > endHour ||
      (endHourValue === endHour && endMinValue > 0)
    ) {
      setErrorMessage(
        `Appointment must be between ${startHour}:00 AM and ${endHour}:00 PM`
      );
      return;
    }

    const durationInMinutes = (endDateTime - startDateTime) / (1000 * 60);
    if (durationInMinutes < 15) {
      setErrorMessage("Appointment must be at least 15 minutes long");
      return;
    }

    const appointmentData = {
      title: data.title,
      resourceId: data.resourceId,
      clientName: data.type === "appointment" ? data.clientName : "Unavailable",
      start: startDateTime,
      end: endDateTime,
      type: data.type,
      details: data.details || "",
    };

    const result = onSubmit(appointmentData);

    if (result && !result.success) {
      setErrorMessage(result.message);
      return;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 24px",
          fontWeight: 600,
          fontSize: "1.25rem",
        }}
      >
        Add New Appointment
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ padding: "24px", paddingBottom: "16px" }}>
          <div className="space-y-5">
            <FormControl fullWidth variant="outlined" className="!mb-4">
              <InputLabel id="appointment-type-label">
                Appointment Type
              </InputLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="appointment-type-label"
                    label="Appointment Type"
                    error={!!errors.type}
                  >
                    <MenuItem value="appointment">Appointment</MenuItem>
                    <MenuItem value="unavailable">Unavailable</MenuItem>
                  </Select>
                )}
              />
              {errors.type && (
                <FormHelperText error>{errors.type.message}</FormHelperText>
              )}
            </FormControl>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  variant="outlined"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                  className="!mb-4"
                />
              )}
            />

            <FormControl fullWidth variant="outlined" className="!mb-4">
              <InputLabel id="resource-label">Stylist</InputLabel>
              <Controller
                name="resourceId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="resource-label"
                    label="Stylist"
                    error={!!errors.resourceId}
                  >
                    {resources.map((resource) => (
                      <MenuItem key={resource.id} value={resource.id}>
                        {resource.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.resourceId && (
                <FormHelperText error>
                  {errors.resourceId.message}
                </FormHelperText>
              )}
            </FormControl>

            <div className="grid grid-cols-2 gap-4 !mb-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="start"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      label="Start Time"
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.start}
                          helperText={errors.start?.message}
                          fullWidth
                        />
                      )}
                      minutesStep={5}
                    />
                  )}
                />

                <Controller
                  name="end"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      label="End Time"
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.end}
                          helperText={errors.end?.message}
                          fullWidth
                        />
                      )}
                      minutesStep={5}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>

            {appointmentType === "appointment" && (
              <>
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Client Name"
                      variant="outlined"
                      error={!!errors.clientName}
                      helperText={errors.clientName?.message}
                      fullWidth
                      className="!mb-4"
                    />
                  )}
                />

                <Controller
                  name="details"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Details"
                      variant="outlined"
                      multiline
                      rows={3}
                      placeholder="Add optional details about this appointment"
                      fullWidth
                      className="!mb-4"
                    />
                  )}
                />
              </>
            )}
          </div>
        </DialogContent>

        {errorMessage && (
          <Box
            sx={{
              margin: "0 24px 16px 24px",
              backgroundColor: "#fee2e2",
              borderRadius: "6px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component="span"
              sx={{
                color: "#b91c1c",
                marginRight: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </Box>
            <Typography
              sx={{ color: "#b91c1c", fontSize: "0.875rem", fontWeight: 500 }}
            >
              {errorMessage}
            </Typography>
          </Box>
        )}

        <DialogActions
          sx={{
            padding: "16px 24px",
            borderTop: "1px solid #e2e8f0",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              color: "#64748b",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#f1f5f9" },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
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
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AppointmentModal;
