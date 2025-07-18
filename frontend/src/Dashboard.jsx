import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';

const sampleReports = ['Report A', 'Report B', 'Report C'];

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addEntry = (entry) => {
    setEntries([...entries, entry]);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Report Dashboard</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          ➕ Add
        </button>
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Lot Size</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Serial No</th>
            <th className="border p-2">Reports</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <TableRow key={index} data={entry} />
          ))}
        </tbody>
      </table>

      {showForm && <AddForm onClose={() => setShowForm(false)} onSubmit={addEntry} />}
    </div>
  );
};

const TableRow = ({ data }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <tr className="relative">
      <td className="border p-2">{data.lotSize}</td>
      <td className="border p-2">{data.date}</td>
      <td className="border p-2">{data.serialNo}</td>
      <td className="border p-2 text-center relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FaEye className="text-blue-600 inline" />
        </button>
        {dropdownOpen && (
          <div className="absolute z-10 bg-white border rounded shadow-lg right-0 mt-2 w-40 text-left">
            {sampleReports.map((report, idx) => (
              <div
                key={idx}
                className="px-4 py-2 border-b hover:bg-gray-100 flex justify-between items-center"
              >
                <span>{report}</span>
                {data.reports.includes(report) && <span className="text-green-500">✅</span>}
              </div>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
};

const AddForm = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    lotSize: '',
    date: '',
    serialNo: '',
    reports: [],
  });

  const toggleReport = (report) => {
    setForm((prev) => ({
      ...prev,
      reports: prev.reports.includes(report)
        ? prev.reports.filter((r) => r !== report)
        : [...prev.reports, report],
    }));
  };

  const handleSubmit = () => {
    if (!form.lotSize || !form.date || !form.serialNo) {
      alert('All fields are required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>

        <input
          type="text"
          placeholder="Lot Size"
          className="w-full border px-3 py-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, lotSize: e.target.value })}
        />

        <input
          type="date"
          className="w-full border px-3 py-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="text"
          placeholder="Serial No"
          className="w-full border px-3 py-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, serialNo: e.target.value })}
        />

        <div className="mb-4">
          <label className="block font-medium mb-1">Select Reports</label>
          <div className="flex flex-col gap-2">
            {sampleReports.map((report, idx) => (
              <label key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.reports.includes(report)}
                  onChange={() => toggleReport(report)}
                  className="mr-2"
                />
                {report}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
