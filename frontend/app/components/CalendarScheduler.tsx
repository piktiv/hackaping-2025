import React, { useState } from "react";
import { Calendar, Views, EventProps, momentLocalizer, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Employee, Shift } from "~/types";

// Localizer for date management
const localizer = momentLocalizer(moment);

const CustomEventComponent: React.FC<EventProps<Shift>> = ({ event }) => (
  <div
    style={{
      backgroundColor: "#3182CE",
      color: "white",
      padding: "5px",
      borderRadius: "4px",
    }}
  >
    {event.type}
  </div>
);

const CustomToolbar: React.FC<ToolbarProps<Shift, { resourceId: string; resourceTitle: string }>> = ({
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

interface CalendarInput {
  employees: Employee[];
  shifts: (Shift & { resourceId: string })[];
}

const CalendarScheduler: React.FC<CalendarInput> = ({
  employees,
  shifts
}) => {
  const [view, setView] = useState<"day" | "month">("day");
  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <h2>Work Schedule</h2>
      <Calendar<Shift, { resourceId: string; resourceTitle: string }>
        localizer={localizer}
        events={view === 'day' ? shifts : []}
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
          resources: employees.map((employee) => ({
            resourceId: employee.employee_number,
            resourceTitle: employee.name,
          })),
          resourceIdAccessor: "resourceId",
          resourceTitleAccessor: "resourceTitle",
          min: new Date(1970, 1, 1, 8, 0, 0),
          max: new Date(1970, 1, 1, 17, 0, 0),
        })}
      />
    </div>
  );
};

export default CalendarScheduler;
