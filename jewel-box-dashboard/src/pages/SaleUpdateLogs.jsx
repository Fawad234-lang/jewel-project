// src/pages/SaleUpdateLogs.jsx
import React, { useEffect } from 'react'; // Import useEffect
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const SaleUpdateLogs = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  // --- Set Page Title ---
  useEffect(() => {
    document.title = "Sale Update Logs - Jewel Box App";
  }, []);

  const logData = [
    { id: 1, saleID: 'STE54714', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'No change', changes: 'No reason provided', reason: 'No reason provided', date: 'Jul 29, 2025 01:12', actions: '' },
    { id: 2, saleID: 'ND27839', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'Rs. -3950', changes: 'return deflected', reason: '', date: 'Jul 27, 2025 19:44', actions: '' },
    { id: 3, saleID: 'ZBN1961', branch: 'jewl box', updatedBy: 'admin', valueChange: 'Rs. -1750', changes: 'return for last', reason: '', date: 'Jul 26, 2025 15:38', actions: '' },
    { id: 4, saleID: 'WNY5247', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'Rs. +4550', changes: 'return for test', reason: '', date: 'Jul 23, 2025 02:02', actions: '' },
    { id: 5, saleID: 'DQ46291', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'Rs. -400', changes: 'Return', reason: '', date: 'Jul 21, 2025 16:12', actions: '' },
    { id: 6, saleID: 'BB83372', branch: 'jewl box', updatedBy: 'branch manager', valueChange: 'Rs. +9k, 417', changes: 'david', reason: '', date: 'Jul 20, 2025 09:19', actions: '' },
    { id: 7, saleID: 'QP19084', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'Rs. +8k, 417', changes: 'No reason provided', reason: '', date: 'Jul 20, 2025 09:00', actions: '' },
    { id: 8, saleID: 'WNZ12761', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'Rs. +300', changes: 'Return', reason: '', date: 'Jul 19, 2025 16:40', actions: '' },
    { id: 9, saleID: 'MN782349', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'No change', changes: 'No reason provided', reason: '', date: 'Jul 19, 2025 16:49', actions: '' },
    { id: 10, saleID: 'QS678297', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'Rs. +1750', changes: 'skipped during bill', reason: '', date: 'Jul 19, 2025 16:40', actions: '' },
    { id: 11, saleID: 'LAA47345', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'Rs. -1050', changes: 'Return', reason: '', date: 'Jul 19, 2025 16:37', actions: '' },
    { id: 12, saleID: 'LAA47343', branch: 'JewelBox', updatedBy: 'admin', valueChange: 'No change', changes: 'No reason provided', reason: '', date: 'Jul 19, 2025 16:53', actions: '' },
    { id: 13, saleID: 'LAA47344', branch: 'JewelBox', updatedBy: 'M.A.Q.I. All', valueChange: 'Rs. -4', changes: 'Botchange', reason: '', date: 'Jul 19, 2025 16:28', actions: '' },
  ];

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Sale Update Logs</h1>

        <div className="bg-white p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <select className="border rounded-md px-3 py-1.5 text-sm transition-colors duration-200"
                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
              <option>Branch...</option>
            </select>
            <select className="border rounded-md px-3 py-1.5 text-sm transition-colors duration-200"
                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
              <option>Select...</option>
            </select>
            <input type="text" placeholder="dd/mm/yyyy" className="border rounded-md px-3 py-1.5 text-sm transition-colors duration-200"
                   style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', '--tw-placeholder-color': 'var(--text-placeholder)' }} />
            <input type="text" placeholder="dd/mm/yyyy" className="border rounded-md px-3 py-1.5 text-sm transition-colors duration-200"
                   style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', '--tw-placeholder-color': 'var(--text-placeholder)' }} />
            <input type="text" placeholder="Min Rs." className="border rounded-md px-3 py-1.5 text-sm transition-colors duration-200"
                   style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', '--tw-placeholder-color': 'var(--text-placeholder)' }} />
            <input type="text" placeholder="Max Rs." className="border rounded-md px-3 py-1.5 text-sm transition-colors duration-200"
                   style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', '--tw-placeholder-color': 'var(--text-placeholder)' }} />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Sale ID, Branch, User, Reason..."
              className="w-full px-4 py-2 border rounded-md text-sm transition-colors duration-200"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                '--tw-placeholder-color': 'var(--text-placeholder)'
              }}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
              <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                <tr>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Sale ID</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Branch</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Updated By</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Value Change</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Changes</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Reason</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Date</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                {logData.map((log) => (
                  <tr key={log.id}>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{log.saleID}</td>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{log.branch}</td>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{log.updatedBy}</td>
                    <td className={tableCellClasses} style={{ color: parseFloat(log.valueChange) >= 0 ? 'var(--text-green)' : 'var(--text-red)' }}>{log.valueChange}</td>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{log.changes}</td>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{log.reason}</td>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{log.date}</td>
                    <td className={tableCellClasses}>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => showToast(`View log ${log.id} details`, 'info')} className="text-blue-500 hover:text-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Placeholder */}
          <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>1 to {logData.length} of {logData.length}</span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Previous</button>
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SaleUpdateLogs;