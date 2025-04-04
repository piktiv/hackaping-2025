import React, { useState } from "react";
import { EventProps } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Shift } from "~/types";

const CustomEventComponent: React.FC<EventProps<Shift>> = ({ event }) => {
  // Local state to toggle expanded mode
  const [expanded, setExpanded] = useState(false);

  // Toggle the expanded state on click
  const handleClick = () => {
    setExpanded(!expanded);
  };

  // Styles for normal and expanded states with smooth transition
  const containerStyle: React.CSSProperties = {
    transition: "all 0.3s ease",
    cursor: "pointer",
    backgroundColor: "#3182CE",
    color: "white",
    padding: expanded ? "20px" : "5px",
    borderRadius: "4px",
    transform: expanded ? "scale(1.1)" : "scale(1)",
    overflow: "hidden",
  };

  return (
    <div style={containerStyle} onClick={handleClick}>
      {expanded ? (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{event.type}</div>
          <div>Shift ID: {event.shift_id}</div>
          <div>Score: {event.score}</div>
          <div>Employee: {event.employee_number}</div>
          <div>
            {/* You can add any extra details here */}
            More details...
          </div>
        </div>
      ) : (
        <div>{event.type}</div>
      )}
    </div>
  );
};

export default CustomEventComponent;
