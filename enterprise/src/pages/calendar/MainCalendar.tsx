import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./calendars.scss";

const MainCalendar = () => {
  const localizer = momentLocalizer(moment);
  const events = [
    {
      title: "All Day Event",
      start: new Date(2024, 0, 1, 0, 0, 0),
      end: new Date(2024, 0, 1, 0, 0, 0),
    },
    {
      title: "Long Event",
      start: new Date(2024, 0, 1, 0, 0, 0),
      end: new Date(2024, 0, 1, 0, 0, 0),
    },
    {
      title: "Repeating Event",
      start: new Date(2024, 0, 1, 0, 0, 0),
      end: new Date(2024, 0, 1, 0, 0, 0),
    },
    {
      title: "Conference",
      start: new Date(2024, 0, 3, 0, 0, 0),
      end: new Date(2024, 0, 4, 0, 0, 0),
    },
    {
      title: "Meeting",
      start: new Date(2024, 0, 5, 0, 0, 0),
      end: new Date(2024, 0, 5, 0, 0, 0),
    },
  ];

  return (
    <div>
      <div>
        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          events={events}
          style={{ height: 600 }}
        />
      </div>
    </div>
  );
};

export default MainCalendar;
