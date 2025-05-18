import React from "react";
import { Avatar, Tooltip } from "@mui/material";

function ResourceHeader({ resource, isLastColumn }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`h-12 border-b border-gray-300 flex items-center justify-center bg-gray-100 px-2 ${
        !isLastColumn ? "border-r border-gray-300" : ""
      }`}
    >
      <Tooltip title={`${resource.name}`} arrow>
        <div className="flex items-center space-x-2">
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: "0.875rem",
              bgcolor: "#3b82f6",
            }}
          >
            {getInitials(resource.name)}
          </Avatar>
          <div className="font-semibold text-gray-700 truncate">
            {resource.name}
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

export default ResourceHeader;
