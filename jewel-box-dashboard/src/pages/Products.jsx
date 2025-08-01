import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

// --- MOCK COMPONENTS AND CONTEXTS ---
// These are simple mock-ups to make the provided code runnable.
// In a real app, these would be in separate files and have more functionality.

// Mock ToastContext
const ToastContext = React.createContext();
const useToast = () => React.useContext(ToastContext);

// Mock ToastProvider
const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl text-white z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

// Mock ThemeContext
const ThemeContext = React.createContext();
const useTheme = () => React.useContext(ThemeContext);
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = 'var(--bg-dark)';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = 'var(--bg-light)';
    }
  }, [isDarkMode]);

  const value = { isDarkMode, toggleTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Mock DashboardLayout
const DashboardLayout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-200 p-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}
      style={{
        '--bg-light': '#f3f4f6',
        '--bg-dark': '#1f2937',
        '--bg-card': isDarkMode ? '#374151' : '#ffffff',
        '--text-primary': isDarkMode ? '#e5e7eb' : '#111827',
        '--text-secondary': isDarkMode ? '#9ca3af' : '#6b7280',
        '--text-red': isDarkMode ? '#f87171' : '#ef4444',
        '--border-light': isDarkMode ? '#4b5563' : '#e5e7eb',
        '--bg-table-header': isDarkMode ? '#4b5563' : '#f9fafb',
        '--bg-input': isDarkMode ? '#4b5563' : '#ffffff',
      }}
    >
      {children}
    </div>
  );
};

// --- Custom Modal Component ---
const Modal = ({ isOpen, title, children, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl m-4 w-full max-w-lg transition-all duration-300">
        <h3 className="text-xl font-bold mb-4 dark:text-gray-100">{title}</h3>
        {children}
        <div className="flex justify-end mt-4 space-x-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PRODUCTS COMPONENT ---
const App = () => {
  const { showToast } = useToast();
  const { isDarkMode } = useTheme();
  
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete'
  const [modalData, setModalData] = useState({});

  // --- Firebase Initialization and Auth ---
  useEffect(() => {
    // These global variables are provided by the canvas environment.
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) {
      console.error("Firebase config is missing.");
      setError("Failed to initialize Firebase. Configuration is missing.");
      setLoading(false);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const auth = getAuth(app);
      setDb(firestoreDb);

      const setupAuth = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (authError) {
          console.error("Firebase Auth Error:", authError);
          setError("Failed to authenticate with Firebase.");
        }
      };

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
          console.log("Firebase user authenticated with UID:", user.uid);
        } else {
          // If no user is found, sign in anonymously as a fallback.
          await setupAuth();
        }
      });
    } catch (err) {
      console.error("Firebase Init Error:", err);
      setError("Failed to initialize Firebase.");
      setLoading(false);
    }
  }, []);

  // --- Data Fetching with onSnapshot ---
  useEffect(() => {
    if (!db || !userId) return;

    setLoading(true);
    setError(null);
    const userPath = `/artifacts/${__app_id}/users/${userId}`;
    
    // Set up listeners for all three collections
    const productsRef = collection(db, `${userPath}/products`);
    const categoriesRef = collection(db, `${userPath}/categories`);
    const subcategoriesRef = collection(db, `${userPath}/subcategories`);

    const unsubProducts = onSnapshot(productsRef, async (productSnapshot) => {
      const productsDocs = productSnapshot.docs;

      // To enrich products with category and subcategory names,
      // we need to first fetch all categories and subcategories
      const categoriesSnapshot = await getDocs(categoriesRef);
      const categoriesMap = new Map(categoriesSnapshot.docs.map(doc => [doc.id, doc.data()]));

      const subcategoriesSnapshot = await getDocs(subcategoriesRef);
      const subcategoriesMap = new Map(subcategoriesSnapshot.docs.map(doc => [doc.id, doc.data()]));

      const productsWithNames = productsDocs.map(productDoc => {
        const productData = productDoc.data();
        const categoryData = categoriesMap.get(productData.category);
        const subcategoryData = subcategoriesMap.get(productData.subcategory);

        return {
          _id: productDoc.id,
          ...productData,
          category: categoryData ? { _id: productData.category, name: categoryData.name } : null,
          subcategory: subcategoryData ? { _id: productData.subcategory, name: subcategoryData.name, category: subcategoryData.category } : null,
        };
      });

      setProductsData(productsWithNames);
      setLoading(false);
    }, (err) => {
      console.error("Products Snapshot Error:", err);
      setError("Failed to load products.");
      setLoading(false);
    });

    const unsubCategories = onSnapshot(categoriesRef, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })));
    });

    const unsubSubcategories = onSnapshot(subcategoriesRef, (snapshot) => {
      setSubcategories(snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })));
    });

    // Cleanup listeners on unmount
    return () => {
      unsubProducts();
      unsubCategories();
      unsubSubcategories();
    };
  }, [db, userId]);

  // --- Handlers for CRUD Operations ---
  const handleOpenAddModal = () => {
    setModalType('add');
    setModalData({
      name: '',
      price: '',
      stock: '',
      description: '',
      categoryName: '',
      subcategoryName: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalType('edit');
    setModalData({
      id: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      categoryName: product.category?.name || '',
      subcategoryName: product.subcategory?.name || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    setModalType('delete');
    setModalData({ id });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (modalType === 'add') {
      await handleAddProduct(modalData);
    } else if (modalType === 'edit') {
      await handleEdit(modalData.id, modalData);
    }
    setIsModalOpen(false);
  };

  const handleAddProduct = async (data) => {
    const { name, categoryName, subcategoryName, price, stock, description } = data;
    if (!name || !categoryName || !subcategoryName || isNaN(price) || isNaN(stock)) {
      showToast("All required fields must be filled correctly.", "error");
      return;
    }

    // Find category and subcategory IDs
    const parentCategory = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!parentCategory) {
      showToast("Category not found. Please enter an existing category name.", "error");
      return;
    }

    const parentSubcategory = subcategories.find(sub =>
      sub.name.toLowerCase() === subcategoryName.toLowerCase() && sub.category._id === parentCategory._id
    );
    if (!parentSubcategory) {
      showToast("Subcategory not found under the selected category. Please enter an existing subcategory name.", "error");
      return;
    }

    const newProduct = {
      name,
      category: parentCategory._id,
      subcategory: parentSubcategory._id,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: description || null,
      createdAt: new Date(),
    };

    try {
      const userPath = `/artifacts/${__app_id}/users/${userId}`;
      const docRef = await addDoc(collection(db, `${userPath}/products`), newProduct);
      showToast("Product added successfully!", "success");
    } catch (err) {
      console.error("Failed to add product:", err);
      showToast(`Failed to add product: ${err.message}`, "error");
    }
  };

  const handleEdit = async (id, updatedFields) => {
    const { name, categoryName, subcategoryName, price, stock, description } = updatedFields;
    if (!name || !categoryName || !subcategoryName || isNaN(price) || isNaN(stock)) {
      showToast("All required fields must be filled correctly for update.", "error");
      return;
    }

    const parentCategory = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!parentCategory) {
      showToast("New category not found. Please enter an existing category name.", "error");
      return;
    }

    const parentSubcategory = subcategories.find(sub =>
      sub.name.toLowerCase() === subcategoryName.toLowerCase() && sub.category._id === parentCategory._id
    );
    if (!parentSubcategory) {
      showToast("New subcategory not found under the selected category. Please enter an existing subcategory name.", "error");
      return;
    }

    const updatedData = {
      name,
      category: parentCategory._id,
      subcategory: parentSubcategory._id,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: description || null,
    };

    try {
      const userPath = `/artifacts/${__app_id}/users/${userId}`;
      const docRef = doc(db, `${userPath}/products`, id);
      await updateDoc(docRef, updatedData);
      showToast("Product updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast(`Failed to update product: ${err.message}`, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const userPath = `/artifacts/${__app_id}/users/${userId}`;
      const docRef = doc(db, `${userPath}/products`, id);
      await deleteDoc(docRef);
      showToast("Product deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast(`Failed to delete product: ${err.message}`, "error");
    }
  };

  // --- Initial Data Seed ---
  const seedData = async () => {
    if (!db || !userId) return;
    const userPath = `/artifacts/${__app_id}/users/${userId}`;
    
    // Check if categories already exist to avoid duplicates
    const categoriesSnapshot = await getDocs(collection(db, `${userPath}/categories`));
    if (!categoriesSnapshot.empty) {
      showToast("Data already seeded.", "info");
      return;
    }

    try {
      const jewelleryCatRef = doc(collection(db, `${userPath}/categories`));
      await setDoc(jewelleryCatRef, { name: "Jewellery" });
      
      const electronicsCatRef = doc(collection(db, `${userPath}/categories`));
      await setDoc(electronicsCatRef, { name: "Electronics" });

      const ringsSubRef = doc(collection(db, `${userPath}/subcategories`));
      await setDoc(ringsSubRef, { name: "Rings", category: jewelleryCatRef.id });

      const necklacesSubRef = doc(collection(db, `${userPath}/subcategories`));
      await setDoc(necklacesSubRef, { name: "Necklaces", category: jewelleryCatRef.id });
      
      const smartphonesSubRef = doc(collection(db, `${userPath}/subcategories`));
      await setDoc(smartphonesSubRef, { name: "Smartphones", category: electronicsCatRef.id });

      await addDoc(collection(db, `${userPath}/products`), {
        name: "Diamond Ring",
        category: jewelleryCatRef.id,
        subcategory: ringsSubRef.id,
        price: 50000,
        stock: 15,
        description: "A stunning diamond ring.",
        createdAt: new Date(),
      });

      await addDoc(collection(db, `${userPath}/products`), {
        name: "Gold Necklace",
        category: jewelleryCatRef.id,
        subcategory: necklacesSubRef.id,
        price: 25000,
        stock: 30,
        description: "Elegant gold necklace.",
        createdAt: new Date(),
      });
      
      await addDoc(collection(db, `${userPath}/products`), {
        name: "Gemini Smartphone",
        category: electronicsCatRef.id,
        subcategory: smartphonesSubRef.id,
        price: 150000,
        stock: 50,
        description: "The next-gen smartphone.",
        createdAt: new Date(),
      });

      showToast("Initial data seeded successfully!", "success");
    } catch (err) {
      console.error("Failed to seed data:", err);
      showToast(`Failed to seed data: ${err.message}`, "error");
    }
  };

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <ThemeProvider>
      <ToastProvider>
        <DashboardLayout>
          {/* Main Content */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Products</h1>
              <div className="flex space-x-2">
                <button
                  onClick={seedData}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition duration-150 ease-in-out"
                >
                  Seed Initial Data
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
                >
                  Add New Product
                </button>
              </div>
            </div>

            <p className="text-sm dark:text-gray-400">
              Your User ID for this session is: <strong className="font-mono text-xs p-1 rounded bg-gray-200 dark:bg-gray-700">{userId || 'Loading...'}</strong>
            </p>

            <div className="bg-white p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
              {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading products...</p>
              ) : error ? (
                <p style={{ color: 'var(--text-red)' }}>Error: {error}</p>
              ) : productsData.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No products found. Add one!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
                    <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                      <tr>
                        <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Name</th>
                        <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Category</th>
                        <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Subcategory</th>
                        <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Price</th>
                        <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Stock</th>
                        <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                      {productsData.map((product) => (
                        <tr key={product._id}>
                          <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{product.name}</td>
                          <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{product.category ? product.category.name : 'N/A'}</td>
                          <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{product.subcategory ? product.subcategory.name : 'N/A'}</td>
                          <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>Rs {product.price.toLocaleString('en-IN')}</td>
                          <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{product.stock}</td>
                          <td className={tableCellClasses}>
                            <div className="flex items-center space-x-2">
                              <button onClick={() => handleOpenEditModal(product)} className="text-blue-500 hover:text-blue-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.75" />
                                </svg>
                              </button>
                              <button onClick={() => handleOpenDeleteModal(product._id)} className="text-red-500 hover:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.262 9m10.118-3.468a.75.75 0 0 0 0-1.06L18.47 3.22a.75.75 0 0 0-1.06 0l-1.06 1.06M16.5 7.5h-9m9 0H12m-2.25 4.5h3.5m-3.5 0a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5h-15V21a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V7.5Z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>{productsData.length > 0 ? `1 to ${productsData.length} of ${productsData.length}` : '0 to 0 of 0'}</span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }} disabled>Previous</button>
                  <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }} disabled>Next</button>
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Product Modal */}
          <Modal
            isOpen={isModalOpen && (modalType === 'add' || modalType === 'edit')}
            title={modalType === 'add' ? 'Add New Product' : 'Edit Product'}
            onConfirm={handleModalSubmit}
            onCancel={() => setIsModalOpen(false)}
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={modalData.name || ''}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category Name (e.g., Jewellery)"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={modalData.categoryName || ''}
                onChange={(e) => setModalData({ ...modalData, categoryName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Subcategory Name (e.g., Rings)"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={modalData.subcategoryName || ''}
                onChange={(e) => setModalData({ ...modalData, subcategoryName: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={modalData.price || ''}
                onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={modalData.stock || ''}
                onChange={(e) => setModalData({ ...modalData, stock: e.target.value })}
              />
              <textarea
                placeholder="Description (optional)"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={modalData.description || ''}
                onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
              />
            </div>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={isModalOpen && modalType === 'delete'}
            title="Confirm Deletion"
            onConfirm={() => {
              handleDelete(modalData.id);
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
          >
            <p className="dark:text-gray-300">Are you sure you want to delete this product? This action cannot be undone.</p>
          </Modal>

        </DashboardLayout>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
