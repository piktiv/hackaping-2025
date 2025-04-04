import React, { useState } from "react";
import { Calendar, Views, EventProps, momentLocalizer, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Employee, Shift } from "~/types";

// Localizer for date management
const localizer = momentLocalizer(moment);

const shiftColors: Record<string, string> = {
  line2: "#4CAF50",  // green
  line1: "#FF9800",  // orange
  packing: "#3F51B5",    // indigo
  cleaning: "#9E9E9E",  // grey
  inventory: "#FFC107",  // amber
};

const CustomEventComponent: React.FC<EventProps<Shift>> = ({ event }) => {
  const backgroundColor = shiftColors[event.type] || shiftColors.Default;

  return (
    <div
    style={{
      backgroundColor,
      color: "white",
      padding: "4px",
      borderRadius: "4px",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      textAlign: "center",
    }}
    >
      {event.type}
    </div>
  );
};


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
        eventPropGetter={(event: Shift) => {
          const backgroundColor = shiftColors[event.type] || shiftColors.Default;
          return {
            style: {
              backgroundColor,
              border: "none",
              padding: "4px",
              borderRadius: "4px",
              overflow: "hidden",
            },
          };
        }}
        // Remove default title (time) display
        titleAccessor={() => ""}
        formats={{
          eventTimeRangeFormat: () => "",
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
