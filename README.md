# Resource Scheduler
A modern, responsive appointment scheduling application built with React and Vite. This application allows users to manage appointments across multiple resources with day view functionality, real-time updates, and an intuitive user interface.

## Features
- Interactive Calendar Interface : View and manage appointments in a day view format
- Resource Management : Schedule appointments across multiple resources (staff members)
- Real-time Updates : Current time indicator and automatic updates
- Appointment Management : Add, view, and manage appointments with detailed information
- Responsive Design : Works seamlessly on desktop and mobile devices
- Customizable Configuration : Easily adjust scheduler settings through configuration
- Today Button : Quickly navigate to the current date
## Technology Stack
- React 19 : Modern React with hooks for state management
- Vite : Next-generation frontend tooling for fast development
- Tailwind CSS : Utility-first CSS framework for styling
- Material UI : Component library for UI elements
- Framer Motion : Animation library for smooth transitions
- date-fns : Date utility library for date manipulation
- React Hook Form : Form handling with validation using Yup
## Installation
```
# Clone the repository (replace with your repo URL if 
applicable)
git clone https://github.com/virenvaghasiyaa/Resource-Scheduler.git
cd resource-scheduler

# Install dependencies
npm install

# Start the development server
npm run dev
```
## Usage
### Viewing Appointments
- The main view displays appointments for the selected date
- Navigate between dates using the previous/next buttons
- Click the "Today" button to quickly return to the current date
- Appointments are color-coded by resource
### Adding Appointments
1. Click the "+ Add Appointment" button
2. Fill in the appointment details:
   - Select a resource (staff member)
   - Choose appointment type
   - Set start and end times
   - Add client information and notes
3. Submit the form to create the appointment
### Appointment Details
- Hover over an appointment to see additional details
- Appointments display the title, time, client, location, and notes
- Unavailable time slots are displayed with a cross-hatched pattern
## Configuration
The scheduler can be customized by modifying the schedulerConfig.js file:

```
const schedulerConfig = {
  startHour: 9,         // First hour displayed in the 
  scheduler
  endHour: 17,          // Last hour displayed in the 
  scheduler
  timeSlotDuration: 15, // Duration of time slots in 
  minutes
  hourHeight: 4,        // Height of each hour in rem 
  units
  showCurrentTime: true,// Show the current time 
  indicator
  // ... other configuration options
};
```
## Project Structure
```
/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── AddAppointmentButton.jsx
│   │   ├── AddAppointmentModal.jsx
│   │   ├── AppointmentItem.jsx
│   │   ├── DayView.jsx
│   │   ├── ResourceHeader.jsx
│   │   └── TimeColumn.jsx
│   ├── config/         # Application configuration
│   │   └── schedulerConfig.js
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── mockData.js         # Mock data for development
└── package.json        # Project dependencies and 
scripts
```
## License
MIT

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements
- Icons provided by Material UI
- Date handling powered by date-fns
- Animation effects by Framer Motion