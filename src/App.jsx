import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  
  const [roll, setRoll] = useState("");
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [grade, setGrade] = useState("");
  const [marks, setMarks] = useState("");
  const [dob, setDob] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  
 useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  
  const handleAuth = (e) => {
    e.preventDefault();
    if (username && password) setPage("dashboard");
    else alert("Enter username and password");
  };

  
  const handleSave = () => {
    if (!roll || !name || !studentClass || !grade || !marks ) {
      toast.error("Please fill all fields!");
      return;
    }
    const newStudent = {
      id: students.length + 1,
      roll,
      name,
      class: studentClass,
      grade,
      marks: Number(marks),
      
    };
    setStudents([...students, newStudent]);
    toast.success("Record saved successfully!");
  };

  // Search
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toString().includes(search)
  );

  // Sorting
  const sortedStudents = [...filteredStudents];
  if (sortConfig.key) {
    sortedStudents.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirst, indexOfLast);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    indexOfLast < sortedStudents.length && setCurrentPage(currentPage + 1);

  const chartData = students.map((s) => ({ name: `${s.name} (${s.roll})`, value: s.marks }));

  return (
    <div className="app">
      {page === "login" ? (
        <div className="auth-container">
          <h2>Login / Signup</h2>
          <form onSubmit={handleAuth}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}/>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Continue</button>
          </form>
        </div>
      ) : (
        <div className="dashboard">
          <h2>Student Dashboard</h2>


          {/* Input Section */}
          <div className="input-section">
            <input
              type="text"
              placeholder="Roll No"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}/>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}/>
            <input
              type="text"
              placeholder="Class"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}/>
            <input
              type="text"
              placeholder="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}/>
            <input
              type="number"
              placeholder="Marks"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}/>
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              minDate={new Date("2025-07-01")}
              maxDate={new Date("2025-07-05")}
              filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6}
              placeholderText="Select Date"/>
            <button onClick={handleSave}>Save</button>
          </div>

          {/* Modal */}
          <button className="info-btn" onClick={() => setShowModal(true)}>
            How Pie Chart Works?
          </button>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <p>Once you add marks, they will show in the pie chart here.</p>
                <button onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          )}

          {/* Table */}
          <table className="student-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("roll")}>Roll No</th>
                <th onClick={() => requestSort("name")}>Name</th>
                <th onClick={() => requestSort("class")}>Class</th>
                <th onClick={() => requestSort("grade")}>Grade</th>
                <th onClick={() => requestSort("marks")}>Marks</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((s) => (
                <tr key={s.id}>
                  <td>{s.roll}</td>
                  <td>{s.name}</td>
                  <td>{s.class}</td>
                  <td>{s.grade}</td>
                  <td>
                    <input
                      type="number"
                      value={s.marks}
                      onChange={(e) => {
                        const updated = students.map((st) =>
                          st.id === s.id ? { ...st, marks: e.target.value } : st
                        );
                        setStudents(updated);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={handlePrev} unabled={currentPage === 1}>
              Prev
            </button>
            <button onClick={handleNext} unabled={indexOfLast >= sortedStudents.length}>
              Next
            </button>
          </div>

          {/* Pie Chart */}
          <div className="chart-container">
            {students.length === 0 ? (
              <p>No records yet. Add some students!</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      <ToastContainer/>

      <style>{`
        .app {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        }
        .auth-container {
          max-width: 300px;
          margin: 100px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .auth-container input {
          display: block;
          width: 100%;
          margin: 10px 0;
          padding: 8px;
        }
        .auth-container button {
          padding: 8px 16px;
          background: #0088FE;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .dashboard {
          margin-top: 30px;
        }
        .input-section input {
          padding: 8px;
          margin: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .input-section button {
          padding: 8px 16px;
          background: #00C49F;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .info-btn {
          margin: 15px;
          padding: 6px 12px;
          background: #FF8042;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .student-table {
          margin: 20px auto;
          border-collapse: collapse;
          width: 80%;
        }
        .student-table th, .student-table td {
          border: 1px solid #ccc;
          padding: 8px;
        }
        .student-table th {
          background: #f5f5f5;
        }
        .chart-container {
          margin-top: 30px;
          height: 300px;
        }
        .modal {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
          text-align: center;
        }
        .close-btn {
          margin-top: 10px;
          padding: 6px 12px;
          background: #0088FE;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}




