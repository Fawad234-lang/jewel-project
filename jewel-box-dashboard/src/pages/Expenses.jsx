import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { lucideReact } from 'lucide-react';

const Expenses = () => {
    const { isDarkMode } = useTheme();
    const { showToast } = useToast();
    const [expensesData, setExpensesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Custom Table State ---
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [globalFilter, setGlobalFilter] = useState('');
    
    // --- State for Custom Modals ---
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newExpenseName, setNewExpenseName] = useState('');
    const [newExpenseAmount, setNewExpenseAmount] = useState('');
    const [newExpenseDate, setNewExpenseDate] = useState('');
    const [newExpenseDescription, setNewExpenseDescription] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editExpenseId, setEditExpenseId] = useState(null);
    const [editExpenseName, setEditExpenseName] = useState('');
    const [editExpenseAmount, setEditExpenseAmount] = useState('');
    const [editExpenseDate, setEditExpenseDate] = useState('');
    const [editExpenseDescription, setEditExpenseDescription] = useState('');

    // This reads the environment variable set in Vercel or locally.
    const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

    // --- Set Page Title ---
    useEffect(() => {
        document.title = "Expenses - Jewel Box App";
    }, []);

    // --- Fetch Expenses from Backend ---
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                setLoading(true);
                setError(null);
                const url = `${API_BASE_URL}/api/expenses`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setExpensesData(data);
                showToast("Expenses loaded successfully!", "success");
            } catch (err) {
                console.error("Failed to fetch expenses:", err);
                setError("Failed to load expenses. Please ensure the backend server is running and accessible.");
                showToast(`Failed to load expenses: ${err.message}`, "error");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [showToast, API_BASE_URL]);

    // --- Handlers for CRUD Operations ---
    const handleAddExpense = async () => {
        const amount = parseFloat(newExpenseAmount);

        if (!newExpenseName || isNaN(amount)) {
            showToast("Expense name and amount are required, and amount must be a number.", "error");
            return;
        }

        const newExpense = {
            name: newExpenseName,
            amount: amount,
            date: newExpenseDate || undefined,
            description: newExpenseDescription,
        };

        try {
            const url = `${API_BASE_URL}/api/expenses`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newExpense),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }
            const addedExpense = await response.json();
            setExpensesData((prevData) => [...prevData, addedExpense]);
            showToast("Expense added successfully!", "success");
            setShowAddModal(false);
            setNewExpenseName('');
            setNewExpenseAmount('');
            setNewExpenseDate('');
            setNewExpenseDescription('');
        } catch (err) {
            console.error("Failed to add expense:", err);
            showToast(`Failed to add expense: ${err.message}`, "error");
        }
    };

    const handleEditClick = (id) => {
        const expenseToEdit = expensesData.find(e => e._id === id);
        if (!expenseToEdit) return;
        
        setEditExpenseId(id);
        setEditExpenseName(expenseToEdit.name);
        setEditExpenseAmount(expenseToEdit.amount);
        setEditExpenseDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
        setEditExpenseDescription(expenseToEdit.description);
        setIsEditing(true);
    };

    const submitEdit = async () => {
        const amount = parseFloat(editExpenseAmount);

        if (!editExpenseName || isNaN(amount)) {
            showToast("Expense name and amount are required for update, and amount must be a number.", "error");
            return;
        }

        const updatedFields = {
            name: editExpenseName,
            amount: amount,
            date: editExpenseDate || undefined,
            description: editExpenseDescription,
        };

        try {
            const url = `${API_BASE_URL}/api/expenses/${editExpenseId}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFields),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }
            const updatedExpense = await response.json();
            setExpensesData((prevData) =>
                prevData.map((expense) =>
                    expense._id === editExpenseId ? updatedExpense : expense
                )
            );
            showToast("Expense updated successfully!", "success");
        } catch (err) {
            console.error("Failed to update expense:", err);
            showToast(`Failed to update expense: ${err.message}`, "error");
        } finally {
            setIsEditing(false);
            setEditExpenseId(null);
            setEditExpenseName('');
            setEditExpenseAmount('');
            setEditExpenseDate('');
            setEditExpenseDescription('');
        }
    };

    const handleDeleteClick = (id) => {
        setExpenseToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!expenseToDelete) return;

        try {
            const url = `${API_BASE_URL}/api/expenses/${expenseToDelete}`;
            const response = await fetch(url, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }
            setExpensesData((prevData) => prevData.filter((expense) => expense._id !== expenseToDelete));
            showToast("Expense deleted successfully!", "success");
        } catch (err) {
            console.error("Failed to delete expense:", err);
            showToast(`Failed to delete expense: ${err.message}`, "error");
        } finally {
            setShowDeleteConfirm(false);
            setExpenseToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setExpenseToDelete(null);
    };

    // --- Custom Table Logic ---
    const sortedAndFilteredExpenses = useMemo(() => {
        let sortableItems = [...expensesData];

        // Apply global filter
        if (globalFilter) {
            sortableItems = sortableItems.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(globalFilter.toLowerCase())
                )
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [expensesData, sortConfig, globalFilter]);

    const totalPages = Math.ceil(sortedAndFilteredExpenses.length / itemsPerPage);
    const paginatedExpenses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedAndFilteredExpenses.slice(startIndex, endIndex);
    }, [sortedAndFilteredExpenses, currentPage, itemsPerPage]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
    const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";
    const searchInputClasses = "w-full sm:w-auto flex-grow px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200";

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Expenses</h1>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            className={searchInputClasses}
                            style={{
                                borderColor: 'var(--border-light)',
                                backgroundColor: 'var(--bg-input)',
                                color: 'var(--text-primary)',
                                '--tw-placeholder-color': 'var(--text-placeholder)'
                            }}
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out w-full sm:w-auto"
                        >
                            Add New Expense
                        </button>
                    </div>
                </div>

                <div className="p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
                    {loading ? (
                        <p style={{ color: 'var(--text-secondary)' }}>Loading expenses...</p>
                    ) : error ? (
                        <p style={{ color: 'var(--text-red)' }}>Error: {error}</p>
                    ) : expensesData.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No expenses found. Add one!</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
                                <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
                                    <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                                        <tr>
                                            <th scope="col" className={`${tableHeaderClasses} cursor-pointer`} style={{ color: 'var(--text-secondary)' }} onClick={() => requestSort('name')}>
                                                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                            </th>
                                            <th scope="col" className={`${tableHeaderClasses} cursor-pointer`} style={{ color: 'var(--text-secondary)' }} onClick={() => requestSort('amount')}>
                                                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                            </th>
                                            <th scope="col" className={`${tableHeaderClasses} cursor-pointer`} style={{ color: 'var(--text-secondary)' }} onClick={() => requestSort('date')}>
                                                Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                            </th>
                                            <th scope="col" className={`${tableHeaderClasses} cursor-pointer`} style={{ color: 'var(--text-secondary)' }} onClick={() => requestSort('description')}>
                                                Description {sortConfig.key === 'description' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                            </th>
                                            <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                                        {paginatedExpenses.map((expense) => (
                                            <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                                <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{expense.name}</td>
                                                <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>Rs {expense.amount.toLocaleString('en-IN')}</td>
                                                <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{new Date(expense.date).toLocaleDateString()}</td>
                                                <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{expense.description}</td>
                                                <td className={tableCellClasses}>
                                                    <div className="flex items-center space-x-2">
                                                        <button onClick={() => handleEditClick(expense._id)} className="text-blue-500 hover:text-blue-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.75" />
                                                            </svg>
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(expense._id)} className="text-red-500 hover:text-red-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.262 9m10.118-3.468a.75.75 0 0 0 0-1.06L18.47 3.22a.75.75 0 0 0-1.06 0l-1.06 1.06M16.5 7.5h-9m9 0H12m-2.25 4.5h3.5m-3.5 0a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5h-15V21a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V7.5Z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {paginatedExpenses.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                    No expenses found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between p-4 border-t rounded-b-lg" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-card)' }}>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {'<<'}
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {'<'}
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {'>'}
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {'>>'}
                                    </button>
                                </div>
                                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    Page{' '}
                                    <strong>
                                        {currentPage} of{' '}
                                        {totalPages}
                                    </strong>
                                </span>
                                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    | Go to page:{' '}
                                    <input
                                        type="number"
                                        defaultValue={currentPage}
                                        onChange={e => {
                                            const page = Number(e.target.value);
                                            if (page > 0 && page <= totalPages) {
                                                setCurrentPage(page);
                                            }
                                        }}
                                        className="w-16 p-1 border rounded-md text-sm"
                                        style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                                    />
                                </span>
                                <select
                                    value={itemsPerPage}
                                    onChange={e => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1); // Reset to first page when items per page changes
                                    }}
                                    className="p-1 border rounded-md text-sm"
                                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                                >
                                    {[5, 10, 20, 30, 40, 50].map(pageSize => (
                                        <option key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Custom Add Expense Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Add New Expense</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Expense Name"
                                value={newExpenseName}
                                onChange={(e) => setNewExpenseName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
                            />
                            <input
                                type="number"
                                placeholder="Amount (e.g., 500)"
                                value={newExpenseAmount}
                                onChange={(e) => setNewExpenseAmount(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
                            />
                            <input
                                type="date"
                                value={newExpenseDate}
                                onChange={(e) => setNewExpenseDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={newExpenseDescription}
                                onChange={(e) => setNewExpenseDescription(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddExpense}
                                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                            >
                                Add Expense
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Edit Expense Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Edit Expense</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Expense Name"
                                value={editExpenseName}
                                onChange={(e) => setEditExpenseName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
                            />
                            <input
                                type="number"
                                placeholder="Amount (e.g., 500)"
                                value={editExpenseAmount}
                                onChange={(e) => setEditExpenseAmount(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
                            />
                            <input
                                type="date"
                                value={editExpenseDate}
                                onChange={(e) => setEditExpenseDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={editExpenseDescription}
                                onChange={(e) => setEditExpenseDescription(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitEdit}
                                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <p className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Are you sure you want to delete this expense?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Expenses;
