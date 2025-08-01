import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StatCard from '../components/Shared/StatCard';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const [topStats, setTopStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  // This will read the environment variable set in Vercel.
  // The .replace(/\/$/, '') part ensures no double slashes.
  const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  // --- Hardcoded Data (remaining sections) ---
  const salesmanPerformanceData = [
    { salesman: 'test', phone: '1232441', branch: 'JewelBox', revenue: 167280, salesCount: 2, avgRevenue: 83640 },
    { salesman: 'salmn', phone: '12345678911', branch: 'jewl box', revenue: 13250, salesCount: 3, avgRevenue: 4416.67 },
    { salesman: 'saleman', phone: '1561002340', branch: 'random name', revenue: 1400, salesCount: 1, avgRevenue: 1400 },
  ];

  const summaryStats = [
    { title: 'Total Revenue', value: 191730, isCurrency: true },
    { title: 'Total Sales', value: 9 },
    { title: 'Average Revenue/Sale', value: 21303.33, isCurrency: true },
  ];

  const [gstPercentage, setGstPercentage] = useState(13);
  const [chartOptions, setChartOptions] = useState({});

  const monthlySalesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: [10, 15, 8, 12, 18, 20, 25, 14, 10, 16, 19, 22],
        backgroundColor: '#3B82F6', // Tailwind blue-500
        borderRadius: 4,
      },
    ],
  };

  // --- Set Page Title ---
  useEffect(() => {
    document.title = "Dashboard - Jewel Box App";
  }, []);

  // --- Fetch Top Stats from Backend ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        setErrorStats(null);
        // Use the API_BASE_URL for the fetch call
        const url = `${API_BASE_URL}/api/stats`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTopStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setErrorStats("Failed to load stats. Please ensure the backend server is running and data is seeded.");
        showToast("Failed to load dashboard stats!", "error");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [showToast, API_BASE_URL]); // Add API_BASE_URL to dependencies

  // --- Fetch Recent Orders from Backend ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setErrorOrders(null);
        // Use the API_BASE_URL for the fetch call
        const url = `${API_BASE_URL}/api/orders`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecentOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setErrorOrders("Failed to load recent orders. Please ensure the backend server is running and data is seeded.");
        showToast("Failed to load recent orders!", "error");
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [showToast, API_BASE_URL]); // Add API_BASE_URL to dependencies

  // --- Chart Options Effect (depends on dark mode) ---
  useEffect(() => {
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
          titleColor: isDarkMode ? '#000' : '#fff',
          bodyColor: isDarkMode ? '#000' : '#fff',
          borderColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          borderWidth: 1,
          cornerRadius: 4,
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', // More visible grid lines in dark mode
            drawBorder: false,
          },
          ticks: {
            color: isDarkMode ? '#FFFFFF' : 'var(--text-secondary)', // Explicitly white in dark mode
            font: { size: 12 },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', // More visible grid lines in dark mode
            drawBorder: false,
          },
          ticks: {
            stepSize: 10,
            color: isDarkMode ? '#FFFFFF' : 'var(--text-secondary)', // Explicitly white in dark mode
            font: { size: 12 },
          },
        },
      },
    });
  }, [isDarkMode]);

  // --- File Download Utility Function ---
  const downloadFile = (data, filename, type) => {
    const blob = new Blob([data], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Button Handlers (now with toasts and download logic) ---
  const handlePnlReport = () => {
    const reportContent = "P&L Report Data:\nDate,Revenue,Expenses,Profit\n2023-01-01,10000,5000,5000\n2023-01-02,12000,6000,6000";
    downloadFile(reportContent, 'pnl_report.csv', 'text/csv');
    showToast("P&L Report downloaded successfully!", 'success');
  };

  const handleOrdersReport = () => {
    let csvContent = "Sale ID,Branch,Customer,Amount,Date,Status\n";
    recentOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      csvContent += `${order.saleID},${order.branchName},${order.customerName},${order.amount},${date},${order.status}\n`;
    });
    downloadFile(csvContent, 'orders_report.csv', 'text/csv');
    showToast("Orders Report downloaded successfully!", 'success');
  };

  const handleDownloadSalesmanReport = () => {
    let csvContent = "Salesman,Phone,Branch,Revenue,Sales Count,Avg. Revenue/Sale\n";
    salesmanPerformanceData.forEach(row => {
      csvContent += `${row.salesman},${row.phone},${row.branch},${row.revenue},${row.salesCount},${row.avgRevenue}\n`;
    });
    downloadFile(csvContent, 'salesman_performance.csv', 'text/csv');
    showToast("Salesman Performance Report downloaded successfully!", 'success');
  };

  const handleSaveTaxSettings = () => {
    console.log("Saving GST Percentage:", gstPercentage);
    showToast(`GST Percentage saved: ${gstPercentage}%`, 'success');
  };

  const formElementClasses = "border rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
  // Responsive search input classes: full width on small, 1/3 on medium and up
  const searchInputClasses = "w-full md:w-1/3 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200";
  // Responsive GST input classes: full width on small, 1/3 on medium and up
  const gstInputClasses = "w-full md:w-1/3 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";

  // --- Custom Table Logic for Recent Orders ---
  const [recentOrdersSortConfig, setRecentOrdersSortConfig] = useState({ key: null, direction: 'ascending' });
  const [recentOrdersCurrentPage, setRecentOrdersCurrentPage] = useState(1);
  const [recentOrdersItemsPerPage, setRecentOrdersItemsPerPage] = useState(5);
  const [recentOrdersGlobalFilter, setRecentOrdersGlobalFilter] = useState('');

  const sortedAndFilteredRecentOrders = useMemo(() => {
    let sortableItems = [...recentOrders];

    // Apply global filter
    if (recentOrdersGlobalFilter) {
      sortableItems = sortableItems.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(recentOrdersGlobalFilter.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (recentOrdersSortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[recentOrdersSortConfig.key];
        const bValue = b[recentOrdersSortConfig.key];

        if (aValue < bValue) {
          return recentOrdersSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return recentOrdersSortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [recentOrders, recentOrdersSortConfig, recentOrdersGlobalFilter]);

  const totalRecentOrdersPages = Math.ceil(sortedAndFilteredRecentOrders.length / recentOrdersItemsPerPage);
  const paginatedRecentOrders = useMemo(() => {
    const startIndex = (recentOrdersCurrentPage - 1) * recentOrdersItemsPerPage;
    const endIndex = startIndex + recentOrdersItemsPerPage;
    return sortedAndFilteredRecentOrders.slice(startIndex, endIndex);
  }, [sortedAndFilteredRecentOrders, recentOrdersCurrentPage, recentOrdersItemsPerPage]);

  const requestRecentOrdersSort = (key) => {
    let direction = 'ascending';
    if (recentOrdersSortConfig.key === key && recentOrdersSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setRecentOrdersSortConfig({ key, direction });
  };

  // --- Custom Table Logic for Salesman Performance ---
  const [salesmanSortConfig, setSalesmanSortConfig] = useState({ key: null, direction: 'ascending' });
  const [salesmanCurrentPage, setSalesmanCurrentPage] = useState(1);
  const [salesmanItemsPerPage, setSalesmanItemsPerPage] = useState(5);
  const [salesmanGlobalFilter, setSalesmanGlobalFilter] = useState('');

  const sortedAndFilteredSalesmanData = useMemo(() => {
    let sortableItems = [...salesmanPerformanceData];

    // Apply global filter
    if (salesmanGlobalFilter) {
      sortableItems = sortableItems.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(salesmanGlobalFilter.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (salesmanSortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[salesmanSortConfig.key];
        const bValue = b[salesmanSortConfig.key];

        if (aValue < bValue) {
          return salesmanSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return salesmanSortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [salesmanPerformanceData, salesmanSortConfig, salesmanGlobalFilter]);

  const totalSalesmanPages = Math.ceil(sortedAndFilteredSalesmanData.length / salesmanItemsPerPage);
  const paginatedSalesmanData = useMemo(() => {
    const startIndex = (salesmanCurrentPage - 1) * salesmanItemsPerPage;
    const endIndex = startIndex + salesmanItemsPerPage;
    return sortedAndFilteredSalesmanData.slice(startIndex, endIndex);
  }, [sortedAndFilteredSalesmanData, salesmanCurrentPage, salesmanItemsPerPage]);

  const requestSalesmanSort = (key) => {
    let direction = 'ascending';
    if (salesmanSortConfig.key === key && salesmanSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSalesmanSortConfig({ key, direction });
  };


  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8"> {/* Added responsive padding */}
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {loadingStats ? (
            <p className="text-center py-4 col-span-full" style={{ color: 'var(--text-secondary)' }}>Loading stats...</p>
          ) : errorStats ? (
            <p className="text-center py-4 col-span-full" style={{ color: 'var(--text-red)' }}>Error: {errorStats}</p>
          ) : topStats.length === 0 ? (
            <p className="text-center py-4 col-span-full" style={{ color: 'var(--text-secondary)' }}>No stats found.</p>
          ) : (
            topStats.map((stat) => (
              <StatCard
                key={stat._id} // Use _id from MongoDB
                title={stat.title}
                value={stat.value}
                change={stat.change}
                isCurrency={stat.isCurrency}
              />
            ))
          )}
        </div>

        {/* Recent Orders Table (Custom) */}
        <div className="p-4 sm:p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-3 md:space-y-0">
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Orders</h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full md:w-auto justify-end"> {/* Added w-full and justify-end for mobile */}
              <select className={`${formElementClasses} w-full sm:w-auto`}
                      style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                <option>All Branches</option>
              </select>
              <select className={`${formElementClasses} w-full sm:w-auto`}
                      style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                <option>Today</option>
              </select>
              <button
                onClick={handlePnlReport}
                className="bg-green-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition duration-150 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto">P&L Report</button>
              <button
                onClick={handleOrdersReport}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition duration-150 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto">Orders Report</button>
              <button className="px-4 py-1.5 rounded-md text-sm transition duration-150 ease-in-out hover:bg-gray-50 w-full sm:w-auto"
                      style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>See all</button>
            </div>
          </div>
          {loadingOrders ? (
            <p className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>Loading orders...</p>
          ) : errorOrders ? (
            <p className="text-center py-4" style={{ color: 'var(--text-red)' }}>Error: {errorOrders}</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No recent orders found.</p>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className={searchInputClasses}
                  style={{
                    borderColor: 'var(--border-light)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    '--tw-placeholder-color': 'var(--text-placeholder)'
                  }}
                  value={recentOrdersGlobalFilter}
                  onChange={(e) => setRecentOrdersGlobalFilter(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
                <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
                  <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => requestRecentOrdersSort('saleID')}>
                        Sale ID {recentOrdersSortConfig.key === 'saleID' && (recentOrdersSortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => requestRecentOrdersSort('branchName')}>
                        Branch {recentOrdersSortConfig.key === 'branchName' && (recentOrdersSortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => requestRecentOrdersSort('customerName')}>
                        Customer {recentOrdersSortConfig.key === 'customerName' && (recentOrdersSortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => requestRecentOrdersSort('amount')}>
                        Amount {recentOrdersSortConfig.key === 'amount' && (recentOrdersSortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => requestRecentOrdersSort('createdAt')}>
                        Date {recentOrdersSortConfig.key === 'createdAt' && (recentOrdersSortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => requestRecentOrdersSort('status')}>
                        Status {recentOrdersSortConfig.key === 'status' && (recentOrdersSortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                    {paginatedRecentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{order.saleID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>{order.branchName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>${order.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>Showing {Math.min((recentOrdersCurrentPage - 1) * recentOrdersItemsPerPage + 1, sortedAndFilteredRecentOrders.length)} to {Math.min(recentOrdersCurrentPage * recentOrdersItemsPerPage, sortedAndFilteredRecentOrders.length)} of {sortedAndFilteredRecentOrders.length} results</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setRecentOrdersCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={recentOrdersCurrentPage === 1}
                    className="px-3 py-1 border rounded-md"
                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', opacity: recentOrdersCurrentPage === 1 ? 0.5 : 1 }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setRecentOrdersCurrentPage(prev => Math.min(prev + 1, totalRecentOrdersPages))}
                    disabled={recentOrdersCurrentPage === totalRecentOrdersPages}
                    className="px-3 py-1 border rounded-md"
                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', opacity: recentOrdersCurrentPage === totalRecentOrdersPages ? 0.5 : 1 }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Monthly Sales Chart */}
        <div className="p-4 sm:p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Monthly Sales</h2>
          <div className="h-80">
            <Bar data={monthlySalesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Salesman Performance Table */}
        <div className="p-4 sm:p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-3 md:space-y-0">
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Salesman Performance</h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full md:w-auto justify-end">
              <button
                onClick={handleDownloadSalesmanReport}
                className="bg-purple-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition duration-150 ease-in-out hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 w-full sm:w-auto">Download Report</button>
              <button className="px-4 py-1.5 rounded-md text-sm transition duration-150 ease-in-out hover:bg-gray-50 w-full sm:w-auto"
                      style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>See all</button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search salesmen..."
              className={searchInputClasses}
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                '--tw-placeholder-color': 'var(--text-placeholder)'
              }}
              value={salesmanGlobalFilter}
              onChange={(e) => setSalesmanGlobalFilter(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
              <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => requestSalesmanSort('salesman')}>
                    Salesman {salesmanSortConfig.key === 'salesman' && (salesmanSortConfig.direction === 'ascending' ? '▲' : '▼')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => requestSalesmanSort('branch')}>
                    Branch {salesmanSortConfig.key === 'branch' && (salesmanSortConfig.direction === 'ascending' ? '▲' : '▼')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => requestSalesmanSort('revenue')}>
                    Revenue {salesmanSortConfig.key === 'revenue' && (salesmanSortConfig.direction === 'ascending' ? '▲' : '▼')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Sales Count
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Avg. Revenue/Sale
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                {paginatedSalesmanData.map((row) => (
                  <tr key={row.salesman}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{row.salesman}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>{row.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>{row.branch}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>${row.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>{row.salesCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>${row.avgRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>Showing {Math.min((salesmanCurrentPage - 1) * salesmanItemsPerPage + 1, sortedAndFilteredSalesmanData.length)} to {Math.min(salesmanCurrentPage * salesmanItemsPerPage, sortedAndFilteredSalesmanData.length)} of {sortedAndFilteredSalesmanData.length} results</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSalesmanCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={salesmanCurrentPage === 1}
                className="px-3 py-1 border rounded-md"
                style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', opacity: salesmanCurrentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button
                onClick={() => setSalesmanCurrentPage(prev => Math.min(prev + 1, totalSalesmanPages))}
                disabled={salesmanCurrentPage === totalSalesmanPages}
                className="px-3 py-1 border rounded-md"
                style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', opacity: salesmanCurrentPage === totalSalesmanPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* GST Tax Settings */}
        <div className="p-4 sm:p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Tax Settings</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <label htmlFor="gst-percentage" className="block text-sm font-medium w-full sm:w-auto" style={{ color: 'var(--text-secondary)' }}>
              GST Percentage
            </label>
            <input
              type="number"
              id="gst-percentage"
              value={gstPercentage}
              onChange={(e) => setGstPercentage(e.target.value)}
              className={`${gstInputClasses} w-full sm:w-auto`}
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)'
              }}
              aria-label="GST Percentage Input"
            />
            <button
              onClick={handleSaveTaxSettings}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
