import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  CreditCard,
  CheckCircle2, 
  FileText, 
  Truck, 
  Package, 
  Clock, 
  AlertCircle,
  Download,
  Printer,
  BookOpen,
  Backpack,
  Shirt,
  PenTool,
  FlaskConical,
  Compass,
  X,
  Plus,
  Minus,
} from 'lucide-react';

/* ── Shared styles ─────────────────────────────────────────────────────────── */
const glassCard = {
  background: 'rgba(19,19,31,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

const getCategoryIcon = (category, size = 40) => {
  const s = { color: 'var(--accent-primary)' };
  switch (category) {
    case 'Books':                     return <BookOpen size={size} style={s} />;
    case 'School Bags':               return <Backpack size={size} style={s} />;
    case 'Uniforms':                  return <Shirt size={size} style={s} />;
    case 'Stationery':                return <PenTool size={size} style={s} />;
    case 'Educational Kits':          return <FlaskConical size={size} style={s} />;
    case 'Other Educational Materials': return <Compass size={size} style={s} />;
    default:                          return <BookOpen size={size} style={s} />;
  }
};

export const SchoolPortal = ({
  onNavigate,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onClearCart,
  activeTabOverride = 'products'
}) => {
  const { user, currentSchoolPortal } = useAuth();
  const { products, orders, createOrder } = useDatabase();

  const [activeTab, setActiveTab] = useState(activeTabOverride);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [shippingDetails, setShippingDetails] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '' });
  const [placedOrder, setPlacedOrder] = useState(null);
  
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set()); // track "just added" animation

  useEffect(() => {
    if (!user) onNavigate('auth');
  }, [user, onNavigate]);

  if (!user) return null;

  /* ── Error States ── */
  const ErrorScreen = ({ icon, title, message }) => (
    <div style={{ padding: '100px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...glassCard, textAlign: 'center', padding: '48px 40px', maxWidth: '500px', width: '100%' }}>
        <div style={{ color: 'var(--danger)', marginBottom: '20px' }}>{icon}</div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.95rem' }}>{message}</p>
        <button className="btn btn-primary" onClick={() => onNavigate('home')}>Return to Homepage</button>
      </div>
    </div>
  );

  if (!currentSchoolPortal) return <ErrorScreen icon={<AlertCircle size={52} />} title="Unauthorized Access" message="No active school portal session detected. Please log in through a partner school portal link." />;
  if (currentSchoolPortal.status === 'deactivated') return <ErrorScreen icon={<AlertCircle size={52} />} title="Portal Suspended" message={`The portal for ${currentSchoolPortal.name} is currently deactivated. Please contact your school administration.`} />;

  const userSchoolMismatched = user && user.role !== 'VBT_SUPER_ADMIN' && user.schoolId !== currentSchoolPortal.id;
  if (userSchoolMismatched) return <ErrorScreen icon={<AlertCircle size={52} />} title="Security Violation" message={`Your account (${user.email}) does not have credentials to access the ${currentSchoolPortal.name} portal.`} />;

  const schoolProducts = products.filter(p => {
    const matchSchool = p.schoolId === currentSchoolPortal.id;
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSchool && matchCategory && matchSearch;
  });

  const categories = ['All', 'Books', 'School Bags', 'Uniforms', 'Stationery', 'Educational Kits', 'Other Educational Materials'];

  const schoolOrders = orders.filter(o => {
    const matchSchool = o.schoolId === currentSchoolPortal.id;
    if (user && (user.role === 'PARENT' || user.role === 'STUDENT')) return matchSchool && o.userId === user.id;
    return matchSchool;
  });

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!shippingDetails.name || !shippingDetails.email || !shippingDetails.address) return;
    const newOrder = createOrder({
      schoolId: currentSchoolPortal.id, schoolName: currentSchoolPortal.name,
      userId: user?.id || 'guest', userName: shippingDetails.name,
      items: cart.map(item => ({ productId: item.product.id, name: item.product.name, price: item.product.price, quantity: item.quantity, image: item.product.image })),
      totalAmount: cartTotal,
      shippingAddress: { name: shippingDetails.name, email: shippingDetails.email, phone: shippingDetails.phone || 'N/A', address: shippingDetails.address, city: shippingDetails.city || 'N/A', zip: shippingDetails.zip || 'N/A' }
    });
    setPlacedOrder(newOrder); onClearCart(); setCheckoutStep('success');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':    return <Clock size={14} style={{ color: 'var(--warning)' }} />;
      case 'processing': return <Package size={14} style={{ color: 'var(--info)' }} />;
      case 'shipped':    return <Truck size={14} style={{ color: 'var(--info)' }} />;
      case 'delivered':  return <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />;
      default:           return <Clock size={14} />;
    }
  };

  const statusColor = (status) => {
    if (status === 'delivered') return { bg: 'rgba(74,222,128,0.1)', color: 'var(--success)', border: 'rgba(74,222,128,0.25)' };
    if (status === 'shipped') return { bg: 'rgba(96,165,250,0.1)', color: 'var(--info)', border: 'rgba(96,165,250,0.25)' };
    if (status === 'processing') return { bg: 'rgba(200,169,110,0.1)', color: 'var(--accent-primary)', border: 'rgba(200,169,110,0.25)' };
    return { bg: 'rgba(251,191,36,0.1)', color: 'var(--warning)', border: 'rgba(251,191,36,0.25)' };
  };

  // Tab button style
  const TabBtn = ({ tab, label, icon }) => (
    <button
      onClick={() => { setActiveTab(tab); if (tab !== 'cart') setCheckoutStep('cart'); if (tab === 'orders') setActiveInvoiceOrder(null); }}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '9px 20px', borderRadius: '8px',
        background: activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
        color: activeTab === tab ? '#0A0A0F' : 'var(--text-secondary)',
        fontSize: '0.87rem', fontWeight: 600, cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div style={{ paddingTop: '100px', minHeight: '85vh' }}>
      <div className="container" style={{ paddingBottom: '80px' }}>
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .invoice-print-wrapper, .invoice-print-wrapper * { visibility: visible; }
            .invoice-print-wrapper { position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; padding: 30px; }
            .no-print { display: none !important; }
          }
        `}</style>

        {/* ── Portal Header ── */}
        <div style={{
          ...glassCard,
          padding: '28px 32px',
          marginBottom: '24px',
          display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '20px',
          borderLeft: '3px solid var(--accent-primary)',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {currentSchoolPortal.name} <span style={{ color: 'var(--accent-primary)', fontWeight: 400 }}>Portal</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Isolated parent e-commerce catalog · Account: <strong style={{ color: 'var(--text-secondary)' }}>{user?.email || 'Guest Session'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <TabBtn tab="products" label="Products" />
            <TabBtn tab="cart" label={`Cart (${cart.length})`} icon={<ShoppingCart size={14} />} />
            <TabBtn tab="orders" label={`My Orders (${schoolOrders.length})`} />
          </div>
        </div>

        {/* ── Announcement ── */}
        {currentSchoolPortal.announcement && (
          <div style={{
            ...glassCard,
            padding: '14px 20px', marginBottom: '20px',
            borderLeft: '3px solid rgba(200,169,110,0.6)',
            background: 'rgba(200,169,110,0.04)',
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              School Announcement
            </span>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', margin: 0 }}>{currentSchoolPortal.announcement}</p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PRODUCTS TAB
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <>
            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text" placeholder="Search portal products…" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Filter size={14} /> Filters:
              </div>
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '7px 18px', borderRadius: '30px', whiteSpace: 'nowrap',
                    background: selectedCategory === cat ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedCategory === cat ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
                    color: selectedCategory === cat ? '#0A0A0F' : 'var(--text-secondary)',
                    fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product grid */}
            {schoolProducts.length === 0 ? (
              <div style={{ ...glassCard, textAlign: 'center', padding: '64px 40px' }}>
                <p style={{ color: 'var(--text-muted)' }}>No items found matching details in this isolated school node.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
                {schoolProducts.map((prod) => {
                  const cartQty = cart.find(item => item.product.id === prod.id)?.quantity || 0;
                  const isLow  = prod.stock > 0 && prod.stock <= 5;
                  const isOut  = prod.stock === 0 || prod.status === 'out-of-stock';
                  const justAdded = addedIds.has(prod.id);

                  return (
                    <div
                      key={prod.id}
                      style={{
                        ...glassCard,
                        display: 'flex', flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(200,169,110,0.2)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.5), 0 4px 16px rgba(200,169,110,0.1)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                      }}
                    >
                      {/* Product image area */}
                      <div style={{
                        height: '160px', background: 'rgba(0,0,0,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}>
                        {getCategoryIcon(prod.category, 44)}

                        {/* Category badge */}
                        <span style={{
                          position: 'absolute', top: '10px', left: '10px',
                          fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.5px',
                          background: 'rgba(200,169,110,0.12)', border: '1px solid rgba(200,169,110,0.25)',
                          color: 'var(--accent-primary)', padding: '3px 10px', borderRadius: '20px',
                        }}>
                          {prod.category}
                        </span>

                        {/* Stock badge */}
                        <span style={{
                          position: 'absolute', top: '10px', right: '10px',
                          fontSize: '0.67rem', fontWeight: 700,
                          background: isOut ? 'rgba(248,113,113,0.12)' : isLow ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.12)',
                          border: `1px solid ${isOut ? 'rgba(248,113,113,0.25)' : isLow ? 'rgba(251,191,36,0.25)' : 'rgba(74,222,128,0.25)'}`,
                          color: isOut ? 'var(--danger)' : isLow ? 'var(--warning)' : 'var(--success)',
                          padding: '3px 10px', borderRadius: '20px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}>
                          <span style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: isOut ? 'var(--danger)' : isLow ? 'var(--warning)' : 'var(--success)',
                          }} />
                          {isOut ? 'Out of Stock' : isLow ? `${prod.stock} Left` : 'In Stock'}
                        </span>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
                          {prod.name}
                        </h4>
                        <p style={{
                          color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.55,
                          marginBottom: '16px', flex: 1,
                          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {prod.description}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                            ₹{prod.price}
                          </span>

                          {isOut ? (
                            <button style={{
                              padding: '7px 16px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                              background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', cursor: 'not-allowed',
                            }} disabled>
                              Unavailable
                            </button>
                          ) : cartQty > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <button
                                onClick={() => onUpdateCartQuantity(prod.id, cartQty - 1)}
                                style={{
                                  width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', cursor: 'pointer',
                                }}
                              >
                                <Minus size={13} />
                              </button>
                              <span style={{ color: 'var(--text-primary)', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{cartQty}</span>
                              <button
                                onClick={() => onUpdateCartQuantity(prod.id, cartQty + 1)}
                                disabled={cartQty >= prod.stock}
                                style={{
                                  width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)', color: 'var(--accent-primary)', cursor: 'pointer',
                                }}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '8px 18px', fontSize: '0.8rem' }}
                              onClick={() => {
                                onAddToCart(prod);
                                setAddedIds(prev => new Set([...prev, prod.id]));
                                setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(prod.id); return s; }), 1500);
                              }}
                            >
                              {justAdded ? <><CheckCircle2 size={14} /> Added!</> : 'Add to Cart'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            CART TAB
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'cart' && (
          <>
            {checkoutStep === 'cart' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
                {/* Cart items */}
                <div style={{ ...glassCard, padding: '28px' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '24px', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                    Shopping Cart
                  </h3>

                  {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                      <ShoppingCart size={48} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
                      <p style={{ color: 'var(--text-muted)' }}>Your shopping cart is empty.</p>
                      <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setActiveTab('products')}>
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {cart.map((item) => (
                        <div key={item.product.id} style={{
                          display: 'flex', alignItems: 'center', gap: '16px',
                          paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>
                          {/* Icon */}
                          <div style={{
                            width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                            background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {getCategoryIcon(item.product.category, 22)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-body)', marginBottom: '2px' }}>{item.product.name}</h4>
                            <span style={{ color: 'var(--accent-primary)', fontSize: '0.82rem' }}>₹{item.product.price} each</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={() => onUpdateCartQuantity(item.product.id, item.quantity - 1)} style={{
                              width: '26px', height: '26px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', cursor: 'pointer',
                            }}><Minus size={12} /></button>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => onUpdateCartQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} style={{
                              width: '26px', height: '26px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: 'var(--accent-primary)', cursor: 'pointer',
                            }}><Plus size={12} /></button>
                          </div>
                          <button onClick={() => onRemoveFromCart(item.product.id)} style={{
                            background: 'transparent', color: 'var(--danger)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: 'none', padding: '4px',
                          }}>
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                {cart.length > 0 && (
                  <div style={{ ...glassCard, padding: '28px' }}>
                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, fontFamily: 'var(--font-body)', marginBottom: '20px' }}>Order Summary</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                        <span>Subtotal</span><span>₹{cartTotal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                        <span>Delivery Shipping</span><span style={{ color: 'var(--success)' }}>FREE</span>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                        <span style={{ color: 'var(--text-primary)' }}>Grand Total</span>
                        <span style={{ color: 'var(--accent-primary)' }}>₹{cartTotal}</span>
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%', padding: '13px', justifyContent: 'center', marginTop: '8px' }} onClick={() => setCheckoutStep('shipping')}>
                        <CreditCard size={16} /> Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {checkoutStep === 'shipping' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
                <form onSubmit={handleCheckoutSubmit} style={{ ...glassCard, padding: '32px' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '24px', fontFamily: 'var(--font-body)' }}>Delivery Address</h3>
                  <div className="form-group">
                    <label className="form-label">Recipient Full Name *</label>
                    <input type="text" value={shippingDetails.name} onChange={(e) => setShippingDetails(p => ({ ...p, name: e.target.value }))} className="form-control" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input type="email" value={shippingDetails.email} onChange={(e) => setShippingDetails(p => ({ ...p, email: e.target.value }))} className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input type="tel" value={shippingDetails.phone} onChange={(e) => setShippingDetails(p => ({ ...p, phone: e.target.value }))} placeholder="+91 99999 88888" className="form-control" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shipping Street Address *</label>
                    <input type="text" value={shippingDetails.address} onChange={(e) => setShippingDetails(p => ({ ...p, address: e.target.value }))} placeholder="Apartment, building, street detail" className="form-control" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input type="text" value={shippingDetails.city} onChange={(e) => setShippingDetails(p => ({ ...p, city: e.target.value }))} className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Zip Code *</label>
                      <input type="text" value={shippingDetails.zip} onChange={(e) => setShippingDetails(p => ({ ...p, zip: e.target.value }))} className="form-control" required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setCheckoutStep('cart')}>Back</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                      Simulate Payment & Order (₹{cartTotal})
                    </button>
                  </div>
                </form>

                <div style={{ ...glassCard, padding: '28px' }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '20px', fontFamily: 'var(--font-body)' }}>Checkout Summary</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {cart.map(item => (
                      <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.product.name} (x{item.quantity})</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span style={{ color: 'var(--text-primary)' }}>Total Amount</span>
                      <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>₹{cartTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && placedOrder && (
              <div style={{ ...glassCard, textAlign: 'center', padding: '64px 40px', maxWidth: '560px', margin: '0 auto' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 24px',
                  background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(74,222,128,0.15)',
                }}>
                  <CheckCircle2 size={44} style={{ color: 'var(--success)' }} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 400, marginBottom: '12px' }}>Order Placed Successfully</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '28px' }}>
                  Your order ID is <strong style={{ color: 'var(--text-primary)' }}>{placedOrder.id}</strong>. Tracking code: <strong style={{ color: 'var(--text-primary)' }}>{placedOrder.trackingNumber}</strong>.<br />
                  Notifications dispatched to your email and SMS.
                </p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => { setActiveTab('products'); setCheckoutStep('cart'); }}>Continue Shopping</button>
                  <button className="btn btn-primary" onClick={() => { setActiveTab('orders'); setActiveInvoiceOrder(placedOrder); }}>View Invoice</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            ORDERS TAB
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div>
            {activeInvoiceOrder ? (
              /* ── Invoice View ── */
              <div className="invoice-print-wrapper" style={{ ...glassCard, padding: '36px', position: 'relative' }}>
                <button className="btn btn-secondary no-print" style={{ position: 'absolute', top: '20px', right: '20px' }} onClick={() => setActiveInvoiceOrder(null)}>
                  Back to Orders
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '2px', margin: 0 }}>INVOICE</h2>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>ORDER REF: <span style={{ color: 'var(--text-primary)' }}>{activeInvoiceOrder.id}</span></span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ color: 'var(--accent-primary)', margin: '0 0 4px' }}>VBD Education</h3>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Date: <span style={{ color: 'var(--text-primary)' }}>{new Date(activeInvoiceOrder.date).toLocaleDateString()}</span></span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '32px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Ship To:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{activeInvoiceOrder.shippingAddress.name}</strong>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', marginTop: '6px', lineHeight: 1.6 }}>
                      {activeInvoiceOrder.shippingAddress.address}<br />
                      {activeInvoiceOrder.shippingAddress.city}, {activeInvoiceOrder.shippingAddress.zip}<br />
                      Phone: {activeInvoiceOrder.shippingAddress.phone}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Portal Origin:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{activeInvoiceOrder.schoolName}</strong>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', marginTop: '6px', lineHeight: 1.6 }}>
                      Verified Institution Partner Portal<br />
                      Tracking: <strong style={{ color: 'var(--text-primary)' }}>{activeInvoiceOrder.trackingNumber}</strong><br />
                      Status: <span style={{ color: 'var(--accent-primary)', textTransform: 'uppercase' }}>{activeInvoiceOrder.status}</span>
                    </p>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Description', 'Price', 'Qty', 'Amount'].map((h, i) => (
                        <th key={h} style={{ padding: '12px', textAlign: i === 3 ? 'right' : i === 1 || i === 2 ? 'center' : 'left', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeInvoiceOrder.items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '13px 12px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.name}</td>
                        <td style={{ padding: '13px 12px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>₹{item.price}</td>
                        <td style={{ padding: '13px 12px', textAlign: 'center', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.quantity}</td>
                        <td style={{ padding: '13px 12px', textAlign: 'right', color: 'var(--text-primary)', fontSize: '0.9rem' }}>₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span>Subtotal</span><span style={{ color: 'var(--text-primary)' }}>₹{activeInvoiceOrder.totalAmount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span>Shipping fee</span><span style={{ color: 'var(--success)' }}>₹0.00</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '2px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span style={{ color: 'var(--text-primary)' }}>Total Paid</span>
                      <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>₹{activeInvoiceOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="no-print" style={{ display: 'flex', gap: '12px', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
                  <button className="btn btn-primary" onClick={() => window.print()}><Printer size={15} /> Print Invoice</button>
                  <button className="btn btn-secondary" onClick={() => window.print()}><Download size={15} /> Download PDF</button>
                </div>
              </div>
            ) : (
              /* ── Orders List ── */
              <>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '20px', fontFamily: 'var(--font-body)' }}>Order History</h3>
                {schoolOrders.length === 0 ? (
                  <div style={{ ...glassCard, textAlign: 'center', padding: '48px 40px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No order history associated with this profile.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {schoolOrders.map((ord) => {
                      const sc = statusColor(ord.status);
                      const statuses = ['pending', 'processing', 'shipped', 'delivered'];
                      const currentIdx = statuses.indexOf(ord.status);
                      return (
                        <div key={ord.id} style={{ ...glassCard, padding: '28px' }}>
                          {/* Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ref: <span style={{ color: 'var(--text-primary)' }}>{ord.id}</span></span>
                              <h4 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, fontFamily: 'var(--font-body)', margin: '4px 0 0' }}>
                                Total Amount: <span style={{ color: 'var(--accent-primary)' }}>₹{ord.totalAmount}</span>
                              </h4>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Placed: <span style={{ color: 'var(--text-primary)' }}>{new Date(ord.date).toLocaleDateString()}</span>
                              </span>
                              <span style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                                background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                              }}>
                                {getStatusIcon(ord.status)}{ord.status}
                              </span>
                            </div>
                          </div>

                          {/* Items */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                            {ord.items.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{item.name} (x{item.quantity})</span>
                                <span style={{ color: 'var(--text-primary)' }}>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {/* Tracking timeline */}
                          <div style={{ marginBottom: '20px' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '16px' }}>
                              Real-time Delivery Tracking:
                            </span>
                            <div style={{ display: 'flex', position: 'relative' }}>
                              {/* Track line */}
                              <div style={{
                                position: 'absolute', top: '16px', left: '10%', width: '80%', height: '2px',
                                background: 'rgba(255,255,255,0.06)', zIndex: 0,
                              }} />
                              <div style={{
                                position: 'absolute', top: '16px', left: '10%',
                                width: `${(currentIdx / 3) * 80}%`, height: '2px',
                                background: 'linear-gradient(90deg, var(--accent-primary), rgba(200,169,110,0.4))', zIndex: 1,
                                transition: 'width 0.5s ease',
                              }} />

                              {statuses.map((st, i) => {
                                const done = i <= currentIdx;
                                const active = i === currentIdx;
                                return (
                                  <div key={st} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                                    <div style={{
                                      width: '32px', height: '32px', borderRadius: '50%',
                                      background: done ? 'rgba(200,169,110,0.15)' : 'rgba(255,255,255,0.04)',
                                      border: `2px solid ${done ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      color: done ? 'var(--accent-primary)' : 'var(--text-muted)',
                                      boxShadow: active ? '0 0 12px rgba(200,169,110,0.3)' : 'none',
                                    }}>
                                      {i === 0 && <Clock size={13} />}
                                      {i === 1 && <Package size={13} />}
                                      {i === 2 && <Truck size={13} />}
                                      {i === 3 && <CheckCircle2 size={13} />}
                                    </div>
                                    <span style={{ fontSize: '0.68rem', color: done ? 'var(--text-secondary)' : 'var(--text-muted)', marginTop: '6px', textTransform: 'capitalize', fontWeight: done ? 600 : 400 }}>
                                      {st === 'processing' ? 'Packing' : st}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              Tracking: <strong style={{ color: 'var(--text-primary)' }}>{ord.trackingNumber}</strong>
                            </span>
                            <button className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.82rem' }} onClick={() => setActiveInvoiceOrder(ord)}>
                              <FileText size={13} /> Invoice Receipt
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolPortal;
