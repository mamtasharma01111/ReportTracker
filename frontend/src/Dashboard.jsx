import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

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
    .then((res) => {
      const sorted = res.data.sort((a, b) =>
        a._id.localeCompare(b._id)
      );
      setEntries(sorted);
    })
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
      setEntries([ ...entries, res.data]);
    }
    setShowForm(false);
  };

  const removeEntry = async (index) => {
    const id = entries[index]._id;
    await axios.delete(`http://localhost:5000/entries/${id}`);
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-full mx-auto font-sans min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">📋 Report Dashboard</h1>
        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
          onClick={() =>
            handleAuthRequired(() => {
              setEditIndex(null);
              setShowForm(true);
            })
          }
          aria-label="Add new entry"
        >
          ➕ Add Entry
        </button>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200 shadow rounded overflow-hidden">
  <thead className="bg-blue-50">
    <tr>
      <th className="px-6 py-3 text-center font-bold uppercase tracking-wider border text-indigo-400">Lot No.</th>
      <th className="px-6 py-3 text-center font-bold uppercase tracking-wider border text-indigo-400">Lot Size</th>
      <th className="px-6 py-3 text-center font-bold uppercase tracking-wider border text-indigo-400">Unit No.</th>
      <th className="px-6 py-3 text-center font-bold uppercase tracking-wider border text-indigo-400">Customer Name</th>
      <th className="px-6 py-3 text-center font-bold uppercase tracking-wider border text-indigo-400">Reports</th>
      <th className="px-6 py-3 text-center font-bold uppercase tracking-wider border text-indigo-400">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {entries.map((entry, idx) => (
      <tr key={entry._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 text-center border">{entry.lotNo}</td>
        <td className="px-6 py-4 text-center border">{entry.lotSize}</td>
        <td className="px-6 py-4 text-center border">{entry.UnitNo}</td>
        <td className="px-6 py-4 text-center border">{entry.customerName }</td>
        <td className="px-6 py-4 text-center border">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setViewReportsIndex(idx)}
          >
            <FaEye />
          </button>
        </td>
        <td className="px-6 py-4 text-center">
          <button
            className="text-green-600 hover:text-green-800 mr-4"
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

      </div>

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
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative p-6">
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-900 transition"
        aria-label="Close reports modal"
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold mb-5 text-gray-900 tracking-wide border-b-2 border-gray-200 pb-3">
        📄 Reports for Lot No: {entry.lotNo}
      </h2>
      <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
        {orderedReports.map(({ id, name }) => (
          <li
            key={id}
            className={`flex items-center text-sm ${
              entry.reports.includes(id)
                ? "text-gray-900 font-semibold"
                : "text-gray-400"
            }`}
          >
            <input
              type="checkbox"
              readOnly
              checked={entry.reports.includes(id)}
              className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-default"
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
    initialData || { lotNo: "", lotSize: "", UnitNo: "",customerName: "", reports: [] }
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
    if (!form.lotNo || !form.lotSize || !form.UnitNo || !form.customerName) {
      alert("Please fill all required fields.");
      return;
    }
    onSubmit(form);
  };

  const filteredReports = orderedReports.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-3xl font-bold text-gray-600 hover:text-gray-900 transition"
          aria-label="Close add/edit form"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-wide">
          {initialData ? "✏️ Edit Entry" : "➕ Add New Entry"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-1"
        >
          <div>
            <label
              htmlFor="lotNo"
              className="block font-semibold text-gray-800 mb-1"
            >
              Lot No.
            </label>
            <input
              type="text"
              placeholder="Enter Lot No."
              id="lotNo"
              value={form.lotNo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lotNo: e.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              autoFocus={!initialData}
            />
          </div>

          <div>
            <label
              htmlFor="lotSize"
              className="block font-semibold text-gray-800 mb-1 mt-2"
            >
              Lot Size
            </label>
            <input
              type="number"
              id="lotSize"
              placeholder="Enter Lot Size"
              min="1"
              value={form.lotSize}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lotSize: e.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="UnitNo"
              className="block font-semibold text-gray-800 mb-1 mt-2"
            >
              Unit No.
            </label>
            <input
              type="text"
              id="UnitNo"
              placeholder="Enter Unit No."
              value={form.UnitNo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, UnitNo: e.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="customerName"
              className="block font-semibold text-gray-800 mb-1 mt-2"
            >
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              placeholder="Enter Customer Name"
              value={form.customerName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, customerName: e.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="searchReports"
              className="block font-semibold text-gray-800 mb-1 mt-4"
            >
              Search Reports
            </label>
            <input
              id="searchReports"
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              {filteredReports.length === 0 && (
                <p className="text-gray-400 italic text-sm text-center">
                  No reports found.
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
              {filteredReports.map(({ id, name }) => (
                <label
                  key={id}
                  className="flex items-center mb-2 cursor-pointer select-none "
                >
                  <input
                    type="checkbox"
                    checked={form.reports.includes(id)}
                    onChange={() => toggleReport(id)}
                    className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-gray-700">{name}</span>
                </label>
              ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {initialData ? "Save Changes" : "Add Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PasswordPrompt = ({ onSuccess, onCancel }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const checkPasscode = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setError("");
      onSuccess();
    } else {
      setError("Incorrect passcode.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-900 transition"
          aria-label="Close password prompt"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 tracking-wide">
          🔒 Admin Authentication
        </h2>
        <form onSubmit={checkPasscode} className="space-y-4">
          <input
            type="password"
            placeholder="Enter admin passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Authenticate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
