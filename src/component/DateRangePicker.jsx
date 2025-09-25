import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerComponent({ selectedDate, setSelectedDate }) {
  const isWeekday = (date) => {
    const day = date.getDay();
    const month = date.getMonth();
    const dateNum = date.getDate();
    return day !== 0 && day !== 6 && month === 6 && dateNum >= 1 && dateNum <= 5;
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label>Select Date: </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        filterDate={isWeekday}
        placeholderText="Pick a date (1-5 July, weekdays only)"/>
    </div>
  );
}
