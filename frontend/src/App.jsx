import React, { useState, useEffect, useCallback, Component } from 'react';
import { DatabaseProvider } from './context/DatabaseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Homepage from './pages/Homepage';
import AuthPage from './pages/AuthPage';
import SchoolPortal from './pages/SchoolPortal';
import AdminDashboard from './pages/AdminDashboard';

// ErrorBoundary: catches silent JS errors in child components and shows the message
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('🔴 AdminDashboard crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '100px 40px', textAlign: 'center', color: 'var(--danger)' }}>
          <h2>⚠️ Dashboard Error</h2>
          <pre style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', textAlign: 'left', background: 'rgba(255,0,0,0.05)', padding: 16, borderRadius: 8 }}>
            {this.state.error?.message}
          </pre>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => this.setState({ hasError: false, error: null })}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Guard component: redirects unauthenticated users to the auth page
const ProtectedPortalRoute = ({ onNavigate, children }) => {
  const { isAuthenticated, currentSchoolPortal } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('auth');
    }
  }, [isAuthenticated, onNavigate]);

  // Render nothing while redirecting to avoid a flash of portal content
  if (!isAuthenticated) return null;

  return children;
};

const MainAppContent = () => {
  const { currentSchoolPortal, user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Load cart on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('vbt_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data', e);
      }
    }
  }, []);

  // Save cart to local storage
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('vbt_cart', JSON.stringify(newCart));
  };

  // Clear cart on school portal changes to prevent catalog contamination
  useEffect(() => {
    if (currentSchoolPortal) {
      const isMismatched = cart.some(item => item.product.schoolId !== currentSchoolPortal.id);
      if (isMismatched) {
        saveCart([]);
      }
    } else {
      saveCart([]);
    }
  }, [currentSchoolPortal]);

  const handleAddToCart = (product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      const updated = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const updated = cart.filter(item => item.product.id !== productId);
    saveCart(updated);
  };

  const handleUpdateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const updated = cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    );
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  if (!loadingComplete) {
    return <LoadingScreen onComplete={() => setLoadingComplete(true)} />;
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ── Persistent Background Layers ── */}
      <div className="bg-grid" />
      <div className="bg-radial" />

      <Navbar
        onNavigate={handleNavigate}
        currentPage={currentPage}
        cartCount={cartCount}
      />

      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <Homepage onNavigate={handleNavigate} />
        )}

        {currentPage === 'auth' && (
          <AuthPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'school-portal' && (
          <ProtectedPortalRoute onNavigate={handleNavigate}>
            <SchoolPortal
              onNavigate={handleNavigate}
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              onClearCart={handleClearCart}
              activeTabOverride="products"
            />
          </ProtectedPortalRoute>
        )}

        {currentPage === 'cart' && (
          <ProtectedPortalRoute onNavigate={handleNavigate}>
            <SchoolPortal
              onNavigate={handleNavigate}
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              onClearCart={handleClearCart}
              activeTabOverride="cart"
            />
          </ProtectedPortalRoute>
        )}

        {currentPage === 'orders' && (
          <ProtectedPortalRoute onNavigate={handleNavigate}>
            <SchoolPortal
              onNavigate={handleNavigate}
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              onClearCart={handleClearCart}
              activeTabOverride="orders"
            />
          </ProtectedPortalRoute>
        )}

        {currentPage === 'admin-dashboard' && (
          user?.role === 'VBT_SUPER_ADMIN'
            ? (
              <ErrorBoundary>
                <AdminDashboard onNavigate={handleNavigate} />
              </ErrorBoundary>
            )
            : <Homepage onNavigate={handleNavigate} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export const App = () => {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </DatabaseProvider>
  );
};

export default App;
