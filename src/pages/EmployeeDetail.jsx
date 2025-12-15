import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getEmployeeById,
  updateEmployee,
} from "../api/employee.api";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    getEmployeeById(id).then((res) => setEmployee(res.data));
  }, [id]);

  if (!employee) return <Layout><p>Loading...</p></Layout>;

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const save = async () => {
    await updateEmployee(id, {
      name: employee.name,
      age: Number(employee.age),
      position: employee.position,
      salary: Number(employee.salary),
    });

    alert("Data berhasil diupdate");
    navigate("/employees");
  };

  return (
    <Layout>
      <h1>Detail Karyawan</h1>

      <p><b>ID:</b> {employee._id || employee.id}</p>
      <p><b>Dibuat:</b> {new Date(employee.createdAt).toLocaleString()}</p>
      <p><b>Diupdate:</b> {new Date(employee.updatedAt).toLocaleString()}</p>

      <div className="employee-form">
        <input name="name" value={employee.name} onChange={handleChange} />
        <input name="age" value={employee.age} onChange={handleChange} />
        <input name="position" value={employee.position} onChange={handleChange} />
        <input name="salary" value={employee.salary} onChange={handleChange} />
        <button onClick={save}>Simpan</button>
      </div>
    </Layout>
  );
}
