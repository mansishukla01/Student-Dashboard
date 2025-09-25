import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#33AA77", "#FF4444"];

const initialData = [
  { roll: 1, name: "Test 1", class: "10th", marks: 85, grade: "A" },
  { roll: 2, name: "Test 2", class: "10th", marks: 72, grade: "B" },
  { roll: 3, name: "Test 3", class: "10th", marks: 90, grade: "A+" },
  { roll: 4, name: "Test 4", class: "10th", marks: 68, grade: "B" },
  { roll: 5, name: "Test 5", class: "10th", marks: 75, grade: "B+" },
  { roll: 6, name: "Test 6", class: "10th", marks: 95, grade: "A+" },
  { roll: 7, name: "Test 7", class: "10th", marks: 60, grade: "C" },
];

const rowsPerPage = 5;

export default function App() {
  const [students, setStudents] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(students.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedStudents = students.slice(startIndex, startIndex + rowsPerPage);

  const handleChange = (e, roll, field) => {
    const newData = students.map((s) =>
      s.roll === roll ? { ...s, [field]: e.target.value } : s
    );
    setStudents(newData);
  };

  const thTdStyle = {
    border: "1px solid #ccc",
    padding: "4px 6px",
    textAlign: "center",
    verticalAlign: "middle",
  };

  const inputStyle = {
    width: "80%",
    padding: "4px 6px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
    display: "block",
    margin: "0 auto",
    textAlign: "center",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "auto",
    marginBottom: "20px",
  };

  const paginationStyle = {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  };

  const buttonStyle = (disabled) => ({
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: disabled ? "#aaa" : "#007bff",
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const pieData = useMemo(
    () => students.map((s) => ({ name: s.name, value: s.marks })),
    [students]
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Student Dashboard</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Roll No</th>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Class</th>
            <th style={thTdStyle}>Marks</th>
            <th style={thTdStyle}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map((s) => (
            <tr key={s.roll}>
              <td style={thTdStyle}>
                <input
                  type="text"
                  value={s.roll}
                  onChange={(e) => handleChange(e, s.roll, "roll")}
                  style={inputStyle}/>
              </td>
              <td style={thTdStyle}>
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => handleChange(e, s.roll, "name")}
                  style={inputStyle}/>
              </td>
              <td style={thTdStyle}>
                <input
                  type="text"
                  value={s.class}
                  onChange={(e) => handleChange(e, s.roll, "class")}
                  style={inputStyle}/>
              </td>
              <td style={thTdStyle}>
                <input
                  type="text"
                  value={s.marks}
                  onChange={(e) => handleChange(e, s.roll, "marks")}
                  style={inputStyle}/>
              </td>
              <td style={thTdStyle}>
                <input
                  type="text"
                  value={s.grade}
                  onChange={(e) => handleChange(e, s.roll, "grade")}
                  style={inputStyle}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={paginationStyle}>
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          style={buttonStyle(currentPage === 1)}>
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          style={buttonStyle(currentPage === totalPages)}>
          Next
        </button>
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
              outerRadius={100}
              label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip/>
            <Legend/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

