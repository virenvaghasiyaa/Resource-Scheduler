
export const mockResources = [
  { id: "r1", name: "John Smith", specialty: "Haircuts", color: "#3b82f6" },
  {
    id: "r2",
    name: "Sarah Johnson",
    specialty: "Color Treatment",
    color: "#10b981",
  },
  {
    id: "r3",
    name: "Michael Brown",
    specialty: "Beard & Shaving",
    color: "#8b5cf6",
  },
  { id: "r4", name: "Emily Davis", specialty: "Styling", color: "#f97316" },
];


const today = new Date();
today.setHours(0, 0, 0, 0);


const createTimeForToday = (hours, minutes) => {
  const date = new Date(today);
  date.setHours(hours, minutes, 0, 0);
  return date;
};


const mockClients = [
  {
    id: "c1",
    name: "Alex Morgan",
    phone: "(555) 123-4567",
    email: "alex@example.com",
  },
  {
    id: "c2",
    name: "Taylor Wilson",
    phone: "(555) 234-5678",
    email: "taylor@example.com",
  },
  {
    id: "c3",
    name: "Jordan Lee",
    phone: "(555) 345-6789",
    email: "jordan@example.com",
  },
  {
    id: "c4",
    name: "Casey Ryan",
    phone: "(555) 456-7890",
    email: "casey@example.com",
  },
  {
    id: "c5",
    name: "Jamie Parker",
    phone: "(555) 567-8901",
    email: "jamie@example.com",
  },
  {
    id: "c6",
    name: "Riley Smith",
    phone: "(555) 678-9012",
    email: "riley@example.com",
  },
  {
    id: "c7",
    name: "Avery Johnson",
    phone: "(555) 789-0123",
    email: "avery@example.com",
  },
];


const appointmentTypes = [
  { id: "at1", name: "Haircut & Style", duration: 45, price: 65 },
  { id: "at2", name: "Color Treatment", duration: 90, price: 120 },
  { id: "at3", name: "Beard Trim", duration: 30, price: 35 },
  { id: "at4", name: "Hair Wash & Blowdry", duration: 30, price: 45 },
  { id: "at5", name: "Hair Coloring", duration: 120, price: 140 },
  { id: "at6", name: "Haircut", duration: 30, price: 50 },
  { id: "at7", name: "Full Makeover", duration: 120, price: 180 },
];


const generateAppointments = () => {
  return [
    {
      id: "a1",
      resourceId: "r1",
      title: "Haircut & Style",
      start: createTimeForToday(9, 15),
      end: createTimeForToday(10, 0),
      type: "appointment",
      clientName: "Alex Morgan",
      clientId: "c1",
      details: "Prefers shorter on sides, longer on top",
      status: "confirmed",
    },
    {
      id: "a2",
      resourceId: "r1",
      title: "Unavailable",
      start: createTimeForToday(12, 0),
      end: createTimeForToday(13, 0),
      type: "unavailable",
      details: "Lunch break",
    },
    {
      id: "a3",
      resourceId: "r2",
      title: "Color Treatment",
      start: createTimeForToday(9, 0),
      end: createTimeForToday(10, 45),
      type: "appointment",
      clientName: "Taylor Wilson",
      clientId: "c2",
      details: "Wants to go from blonde to auburn",
      status: "confirmed",
    },
    {
      id: "a4",
      resourceId: "r3",
      title: "Beard Trim",
      start: createTimeForToday(11, 30),
      end: createTimeForToday(12, 15),
      type: "appointment",
      clientName: "Jordan Lee",
      clientId: "c3",
      status: "confirmed",
    },
    {
      id: "a5",
      resourceId: "r2",
      title: "Unavailable",
      start: createTimeForToday(13, 0),
      end: createTimeForToday(14, 30),
      type: "unavailable",
      details: "Training session",
    },
    {
      id: "a6",
      resourceId: "r4",
      title: "Hair Wash & Blowdry",
      start: createTimeForToday(10, 0),
      end: createTimeForToday(10, 45),
      type: "appointment",
      clientName: "Casey Ryan",
      clientId: "c4",
      status: "confirmed",
    },
    {
      id: "a7",
      resourceId: "r3",
      title: "Hair Coloring",
      start: createTimeForToday(14, 15),
      end: createTimeForToday(16, 15),
      type: "appointment",
      clientName: "Jamie Parker",
      clientId: "c5",
      details: "Going for blue highlights",
      status: "pending",
    },
    {
      id: "a8",
      resourceId: "r4",
      title: "Haircut",
      start: createTimeForToday(13, 15),
      end: createTimeForToday(14, 0),
      type: "appointment",
      clientName: "Riley Smith",
      clientId: "c6",
      status: "confirmed",
    },
    {
      id: "a9",
      resourceId: "r1",
      title: "Full Makeover",
      start: createTimeForToday(14, 30),
      end: createTimeForToday(16, 45),
      type: "appointment",
      clientName: "Avery Johnson",
      clientId: "c7",
      details: "Complete styling for wedding tomorrow",
      status: "confirmed",
    },
    {
      id: "a10",
      resourceId: "r4",
      title: "Unavailable",
      start: createTimeForToday(15, 0),
      end: createTimeForToday(16, 30),
      type: "unavailable",
      details: "Meeting with product vendor",
    },
  ];
};


export const mockAppointments = generateAppointments();


export const findAvailableSlots = (
  resources,
  appointments,
  date,
  duration = 15
) => {
  const slots = [];
  const startHour = 9;
  const endHour = 17;


  resources.forEach((resource) => {
    const resourceAppointments = appointments.filter(
      (appt) => appt.resourceId === resource.id
    );


    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minute, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotStart.getMinutes() + duration);


        const isAvailable = !resourceAppointments.some((appt) => {
          return (
            (slotStart >= appt.start && slotStart < appt.end) ||
            (slotEnd > appt.start && slotEnd <= appt.end) ||
            (slotStart <= appt.start && slotEnd >= appt.end)
          );
        });

        if (isAvailable) {
          slots.push({
            resourceId: resource.id,
            resourceName: resource.name,
            start: new Date(slotStart),
            end: new Date(slotEnd),
          });
        }
      }
    }
  });

  return slots;
};

export default {
  mockResources,
  mockAppointments,
  mockClients,
  appointmentTypes,
  findAvailableSlots,
};
