import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import studentsData from "./students.json";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#33AA77", "#FF4444"];

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call
        const response = await fetch("http://localhost:5000/students");
        if (!response.ok) throw new Error("API not working");
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.warn("Using local JSON fallback:", err.message);
        setStudents(studentsData.students); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, currentPage]);

  const sortBy = (key) => {
    const sorted = [...students].sort((a, b) => {
      if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
      return a[key] - b[key];
    });
    setStudents(sorted);
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    const month = date.getMonth();
    const dateNum = date.getDate();
    return day !== 0 && day !== 6 && month === 6 && dateNum >= 1 && dateNum <= 5;
  };

  const pieData = useMemo(
    () => students.map((s) => ({ name: s.name, value: s.marks })),
    [students]
  );

  if (loading) return <div>Loading data...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Student Dashboard</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Select Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          filterDate={isWeekday}
          placeholderText="Pick a date (1-5 July, weekdays only)"
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by name or class"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "5px", width: "220px" }}
        />
      </div>

      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th onClick={() => sortBy("roll")}>Roll No</th>
            <th onClick={() => sortBy("name")}>Name</th>
            <th onClick={() => sortBy("class")}>Class</th>
            <th onClick={() => sortBy("marks")}>Marks</th>
            <th onClick={() => sortBy("grade")}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map((s) => (
            <tr key={s.roll}>
              <td>{s.roll}</td>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>{s.marks}</td>
              <td>{s.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              padding: "5px 10px",
              margin: "0 5px",
              backgroundColor: currentPage === i + 1 ? "#0088FE" : "#eee",
              color: currentPage === i + 1 ? "#fff" : "#000",
              border: "none",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div style={{ width: "100%", height: "300px", marginTop: "30px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
