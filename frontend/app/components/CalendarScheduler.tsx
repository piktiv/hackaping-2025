import React, { useState } from "react";
import { Calendar, Views, EventProps, momentLocalizer, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localizer for date management
const localizer = momentLocalizer(moment);

// Define a Person type
type Person = {
  id: number;
  name: string;
};

interface CustomEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId?: number;
}

// Sample people (columns)
const people: Person[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

// Sample events
const events: CustomEvent[] = [
  {
    id: 1,
    title: "Meeting with Client",
    start: new Date(2025, 3, 4, 10, 0),
    end: new Date(2025, 3, 4, 11, 0),
    resourceId: 1,
  },
  {
    id: 2,
    title: "Code Review",
    start: new Date(2025, 3, 4, 14, 0),
    end: new Date(2025, 3, 4, 15, 0),
    resourceId: 2,
  },
];

const CustomEventComponent: React.FC<EventProps<CustomEvent>> = ({ event }) => (
  <div
    style={{
      backgroundColor: "#3182CE",
      color: "white",
      padding: "5px",
      borderRadius: "4px",
    }}
  >
    {event.title}
  </div>
);

const CustomToolbar: React.FC<ToolbarProps<CustomEvent, { resourceId: number; resourceTitle: string }>> = ({
  label,
  views,
  onView,
  onNavigate,
}) => {

  return (
    <div
      className="rbc-toolbar"
      style={{
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate("PREV")}>
          Prev
        </button>
        <button type="button" onClick={() => onNavigate("TODAY")}>
          Today
        </button>
        <button type="button" onClick={() => onNavigate("NEXT")}>
          Next
        </button>
      </div>
      <span className="rbc-toolbar-label">{label}</span>
      <div className="rbc-btn-group">
        <button type="button" onClick={() => onView(Views.DAY)}>
          Day
        </button>
        <button type="button" onClick={() => onView(Views.MONTH)}>
          Month
        </button>
      </div>
    </div>
  );
};

const CalendarScheduler: React.FC = () => {
  const [view, setView] = useState<"day" | "month">("day");
  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <h2>Work Schedule</h2>
      <Calendar
        localizer={localizer}
        events={view === 'day' ? events : []}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={(newView) => setView(newView as "day" | "month")}
        // Enable multiple views (day, month)
        views={[Views.DAY, Views.MONTH]}
        step={60} // 1-hour intervals
        timeslots={1}
        // Use the custom toolbar with view buttons
        components={{
          toolbar: CustomToolbar,
          event: CustomEventComponent,
        }}
        style={{ border: "1px solid #ddd", borderRadius: "10px" }}
        // Pass resource props only for Day view; Month view renders as a regular grid
        {...(view === Views.DAY && {
          resources: people.map((person) => ({
            resourceId: person.id,
            resourceTitle: person.name,
          })),
          resourceIdAccessor: "resourceId",
          resourceTitleAccessor: "resourceTitle",
        })}
      />
    </div>
  );
};

export default CalendarScheduler;
