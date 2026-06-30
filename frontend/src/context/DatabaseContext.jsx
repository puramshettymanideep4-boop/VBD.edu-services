import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const DatabaseContext = createContext(undefined);

const INITIAL_CMS = {
  heroTitle: 'Empowering Schools with Quality Educational Resources',
  heroSubtitle: 'VBD Education Services is the premier unified logistics partner for premium educational assets, bridging schools and parents with world-class support.',
  homepageTitle: 'Empowering Schools with Quality Educational Resources',
  homepageDescription: 'VBD Education Services is the premier unified logistics partner for premium educational assets, bridging schools and parents with world-class support.',
  statsSchools: 10,
  statsStudents: 10000,
  statsProducts: 1200,
  statsOrders: 30000,
  aboutContent: 'VBD Education Services is a comprehensive supply chain and logistics pioneer dedicated to scaling education support systems.',
  missionContent: 'Our mission is to eliminate operational overhead for schools and supply parents with high-quality, authentic, and school-verified assets through a frictionless digital experience.',
  visionContent: "To build the world's most dependable and highly secure digitized educational logistics network, powering millions of learning journeys worldwide.",
  contactContent: 'contact@vbdeducation.com',
  missionText: 'Our mission is to eliminate operational overhead for schools and supply parents with high-quality, authentic, and school-verified assets through a frictionless digital experience.',
  visionText: "To build the world's most dependable and highly secure digitized educational logistics network, powering millions of learning journeys worldwide.",
  testimonials: [
    { id: 't1', name: 'Dr. Sarah Jenkins', role: 'Principal', schoolName: 'Oakridge Academy', content: 'VBD transformed our uniform supply chain completely.' }
  ],
  faqs: [
    { id: 'f1', question: 'How do I access my school portal?', answer: 'Select your school from the homepage Partner Portals section and log in with your registered email address and school code provided by your institution.' },
    { id: 'f2', question: 'What payment methods are accepted?', answer: 'We support UPI, credit/debit cards, net banking, and cash on delivery for all orders placed through the portal.' },
    { id: 'f3', question: 'Can I return or exchange a product?', answer: 'Yes, returns and exchanges are accepted within 7 days of delivery for unused, sealed items in their original packaging. Contact our support team to initiate a return.' },
    { id: 'f4', question: 'How long does delivery take?', answer: 'Standard delivery takes 3–5 business days. Express delivery is available in select cities. You will receive a tracking number once your order is dispatched.' }
  ]
};

const INITIAL_SCHOOLS = [
  { id: 'sch-kakatiya', name: 'Kakatiya School', code: 'KAKATIYA123', logo: 'school', status: 'active', announcement: 'Final exams registration is open. Uniform collection is scheduled for July 1st.' },
  { id: 'sch-abc', name: 'ABC School', code: 'ABC456', logo: 'award', status: 'active', announcement: 'New academic year starts on August 15th. Order your stationery packs early!' },
  { id: 'sch-sunshine', name: 'Sunshine School', code: 'SUNSHINE789', logo: 'sun', status: 'active' },
  { id: 'sch-future', name: 'Future School', code: 'FUTURE101', logo: 'rocket', status: 'active' }
];

const createMockProducts = (schoolId, schoolName) => {
  const shortName = schoolName.split(' ')[0];
  return [
    {
      id: `prod-${schoolId}-books`,
      schoolId,
      name: `${shortName} Grade-wise Book Set`,
      description: `Complete curriculum textbook set for the current grade, approved by the ${schoolName} academic board. Includes all core subjects: Mathematics, Sciences, Social Studies, English, and Languages.`,
      price: 120 + Math.floor(Math.random() * 30),
      category: 'Books',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
      stock: 45,
      status: 'in-stock'
    },
    {
      id: `prod-${schoolId}-bag`,
      schoolId,
      name: `${shortName} Orthopedic School Bag`,
      description: 'Ergonomically designed durable backpack with padded lumbar support, heavy-duty zippers, water-resistant layers, and customized branding.',
      price: 45 + Math.floor(Math.random() * 15),
      category: 'School Bags',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      stock: 12,
      status: 'in-stock'
    },
    {
      id: `prod-${schoolId}-uniform`,
      schoolId,
      name: `Official ${shortName} Uniform Pack`,
      description: 'Premium cotton-blend standard uniform set. Includes 2 formal shirts, 2 pairs of trousers/skirts, 1 blazer, and 1 school tie. Breathable fabric designed for all-day comfort.',
      price: 75 + Math.floor(Math.random() * 20),
      category: 'Uniforms',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
      stock: 30,
      status: 'in-stock'
    },
    {
      id: `prod-${schoolId}-stationery`,
      schoolId,
      name: `Standard Stationery Assortment`,
      description: 'Comprehensive stationary pack featuring high-grade notebooks, sketchpads, ballpoint and gel pens, geometric compass boxes, graphite pencils, and erasers.',
      price: 25 + Math.floor(Math.random() * 10),
      category: 'Stationery',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      stock: 80,
      status: 'in-stock'
    },
    {
      id: `prod-${schoolId}-kit`,
      schoolId,
      name: `Advanced Academic STEM Kit`,
      description: 'Interactive experiment package with electronics micro-breadboard components, chemical test tubes, lens assemblies, and simple robotics modules to support hands-on learning.',
      price: 55 + Math.floor(Math.random() * 15),
      category: 'Educational Kits',
      image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80',
      stock: 5,
      status: 'in-stock'
    },
    {
      id: `prod-${schoolId}-materials`,
      schoolId,
      name: `${shortName} Customized Learning Atlas`,
      description: 'High-definition full-color geography and history resource customized with the school syllabus, featuring regional maps and astronomical indexes.',
      price: 30 + Math.floor(Math.random() * 10),
      category: 'Learning Materials',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
      stock: 18,
      status: 'in-stock'
    }
  ];
};

const INITIAL_PRODUCTS = INITIAL_SCHOOLS.flatMap(school =>
  createMockProducts(school.id, school.name)
);

const normalizeOrder = (o) => {
  if (!o) return null;
  const id = o.id || o._id;
  const rawItems = o.products || o.orderItems || o.items || [];
  const items = rawItems.map(item => ({
    product: item.product || item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    id: item.id || item._id
  }));
  
  const schoolName = o.school?.name || (o.school && typeof o.school === 'object' ? o.school.name : null) || (o.schoolId && typeof o.schoolId === 'object' ? o.schoolId.name : null) || o.schoolName || 'Partner School';
  
  return {
    ...o,
    id,
    _id: id,
    schoolId: o.schoolId && typeof o.schoolId === 'object' ? (o.schoolId.id || o.schoolId._id) : o.schoolId,
    userId: o.userId && typeof o.userId === 'object' ? (o.userId.id || o.userId._id) : o.userId,
    schoolName,
    items,
    products: items,
    trackingNumber: o.trackingNumber || `VBD-${id.toString().substring(0, 6)}`,
    date: o.createdAt || o.date,
    status: (o.orderStatus || o.status || 'PENDING').toLowerCase()
  };
};

export const DatabaseProvider = ({ children }) => {
  const [schools, setSchools] = useState(INITIAL_SCHOOLS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [cmsContent, setCmsContent] = useState(INITIAL_CMS);
  const [notifications, setNotifications] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  const fetchData = async (schoolId) => {
    try {
      setDbLoading(true);

      const token = localStorage.getItem('vbt_token');

      // Resolve school from localStorage if not passed explicitly
      const effectiveSchoolId = schoolId || (() => {
        try { return JSON.parse(localStorage.getItem('vbt_selected_school'))?.id; } catch { return null; }
      })();

      // Products URL — include ?schoolId= when a school is selected
      const productsUrl = effectiveSchoolId
        ? `/products?schoolId=${effectiveSchoolId}`
        : '/products';

      const [schoolsRes, productsRes, cmsRes] = await Promise.all([
        api.get('/schools'),        // always load all schools (needed for code verification)
        api.get(productsUrl),       // scoped to selected school when available
        api.get('/cms')
      ]);

      if (schoolsRes.data.success) {
        setSchools(schoolsRes.data.data.map(s => ({ ...s, id: s._id || s.id })));
      }
      if (productsRes.data.success) {
        setProducts(productsRes.data.data.map(p => ({
          ...p,
          id: p._id || p.id,
          schoolId: p.schoolId,   // plain string UUID
          school: p.school || null,
          status: p.stock > 0 ? 'in-stock' : 'out-of-stock'
        })));
      }
      if (cmsRes.data.success && cmsRes.data.data) {
        setCmsContent({ ...INITIAL_CMS, ...cmsRes.data.data });
      }

      // Protected APIs (only if logged in)
      if (token) {
        try {
          const [ordersRes, notifRes] = await Promise.all([
            api.get('/orders'),
            api.get('/notifications')
          ]);
          if (ordersRes.data.success) {
            setOrders(ordersRes.data.data.map(o => normalizeOrder(o)));
          }
          if (notifRes.data.success) {
            setNotifications(notifRes.data.data.map(n => ({ ...n, id: n._id || n.id, date: n.createdAt })));
          }
        } catch (authErr) {
          console.warn('Could not fetch protected data', authErr);
        }
      }

      const localContacts = localStorage.getItem('vbt_contact_requests');
      if (localContacts) {
        setContactRequests(JSON.parse(localContacts));
      }

    } catch (err) {
      console.error('Failed to fetch data from backend', err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Might need to re-fetch on auth change, but for now we'll rely on manual updates

  const logNotification = async (type, recipient, message) => {
    try {
      const res = await api.post('/notifications', { type, title: 'Alert', message, isRead: false });
      if (res.data.success) {
        const n = res.data.data;
        setNotifications(prev => [{ ...n, id: n._id, date: n.createdAt }, ...prev]);
      }
    } catch (err) {
      console.error('Failed to log notification', err);
    }
  };

  const addSchool = async (schoolData) => {
    try {
      const res = await api.post('/schools', schoolData);
      if (res.data.success) {
        const s = res.data.data;
        setSchools(prev => [...prev, { ...s, id: s._id }]);
        logNotification('system', 'superadmin@vbd.com', `New school added: ${s.name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateSchool = async (id, updated) => {
    try {
      const res = await api.put(`/schools/${id}`, updated);
      if (res.data.success) {
        const s = res.data.data;
        setSchools(prev => prev.map(item => item.id === id ? { ...s, id: s._id } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSchool = async (id) => {
    try {
      await api.delete(`/schools/${id}`);
      setSchools(prev => prev.filter(s => s.id !== id));
      setProducts(prev => prev.filter(p => p.schoolId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const addProduct = async (prodData) => {
    try {
      const res = await api.post('/products', prodData);
      if (res.data.success) {
        const p = res.data.data;
        setProducts(prev => [...prev, { ...p, id: p._id, status: p.stock > 0 ? 'in-stock' : 'out-of-stock' }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async (id, updated) => {
    try {
      const res = await api.put(`/products/${id}`, updated);
      if (res.data.success) {
        const p = res.data.data;
        setProducts(prev => prev.map(item => item.id === id ? { ...p, id: p._id, status: p.stock > 0 ? 'in-stock' : 'out-of-stock' } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const formattedData = {
        schoolId: orderData.schoolId,
        products: orderData.items.map(i => ({ product: i.productId, name: i.name, quantity: i.quantity, price: i.price })),
        totalAmount: orderData.totalAmount,
        shippingAddress: {
          name: orderData.shippingAddress.name,
          email: orderData.shippingAddress.email,
          phone: orderData.shippingAddress.phone,
          addressLine: orderData.shippingAddress.address,
          city: orderData.shippingAddress.city,
          state: 'N/A',
          zipCode: orderData.shippingAddress.zip
        }
      };

      const res = await api.post('/orders', formattedData);
      if (res.data.success) {
        const o = res.data.data;
        const newOrder = normalizeOrder(o);
        setOrders(prev => [newOrder, ...prev]);

        // Refresh products to show updated stock
        fetchData();
        return newOrder;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { orderStatus: status.toUpperCase() });
      if (res.data.success) {
        const o = res.data.data;
        setOrders(prev => prev.map(item => item.id === id ? normalizeOrder(o) : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addContactRequest = (requestData) => {
    const newRequest = { ...requestData, id: `req-${Date.now()}`, date: new Date().toISOString(), status: 'pending' };
    const next = [newRequest, ...contactRequests];
    setContactRequests(next);
    localStorage.setItem('vbt_contact_requests', JSON.stringify(next));
  };

  const updateContactStatus = (id, status) => {
    const next = contactRequests.map(r => r.id === id ? { ...r, status } : r);
    setContactRequests(next);
    localStorage.setItem('vbt_contact_requests', JSON.stringify(next));
  };

  const updateCmsContent = async (updated) => {
    try {
      const res = await api.put('/cms', updated);
      if (res.data.success) {
        setCmsContent({ ...INITIAL_CMS, ...res.data.data });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetDatabase = () => {
    // Calling the seed script is complex from the frontend, but we can do a local reload.
    fetchData();
  };

  return (
    <DatabaseContext.Provider value={{
      schools, products, orders, contactRequests, cmsContent, notifications, dbLoading,
      addSchool, updateSchool, deleteSchool,
      addProduct, updateProduct, deleteProduct,
      createOrder, updateOrderStatus,
      addContactRequest, updateContactStatus,
      updateCmsContent, logNotification, resetDatabase,
      refreshData: fetchData
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
};
