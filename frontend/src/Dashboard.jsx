import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";


// Reports list
const orderedReports = [
  { id: "BareBoard MB", name: "Bare Board Inspection Report MB" },
  { id: "BareBoard PB", name: "Bare Board Inspection Report PB" },
  { id: "Assembled Board MB", name: "Assembled Board Inspection Report MB" },
  { id: "Assembled Board PB", name: "Assembled Board Inspection Report PB" },
  { id: "High Temperature", name: "High Temperature Report" },
  { id: "High Temperature Graph", name: "High Temperature Graph" },
  { id: "Thermal Shock", name: "Thermal Shock Report" },
  { id: "Thermal Shock Graph", name: "Thermal Shock Graph" },
  { id: "Burn In", name: "Burn In Report" },
  { id: "Burn In Graph", name: "Burn In Graph" },
  { id: "Potting and Coating", name: "Potting and Coating Report" },
  { id: "Checklist of wiring", name: "Checklist of Wiring Report" },
  { id: "Final Assembly", name: "Final Assembly Report" },
  { id: "Initial Coldcheck", name: "Initial Coldcheck Report" },
  { id: "Initial Isolation", name: "Initial Isolation Report" },
  { id: "Initial Functional Test", name: "Initial Functional Test Report" },
  { id: "Pre-Vibration Test", name: "Pre-Vibration Test Report" },
  { id: "Pre-Vibration Graph", name: "Pre-Vibration Test Graph" },
  { id: "Thermal Cycling", name: "Thermal Cycling Report" },
  { id: "Thermal Cycling Graph", name: "Thermal Cycling Graph" },
  { id: "Post Vibration Test", name: "Post Vibration Test Report" },
  { id: "Post Vibration Graph", name: "Post Vibration Test Graph" },
  { id: "Low Temperature", name: "Low Temperature Report" },
  { id: "Low Temperature Graph", name: "Low Temperature Graph" },
  { id: "High Altitude", name: "High Altitude Report" },
  { id: "High Altitude Graph", name: "High Altitude Graph" },
  { id: "Final Coldcheck", name: "Final Coldcheck Report" },
  { id: "Final Isolation", name: "Final Isolation Report" },
  { id: "Final Functional Test", name: "Final Functional Test Report" },
];

// 🛡️ Simple passcode to restrict actions
const ADMIN_PASSCODE = "admin123";

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [viewReportsIndex, setViewReportsIndex] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/entries")
      .then((res) => setEntries(res.data))
      .catch(console.error);
  }, []);

  const handleAuthRequired = (actionFn) => {
    setPendingAction(() => actionFn);
    setShowAuthModal(true);
  };

  const upsertEntry = async (entry) => {
    if (editIndex !== null) {
      const id = entries[editIndex]._id;
      const res = await axios.put(`http://localhost:5000/entries/${id}`, entry);
      const updated = [...entries];
      updated[editIndex] = res.data;
      setEntries(updated);
      setEditIndex(null);
    } else {
      const res = await axios.post("http://localhost:5000/entries", entry);
      setEntries([res.data, ...entries]);
    }
    setShowForm(false);
  };

  const removeEntry = async (index) => {
    const id = entries[index]._id;
    await axios.delete(`http://localhost:5000/entries/${id}`);
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 text-center">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📋 Report Dashboard</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() =>
            handleAuthRequired(() => {
              setEditIndex(null);
              setShowForm(true);
            })
          }
        >
          ➕ Add
        </button>
      </div>

      <table className="w-full border border-gray-300 shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Lot No.</th>
            <th className="border p-2">Lot Size</th>
            <th className="border p-2">Unit No.</th>
            <th className="border p-2">View Reports</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry._id} className="hover:bg-gray-50 text-center">
              <td className="border p-2">{entry.lotNo}</td>
              <td className="border p-2">{entry.lotSize}</td>
              <td className="border p-2">{entry.UnitNo}</td>
              <td className="border p-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setViewReportsIndex(idx)}
                >
                  <FaEye />
                </button>
              </td>
              <td className="border p-2 ">
                <button
                  className="text-green-600 hover:text-green-800 mr-3"
                  onClick={() =>
                    handleAuthRequired(() => {
                      setEditIndex(idx);
                      setShowForm(true);
                    })
                  }
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() =>
                    handleAuthRequired(() => {
                      removeEntry(idx);
                    })
                  }
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <AddForm
          onClose={() => {
            setShowForm(false);
            setEditIndex(null);
          }}
          onSubmit={upsertEntry}
          initialData={editIndex !== null ? entries[editIndex] : null}
        />
      )}

      {viewReportsIndex !== null && (
        <ReportsModal
          entry={entries[viewReportsIndex]}
          onClose={() => setViewReportsIndex(null)}
        />
      )}

      {showAuthModal && (
        <PasswordPrompt
          onSuccess={() => {
            setShowAuthModal(false);
            pendingAction && pendingAction();
          }}
          onCancel={() => {
            setShowAuthModal(false);
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
};

const ReportsModal = ({ entry, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
      <h2 className="text-xl font-bold mb-4">
        📄 Reports for Lot No: {entry.lotNo}
      </h2>
      <ul className="space-y-2">
        {orderedReports.map(({ id, name }) => (
          <li
            key={id}
            className={`flex items-center ${
              entry.reports.includes(id)
                ? "text-blue-800 font-semibold"
                : "text-gray-400"
            }`}
          >
            <input
              type="checkbox"
              readOnly
              checked={entry.reports.includes(id)}
              className="mr-2"
            />
            {name}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const AddForm = ({ onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(
    initialData || { lotNo: "", lotSize: "", UnitNo: "", reports: [] }
  );
  const [search, setSearch] = useState("");

  const toggleReport = (report) => {
    setForm((prev) => ({
      ...prev,
      reports: prev.reports.includes(report)
        ? prev.reports.filter((r) => r !== report)
        : [...prev.reports, report],
    }));
  };

  const handleSubmit = () => {
    if (!form.lotNo || !form.lotSize || !form.UnitNo) {
      alert("All fields are required.");
      return;
    }
    onSubmit(form);
  };

  const filteredReports = orderedReports.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "✏️ Edit Entry" : "➕ Add New Entry"}
        </h2>

        <label className="block font-medium mb-1 text-left">Lot No</label>
        <input
          type="text"
          placeholder="Lot No"
          className="w-full border px-3 py-1 mb-2 rounded"
          value={form.lotNo}
          onChange={(e) => setForm({ ...form, lotNo: e.target.value })}
        />
        <label className="block font-medium mb-1 text-left">Lot Size</label>
        <input
          type="text"
          placeholder="Lot Size"
          className="w-full border px-3 py-1 mb-2 rounded"
          value={form.lotSize}
          onChange={(e) => setForm({ ...form, lotSize: e.target.value })}
        />
        <label className="block font-medium mb-1 text-left">Unit No</label>
        <input
          type="text"
          placeholder="Unit No"
          className="w-full border px-3 py-1 mb-2 rounded"
          value={form.UnitNo}
          onChange={(e) => setForm({ ...form, UnitNo: e.target.value })}
        />

        <label className="block font-medium mb-1 text-left">Search & Select Reports</label>
        <input
          type="text"
          placeholder="Search reports..."
          className="w-full border px-3 py-1 mb-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="h-64 overflow-y-auto grid grid-cols-2 sm:grid-cols-2 gap-3 pr-2 mb-4 text-left text-sm">
          {filteredReports.map(({ id, name }) => (
            <label key={id} className="flex items-center">
              <input
                type="checkbox"
                checked={form.reports.includes(id)}
                onChange={() => toggleReport(id)}
                className="mr-2"
              />
              {name}
            </label>
          ))}
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

// 🔐 Password prompt modal
const PasswordPrompt = ({ onSuccess, onCancel }) => {
  const [passcode, setPasscode] = useState("");

  const handleCheck = () => {
    if (passcode === ADMIN_PASSCODE) {
      onSuccess();
    } else {
      alert("Incorrect passcode.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">🔐 Enter Passcode</h2>
        <input
          type="password"
          placeholder="Enter admin passcode"
          className="w-full border px-3 py-2 rounded mb-4"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleCheck}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
