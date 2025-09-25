import React, { useState, useMemo } from "react";
export default function StudentTable({ students }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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
   
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or class"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "5px", width: "220px", marginBottom: "10px" }}/>


      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
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
            }}>

            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
