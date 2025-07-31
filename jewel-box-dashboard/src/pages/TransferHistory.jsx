// src/pages/TransferHistory.jsx
import React, { useEffect } from 'react'; // Import useEffect
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const TransferHistory = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  // --- Set Page Title ---
  useEffect(() => {
    document.title = "Transfer History - Jewel Box App";
  }, []);

  const transferData = [
    { id: 1, from: 'Main Warehouse', to: 'North Branch', product: 'Gold Ring', quantity: 5, date: '2023-07-25' },
    { id: 2, from: 'South Branch', to: 'Main Warehouse', product: 'Silver Necklace', quantity: 10, date: '2023-07-24' },
    { id: 3, from: 'East Branch', to: 'South Branch', product: 'Diamond Earrings', quantity: 2, date: '2023-07-23' },
  ];

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Transfer History</h1>

        <div className="bg-white p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
            <input
              type="text"
              placeholder="Search by product or branch..."
              className="w-full md:w-1/3 px-4 py-2 border rounded-md text-sm transition-colors duration-200"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                '--tw-placeholder-color': 'var(--text-placeholder)'
              }}
            />
            <select className="border rounded-md px-3 py-1.5 text-sm transition-colors duration-200"
                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
              <option>All Warehouses</option>
            </select>
            <select className="border rounded-md px-3 py-1.5 text-sm transition-colors duration-200"
                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
              <option>All Branches</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
              <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                <tr>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>From</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>To</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Product</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Quantity</th>
                  <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                {transferData.map((transfer) => (
                  <tr key={transfer.id}>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{transfer.from}</td>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{transfer.to}</td>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{transfer.product}</td>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{transfer.quantity}</td>
                    <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{transfer.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Placeholder */}
          <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>1 to {transferData.length} of {transferData.length}</span>
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

export default TransferHistory;