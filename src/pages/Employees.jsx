import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
} from "../api/employee.api";
import "../styles/employee.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    position: "",
    salary: "",
  });

  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  // 🔃 SORT
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // 📄 PAGINATION
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // CSV
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  const loadEmployees = async () => {
    const res = await getEmployees();
    setEmployees(res.data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.name || !form.age) {
      alert("Nama & umur wajib diisi");
      return;
    }

    await createEmployee({
      name: form.name,
      age: Number(form.age),
      position: form.position,
      salary: Number(form.salary),
    });

    setForm({ name: "", age: "", position: "", salary: "" });
    loadEmployees();
  };

  const remove = async (id) => {
    if (confirm("Hapus karyawan ini?")) {
      await deleteEmployee(id);
      loadEmployees();
    }
  };

  const uploadCSV = async () => {
    if (!file) {
      alert("Pilih file CSV dulu");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:5000/api/employees/import",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          },
        }
      );

      alert("CSV berhasil diupload, diproses di background");
      setFile(null);
      setUploadProgress(0);
    } catch (err) {
      alert("Upload CSV gagal");
      setUploadProgress(0);
    }
  };

  // 🔥 FILTER + SORT
  const filteredEmployees = useMemo(() => {
    let data = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase())
    );

    data.sort((a, b) => {
      let x = a[sortBy];
      let y = b[sortBy];

      if (typeof x === "string") x = x.toLowerCase();
      if (typeof y === "string") y = y.toLowerCase();

      if (x < y) return sortDir === "asc" ? -1 : 1;
      if (x > y) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [employees, search, sortBy, sortDir]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Layout>
      <h1>Data Karyawan</h1>

      {/* FORM */}
      <div className="employee-form">
        <input name="name" placeholder="Nama" value={form.name} onChange={handleChange} />
        <input name="age" placeholder="Umur" value={form.age} onChange={handleChange} />
        <input name="position" placeholder="Posisi" value={form.position} onChange={handleChange} />
        <input name="salary" placeholder="Gaji" value={form.salary} onChange={handleChange} />
        <button onClick={submit}>Tambah</button>
      </div>

    {/* SEARCH & SORT */}
<div className="employee-toolbar">
  <input
    placeholder="Cari nama / posisi..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(1);
    }}
  />

  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
    <option value="createdAt">Terbaru</option>
    <option value="name">Nama</option>
    <option value="age">Umur</option>
    <option value="salary">Gaji</option>
  </select>

  <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
    <option value="asc">Asc</option>
    <option value="desc">Desc</option>
  </select>
</div>


      {/* IMPORT CSV */}
      <div className="employee-import">
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadCSV}>Upload CSV</button>
        {uploadProgress > 0 && <div>{uploadProgress}%</div>}
      </div>

      {/* TABLE */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Umur</th>
            <th>Posisi</th>
            <th>Gaji</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.map((e) => (
            <tr key={e._id}>
              <td>{e.name}</td>
              <td>{e.age}</td>
              <td>{e.position}</td>
              <td>Rp {Number(e.salary).toLocaleString()}</td>
              <td>
                <button onClick={() => navigate(`/employees/${e._id}`)}>Detail</button>
                <button onClick={() => remove(e._id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </Layout>
  );
}
