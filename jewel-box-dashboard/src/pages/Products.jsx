import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

// --- MOCK DEPENDENCIES for self-contained app ---
// In a real app, these would be separate files/contexts
const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 p-8 font-inter">
    <div className="max-w-7xl mx-auto">{children}</div>
  </div>
);

const useTheme = () => ({
  isDarkMode: false,
});

const useToast = () => ({
  showToast: (message, type) => {
    const color = type === 'success' ? 'green' : 'red';
    console.log(`%c[Toast ${type.toUpperCase()}] ${message}`, `color: white; background-color: ${color}; padding: 2px 4px; border-radius: 4px;`);
  },
});

// --- Reusable Modal Component ---
const Modal = ({ isOpen, title, onClose, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 transform transition-all duration-300 scale-95 md:scale-100">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="py-4 text-gray-700 dark:text-gray-300">
          {children}
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {actions}
        </div>
      </div>
    </div>
  );
};

// --- Main Products Component (Refactored) ---
const Products = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const API_BASE_URL = 'http://localhost:5000/api';

  const [productsData, setProductsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Form state for add/edit
  const [formState, setFormState] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    price: '',
    stock: '',
    description: ''
  });

  // --- Set Page Title ---
  useEffect(() => {
    document.title = "Products - Jewel Box App";
  }, []);

  // --- Fetch Products, Categories, and Subcategories from Backend ---
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsResponse, categoriesResponse, subcategoriesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/categories`),
        fetch(`${API_BASE_URL}/subcategories`)
      ]);

      if (!productsResponse.ok) throw new Error(`HTTP error! status: ${productsResponse.status} for products`);
      if (!categoriesResponse.ok) throw new Error(`HTTP error! status: ${categoriesResponse.status} for categories`);
      if (!subcategoriesResponse.ok) throw new Error(`HTTP error! status: ${subcategoriesResponse.status} for subcategories`);

      const products = await productsResponse.json();
      const categories = await categoriesResponse.json();
      const subcategories = await subcategoriesResponse.json();

      setProductsData(products);
      setCategories(categories);
      setSubcategories(subcategories);

      showToast("Products, Categories, and Subcategories loaded successfully!", "success");
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load products or related data. Please ensure the backend server is running and data is seeded.");
      showToast(`Failed to load data: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormState({ name: '', categoryId: '', subcategoryId: '', price: '', stock: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormState({
      name: product.name,
      categoryId: product.category?._id || '',
      subcategoryId: product.subcategory?._id || '',
      price: product.price,
      stock: product.stock,
      description: product.description || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormState({ name: '', categoryId: '', subcategoryId: '', price: '', stock: '', description: '' });
  };

  const handleOpenDeleteModal = (id) => {
    setDeletingProductId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingProductId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, categoryId, subcategoryId, price, stock, description } = formState;

    if (!name || !categoryId || !subcategoryId || !price || !stock) {
      showToast("All required fields must be filled correctly.", "error");
      return;
    }

    const payload = {
      name,
      category: categoryId,
      subcategory: subcategoryId,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
    };

    try {
      let response;
      if (editingProduct) {
        // Handle edit (PUT request)
        response = await fetch(`${API_BASE_URL}/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Handle add (POST request)
        response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }

      const result = await response.json();
      if (editingProduct) {
        setProductsData((prevData) =>
          prevData.map((product) => product._id === result._id ? result : product)
        );
        showToast("Product updated successfully!", "success");
      } else {
        setProductsData((prevData) => [...prevData, result]);
        showToast("Product added successfully!", "success");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save product:", err);
      showToast(`Failed to save product: ${err.message}`, "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingProductId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/products/${deletingProductId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      setProductsData((prevData) => prevData.filter((product) => product._id !== deletingProductId));
      showToast("Product deleted successfully!", "success");
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast(`Failed to delete product: ${err.message}`, "error");
    }
  };

  // Filter subcategories based on the selected category
  const filteredSubcategories = formState.categoryId
    ? subcategories.filter(sub => sub.category._id === formState.categoryId)
    : [];

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Products</h1>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            <PlusCircle size={18} />
            <span>Add New Product</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
          ) : error ? (
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          ) : productsData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No products found. Add one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Name</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Category</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Subcategory</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Price</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Stock</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {productsData.map((product) => (
                    <tr key={product._id}>
                      <td className={`${tableCellClasses} text-gray-900 dark:text-white`}>{product.name}</td>
                      <td className={`${tableCellClasses} text-gray-900 dark:text-white`}>{product.category ? product.category.name : 'N/A'}</td>
                      <td className={`${tableCellClasses} text-gray-900 dark:text-white`}>{product.subcategory ? product.subcategory.name : 'N/A'}</td>
                      <td className={`${tableCellClasses} text-gray-900 dark:text-white`}>Rs {product.price.toLocaleString('en-IN')}</td>
                      <td className={`${tableCellClasses} text-gray-900 dark:text-white`}>{product.stock}</td>
                      <td className={tableCellClasses}>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleOpenEditModal(product)} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleOpenDeleteModal(product._id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination Placeholder */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{productsData.length > 0 ? `1 to ${productsData.length} of ${productsData.length}` : '0 to 0 of 0'}</span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Previous</button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        actions={
          <>
            <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              {editingProduct ? "Save Changes" : "Add Product"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" id="name" name="name" value={formState.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select id="categoryId" name="categoryId" value={formState.categoryId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
              <option value="">-- Select a Category --</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategory</label>
            <select id="subcategoryId" name="subcategoryId" value={formState.subcategoryId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required disabled={!formState.categoryId}>
              <option value="">-- Select a Subcategory --</option>
              {filteredSubcategories.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
              <input type="number" id="price" name="price" value={formState.price} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required min="0" step="0.01" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
              <input type="number" id="stock" name="stock" value={formState.stock} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required min="0" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
            <textarea id="description" name="description" value={formState.description} onChange={handleInputChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirm Deletion"
        actions={
          <>
            <button onClick={handleCloseDeleteModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
};

// --- App component for previewing ---
const App = () => {
  return <Products />;
};

export default App;
