import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  School as SchoolIcon, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  Bell, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  Globe,
  Download,
  Filter
} from 'lucide-react';

/* ── Shared mini-styles ─────────────────────────────────────────────────────── */
const gc = {
  background: 'rgba(19,19,31,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

const TH = ({ children }) => (
  <th style={{
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--text-muted)', fontWeight: 600,
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontSize: '0.78rem', letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  }}>{children}</th>
);

const TD = ({ children, style }) => (
  <td style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem', ...style }}>{children}</td>
);

const StatusBadge = ({ status }) => {
  const map = {
    active:      { bg: 'rgba(74,222,128,0.08)',  color: 'var(--success)', border: 'rgba(74,222,128,0.25)' },
    deactivated: { bg: 'rgba(248,113,113,0.08)', color: 'var(--danger)',  border: 'rgba(248,113,113,0.25)' },
    archived:    { bg: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: 'rgba(255,255,255,0.1)' },
    delivered:   { bg: 'rgba(74,222,128,0.08)',  color: 'var(--success)', border: 'rgba(74,222,128,0.25)' },
    shipped:     { bg: 'rgba(96,165,250,0.08)',  color: 'var(--info)',    border: 'rgba(96,165,250,0.25)' },
    processing:  { bg: 'rgba(200,169,110,0.08)', color: 'var(--accent-primary)', border: 'rgba(200,169,110,0.25)' },
    pending:     { bg: 'rgba(251,191,36,0.08)', color: 'var(--warning)',  border: 'rgba(251,191,36,0.25)' },
    resolved:    { bg: 'rgba(74,222,128,0.08)',  color: 'var(--success)', border: 'rgba(74,222,128,0.25)' },
    'in-progress': { bg: 'rgba(251,191,36,0.08)', color: 'var(--warning)', border: 'rgba(251,191,36,0.25)' },
  };
  const s = map[status?.toLowerCase()] || map.pending;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{status}</span>
  );
};

export const AdminDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const {
    schools, addSchool, updateSchool, deleteSchool,
    products, addProduct, updateProduct, deleteProduct,
    orders, updateOrderStatus,
    contactRequests, updateContactStatus,
    cmsContent, updateCmsContent,
    notifications
  } = useDatabase();

  const [activeTab, setActiveTab] = useState('analytics');

  const [editingSchool, setEditingSchool] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [schoolLogo, setSchoolLogo] = useState('school');
  const [schoolStatus, setSchoolStatus] = useState('active');
  const [schoolAnnouncement, setSchoolAnnouncement] = useState('');

  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodStock, setProdStock] = useState(0);
  const [prodCategory, setProdCategory] = useState('Books');
  const [prodSchoolId, setProdSchoolId] = useState(schools[0]?.id || '');
  const [prodImage, setProdImage] = useState('book-open');

  const [schoolFilter, setSchoolFilter] = useState('All');
  const [orderFilter, setOrderFilter] = useState('All');
  const [crmSearch, setCrmSearch] = useState('');

  const [cmsHeroTitle, setCmsHeroTitle] = useState(cmsContent.heroTitle);
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState(cmsContent.heroSubtitle);
  const [cmsAboutText, setCmsAboutText] = useState(cmsContent.aboutText);
  const [cmsMissionText, setCmsMissionText] = useState(cmsContent.missionText);
  const [cmsVisionText, setCmsVisionText] = useState(cmsContent.visionText);

  const totalRevenue = orders.reduce((acc, o) => o.status === 'delivered' || o.status === 'shipped' ? acc + o.totalAmount : acc, 0);
  const lowStockProducts = products.filter(p => p.stock <= 5);

  if (!user || user.role !== 'VBT_SUPER_ADMIN') {
    return (
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', textAlign: 'center' }}>
        <div style={{ ...gc, padding: '48px', maxWidth: '480px', margin: '0 auto' }}>
          <AlertTriangle size={48} style={{ color: 'var(--warning)', display: 'block', margin: '0 auto 20px' }} />
          <h2 style={{ marginBottom: '12px' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
            Only VBD Super Administrators are permitted to access this management dashboard.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('home')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const handleSaveSchool = (e) => {
    e.preventDefault();
    if (!schoolName || !schoolCode) return;
    if (editingSchool) {
      updateSchool(editingSchool.id, { name: schoolName, code: schoolCode.toUpperCase(), logo: schoolLogo, status: schoolStatus, announcement: schoolAnnouncement });
      setEditingSchool(null);
    } else {
      addSchool({ name: schoolName, code: schoolCode.toUpperCase(), logo: schoolLogo, status: schoolStatus, announcement: schoolAnnouncement });
    }
    setSchoolName(''); setSchoolCode(''); setSchoolLogo('school'); setSchoolStatus('active'); setSchoolAnnouncement('');
  };

  const handleEditSchoolClick = (school) => {
    setEditingSchool(school); setSchoolName(school.name); setSchoolCode(school.code);
    setSchoolLogo(school.logo); setSchoolStatus(school.status); setSchoolAnnouncement(school.announcement || '');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodSchoolId) return;
    if (editingProduct) {
      updateProduct(editingProduct.id, { name: prodName, description: prodDesc, price: prodPrice, stock: prodStock, category: prodCategory, schoolId: prodSchoolId, image: prodImage });
      setEditingProduct(null);
    } else {
      addProduct({ name: prodName, description: prodDesc, price: prodPrice, stock: prodStock, category: prodCategory, schoolId: prodSchoolId, image: prodImage, status: prodStock > 0 ? 'in-stock' : 'out-of-stock' });
    }
    setProdName(''); setProdDesc(''); setProdPrice(0); setProdStock(0); setProdImage('book-open');
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod); setProdName(prod.name); setProdDesc(prod.description);
    setProdPrice(prod.price); setProdStock(prod.stock); setProdCategory(prod.category);
    setProdSchoolId(prod.schoolId); setProdImage(prod.image);
  };

  const handleSaveCms = (e) => {
    e.preventDefault();
    updateCmsContent({ heroTitle: cmsHeroTitle, heroSubtitle: cmsHeroSubtitle, aboutText: cmsAboutText, missionText: cmsMissionText, visionText: cmsVisionText });
    alert('CMS Configuration applied immediately to public website nodes.');
  };

  const handleExportOrders = () => {
    const headers = 'Order ID,School,Recipient,Amount,Status,Date\n';
    const rows = orders.map(o => `${o.id},"${o.schoolName}","${o.shippingAddress.name}",${o.totalAmount},${o.status},${o.date}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `VBD-Orders-Export-${new Date().toLocaleDateString()}.csv`);
    a.click();
  };

  /* ── Sidebar items ── */
  const sidebarItems = [
    { key: 'analytics',     icon: <LayoutDashboard size={16} />, label: 'Analytics' },
    { key: 'schools',       icon: <SchoolIcon size={16} />,      label: 'School Registry' },
    { key: 'products',      icon: <ShoppingBag size={16} />,     label: 'Products & Stock' },
    { key: 'orders',        icon: <FileText size={16} />,        label: 'Orders Desk' },
    { key: 'crm',           icon: <MessageSquare size={16} />,   label: 'CRM Enquiries' },
    { key: 'cms',           icon: <Globe size={16} />,           label: 'Public Website CMS' },
    { key: 'notifications', icon: <Bell size={16} />,            label: 'Notification Trace' },
  ];

  /* ── Shared table wrapper ── */
  const Table = ({ children }) => (
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
        {children}
      </table>
    </div>
  );

  return (
    <div style={{ paddingTop: '100px', minHeight: '85vh' }}>
      <div className="container" style={{ paddingBottom: '80px' }}>

        {/* ── Page Header ── */}
        <div style={{ ...gc, padding: '24px 28px', marginBottom: '24px', borderLeft: '3px solid var(--accent-primary)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '4px' }}>System Administration Console</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            VBD Super Admin Central Control · Authorized Node: <strong style={{ color: 'var(--text-secondary)' }}>VBD-HQ-SYS</strong>
          </p>
        </div>

        {/* ── Low stock alert ── */}
        {lowStockProducts.length > 0 && (
          <div style={{
            background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: '12px', padding: '14px 20px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '12px',
            color: 'var(--warning)', fontSize: '0.85rem',
          }}>
            <AlertTriangle size={18} />
            <span><strong>Low Inventory Alert:</strong> {lowStockProducts.length} catalog items have stock counts below safety limits (≤5 units). Resupply immediately.</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '28px' }} className="admin-layout">

          {/* ── Sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sidebarItems.map(item => {
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                    background: active ? 'rgba(200,169,110,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${active ? 'rgba(200,169,110,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.9rem', fontWeight: active ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* ── Workspace ── */}
          <div>

            {/* ════════════════ ANALYTICS ════════════════ */}
            {activeTab === 'analytics' && (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                {/* KPI cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                  {[
                    { icon: <SchoolIcon size={20} />, color: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', text: 'var(--info)', value: schools.length, label: 'Registered Schools' },
                    { icon: <Users size={20} />, color: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', text: 'var(--success)', value: '12,500+', label: 'Users Impacted' },
                    { icon: <DollarSign size={20} />, color: 'rgba(200,169,110,0.12)', border: 'rgba(200,169,110,0.25)', text: 'var(--accent-primary)', value: `₹${totalRevenue.toLocaleString()}`, label: 'Gross Revenue' },
                    { icon: <FileText size={20} />, color: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)', text: '#A78BFA', value: orders.length, label: 'Orders Processed' },
                  ].map((kpi, i) => (
                    <div key={i} style={{ ...gc, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                        background: kpi.color, border: `1px solid ${kpi.border}`,
                        color: kpi.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{kpi.icon}</div>
                      <div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{kpi.value}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{kpi.label}</span>
                      </div>
                    </div>
                  ))}
                </div>



                {/* School breakdown */}
                <div style={{ ...gc, padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '16px' }}>School-wise Performance Breakdown</h3>
                  <Table>
                    <thead><tr><TH>School Name</TH><TH>Access Code</TH><TH>Status</TH><TH>Assigned Products</TH><TH>Total Orders</TH></tr></thead>
                    <tbody>
                      {schools.map(s => {
                        const schProds = products.filter(p => p.schoolId === s.id).length;
                        const schOrds = orders.filter(o => o.schoolId === s.id).length;
                        return (
                          <tr key={s.id} style={{ transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <TD><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.name}</span></TD>
                            <TD><code style={{ color: 'var(--accent-primary)', fontSize: '0.82rem' }}>{s.code}</code></TD>
                            <TD><StatusBadge status={s.status} /></TD>
                            <TD style={{ color: 'var(--text-secondary)' }}>{schProds} Items</TD>
                            <TD style={{ color: 'var(--text-secondary)' }}>{schOrds} Orders</TD>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* ════════════════ SCHOOLS REGISTRY ════════════════ */}
            {activeTab === 'schools' && (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <div style={{ ...gc, padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '20px' }}>
                    {editingSchool ? 'Edit School Node' : 'Register New Partner School'}
                  </h3>
                  <form onSubmit={handleSaveSchool} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">School Name *</label>
                      <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="e.g. Kakatiya School" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Onboarding Access Code *</label>
                      <input type="text" value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} placeholder="e.g. KAKATIYA123" className="form-control" style={{ textTransform: 'uppercase' }} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Visual Logo Template</label>
                      <select value={schoolLogo} onChange={(e) => setSchoolLogo(e.target.value)} className="form-control">
                        <option value="school">Graduation Cap Logo</option>
                        <option value="award">Gold Ribbon Award</option>
                        <option value="sun">Sunbeam Star Logo</option>
                        <option value="rocket">Technology Rocket</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">System Portal Status</label>
                      <select value={schoolStatus} onChange={(e) => setSchoolStatus(e.target.value)} className="form-control">
                        <option value="active">Active Portal (Allows Onboarding logins)</option>
                        <option value="deactivated">Suspended / Deactivated (Access Firewall block)</option>
                        <option value="archived">Archived (Hide from Selector index)</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Portal Broadcast Announcement</label>
                      <input type="text" value={schoolAnnouncement} onChange={(e) => setSchoolAnnouncement(e.target.value)} placeholder="Broadcast a headline alert to parents within the portal..." className="form-control" />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
                      {editingSchool && (
                        <button type="button" className="btn btn-secondary" onClick={() => { setEditingSchool(null); setSchoolName(''); setSchoolCode(''); }}>Cancel Edit</button>
                      )}
                      <button type="submit" className="btn btn-primary">{editingSchool ? 'Apply Registry Changes' : 'Onboard School Node'}</button>
                    </div>
                  </form>
                </div>

                <div style={{ ...gc, padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Active School Directory</h3>
                  <Table>
                    <thead><tr><TH>School Name</TH><TH>Unique Code</TH><TH>Portal Status</TH><TH>Broadcast Alerts</TH><TH>Actions</TH></tr></thead>
                    <tbody>
                      {schools.map(s => (
                        <tr key={s.id}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <TD><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.name}</span></TD>
                          <TD><code style={{ color: 'var(--accent-primary)' }}>{s.code}</code></TD>
                          <TD><StatusBadge status={s.status} /></TD>
                          <TD style={{ color: 'var(--text-secondary)', maxWidth: '240px' }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {s.announcement || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>None</span>}
                            </span>
                          </TD>
                          <TD>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button className="cart-btn" style={{ padding: '7px' }} onClick={() => handleEditSchoolClick(s)}><Edit size={14} style={{ color: 'var(--accent-primary)' }} /></button>
                              <button className="cart-btn" style={{ padding: '7px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }} onClick={() => { if (window.confirm(`Permanently delete school "${s.name}"? This deletes all associated products!`)) deleteSchool(s.id); }}><Trash2 size={14} style={{ color: 'var(--danger)' }} /></button>
                            </div>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* ════════════════ PRODUCTS & STOCK ════════════════ */}
            {activeTab === 'products' && (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <div style={{ ...gc, padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '20px' }}>
                    {editingProduct ? 'Edit Catalog Item' : 'Add New Product Record'}
                  </h3>
                  <form onSubmit={handleSaveProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <div className="form-group" style={{ gridColumn: '1 / 3' }}>
                      <label className="form-label">Product Name *</label>
                      <input type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="e.g. Kakatiya Formal Uniform Belt" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Target School Portal *</label>
                      <select value={prodSchoolId} onChange={(e) => setProdSchoolId(e.target.value)} className="form-control">
                        {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Description / Specifications</label>
                      <input type="text" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} placeholder="Size guidelines, standard stitching fabrics, or package contents..." className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} className="form-control">
                        <option value="Books">Books</option>
                        <option value="School Bags">School Bags</option>
                        <option value="Uniforms">Uniforms</option>
                        <option value="Stationery">Stationery</option>
                        <option value="Educational Kits">Educational Kits</option>
                        <option value="Other Educational Materials">Other Educational Materials</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pricing (₹) *</label>
                      <input type="number" value={prodPrice || ''} onChange={(e) => setProdPrice(Number(e.target.value))} placeholder="350" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Inventory Stock Count *</label>
                      <input type="number" value={prodStock} onChange={(e) => setProdStock(Number(e.target.value))} placeholder="20" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Product Image URL / Graphic Icon</label>
                      <input
                        type="text"
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        placeholder="e.g. Unsplash URL or book-open"
                        className="form-control"
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '4px' }}>
                      {editingProduct && (
                        <button type="button" className="btn btn-secondary" onClick={() => { setEditingProduct(null); setProdName(''); setProdDesc(''); setProdPrice(0); setProdStock(0); }}>Cancel</button>
                      )}
                      <button type="submit" className="btn btn-primary">{editingProduct ? 'Save Product Changes' : 'Publish Product'}</button>
                    </div>
                  </form>
                </div>

                <div style={{ ...gc, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Catalog Stock Manager</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Show School:</span>
                      <select value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)} className="form-control" style={{ width: '160px', padding: '6px 12px', fontSize: '0.8rem' }}>
                        <option value="All">All Schools</option>
                        {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <Table>
                    <thead><tr><TH>Product Description</TH><TH>Target Portal</TH><TH>Category</TH><TH>Unit Price</TH><TH>Stock Qty</TH><TH>Status</TH><TH>Actions</TH></tr></thead>
                    <tbody>
                      {products.filter(p => schoolFilter === 'All' || p.schoolId === schoolFilter).map(prod => {
                        const targetSchool = schools.find(s => s.id === prod.schoolId);
                        const isLow = prod.stock <= 5 && prod.stock > 0;
                        const isOut = prod.stock === 0;
                        return (
                          <tr key={prod.id}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <TD>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.name}</div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {prod.id}</span>
                            </TD>
                            <TD style={{ color: 'var(--text-secondary)' }}>{targetSchool ? targetSchool.name : 'Unknown'}</TD>
                            <TD style={{ color: 'var(--text-secondary)' }}>{prod.category}</TD>
                            <TD style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>₹{prod.price}</TD>
                            <TD>
                              <input type="number" value={prod.stock} onChange={(e) => updateProduct(prod.id, { stock: Math.max(0, Number(e.target.value)) })} className="form-control" style={{ width: '70px', padding: '6px 8px', fontSize: '0.82rem', textAlign: 'center' }} />
                            </TD>
                            <TD>
                              {isOut ? <StatusBadge status="deactivated" /> : isLow ? (
                                <span style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.78rem' }}>LOW ({prod.stock})</span>
                              ) : (
                                <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.78rem' }}>IN STOCK</span>
                              )}
                            </TD>
                            <TD>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.72rem' }} onClick={() => updateProduct(prod.id, { stock: prod.stock > 0 ? 0 : 25 })}>
                                  {prod.stock > 0 ? 'Mark Out' : 'Restock'}
                                </button>
                                <button className="cart-btn" style={{ padding: '7px' }} onClick={() => handleEditProductClick(prod)}><Edit size={13} style={{ color: 'var(--accent-primary)' }} /></button>
                                <button className="cart-btn" style={{ padding: '7px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }} onClick={() => deleteProduct(prod.id)}><Trash2 size={13} style={{ color: 'var(--danger)' }} /></button>
                              </div>
                            </TD>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* ════════════════ ORDERS DESK ════════════════ */}
            {activeTab === 'orders' && (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <div style={{ ...gc, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>System Order Registry</h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary" style={{ padding: '7px 16px', fontSize: '0.8rem' }} onClick={handleExportOrders}>
                        <Download size={13} /> Export CSV
                      </button>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filter Portal:</span>
                      <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)} className="form-control" style={{ width: '160px', padding: '6px 12px', fontSize: '0.8rem' }}>
                        <option value="All">All Portals</option>
                        {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <Table>
                    <thead><tr><TH>Order ID</TH><TH>Origin School</TH><TH>Customer</TH><TH>Items Ordered</TH><TH>Total Amount</TH><TH>Status</TH><TH>Dispatch Control</TH></tr></thead>
                    <tbody>
                      {orders.filter(o => orderFilter === 'All' || o.schoolId === orderFilter).map(ord => (
                        <tr key={ord.id}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <TD>
                            <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{ord.id}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Track: {ord.trackingNumber}</span>
                          </TD>
                          <TD style={{ color: 'var(--text-secondary)' }}>{ord.schoolName}</TD>
                          <TD>
                            <div style={{ color: 'var(--text-primary)' }}>{ord.shippingAddress.name}</div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ord.shippingAddress.email}</span>
                          </TD>
                          <TD>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {ord.items.map((item, idx) => (
                                <div key={idx}>· {item.name} (x{item.quantity})</div>
                              ))}
                            </div>
                          </TD>
                          <TD><span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>₹{ord.totalAmount}</span></TD>
                          <TD><StatusBadge status={ord.status} /></TD>
                          <TD>
                            <select value={ord.status} onChange={(e) => updateOrderStatus(ord.id, e.target.value)} className="form-control" style={{ width: '120px', padding: '6px 8px', fontSize: '0.78rem' }}>
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* ════════════════ CRM ENQUIRIES ════════════════ */}
            {activeTab === 'crm' && (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <div style={{ ...gc, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>CRM Contact Requests</h3>
                    <div style={{ width: '220px' }}>
                      <input type="text" placeholder="Search requests..." value={crmSearch} onChange={(e) => setCrmSearch(e.target.value)} className="form-control" style={{ padding: '8px 14px', fontSize: '0.82rem' }} />
                    </div>
                  </div>
                  <Table>
                    <thead><tr><TH>Date Received</TH><TH>Sender Details</TH><TH>Enquiry Details</TH><TH>Resolution Status</TH><TH>Action Change</TH></tr></thead>
                    <tbody>
                      {contactRequests.filter(r => r.name.toLowerCase().includes(crmSearch.toLowerCase()) || r.message.toLowerCase().includes(crmSearch.toLowerCase())).map(req => (
                        <tr key={req.id}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <TD style={{ color: 'var(--text-secondary)' }}>{new Date(req.date).toLocaleDateString()}</TD>
                          <TD>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.name}</div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{req.schoolName}</span><br />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{req.email} | {req.phone}</span>
                          </TD>
                          <TD style={{ color: 'var(--text-secondary)', maxWidth: '320px', fontSize: '0.8rem', lineHeight: 1.5 }}>{req.message}</TD>
                          <TD><StatusBadge status={req.status} /></TD>
                          <TD>
                            <select value={req.status} onChange={(e) => updateContactStatus(req.id, e.target.value)} className="form-control" style={{ width: '120px', padding: '6px 8px', fontSize: '0.78rem' }}>
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* ════════════════ CMS ════════════════ */}
            {activeTab === 'cms' && (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <form onSubmit={handleSaveCms} style={{ ...gc, padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '20px' }}>Website Content Management (CMS)</h3>
                  <div className="form-group">
                    <label className="form-label">Hero Title Banner Headline</label>
                    <input type="text" value={cmsHeroTitle} onChange={(e) => setCmsHeroTitle(e.target.value)} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hero Subtitle Text Description</label>
                    <textarea value={cmsHeroSubtitle} onChange={(e) => setCmsHeroSubtitle(e.target.value)} className="form-control" rows={2} required style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Profile (About Us Block)</label>
                    <textarea value={cmsAboutText} onChange={(e) => setCmsAboutText(e.target.value)} className="form-control" rows={4} required style={{ resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Mission Declaration</label>
                      <textarea value={cmsMissionText} onChange={(e) => setCmsMissionText(e.target.value)} className="form-control" rows={3} required style={{ resize: 'vertical' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vision Declaration</label>
                      <textarea value={cmsVisionText} onChange={(e) => setCmsVisionText(e.target.value)} className="form-control" rows={3} required style={{ resize: 'vertical' }} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>Save and Publish CMS Nodes</button>
                </form>
              </div>
            )}

            {/* ════════════════ NOTIFICATION TRACE ════════════════ */}
            {activeTab === 'notifications' && (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <div style={{ ...gc, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>System Notification Trace Logs</h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Real-time Mail/SMS/WhatsApp output</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                    {notifications.map((notif) => {
                      const typeColor = notif.type === 'email' ? 'var(--info)' : notif.type === 'sms' ? 'var(--warning)' : '#34D399';
                      const borderColor = notif.type === 'email' ? 'var(--accent-primary)' : notif.type === 'sms' ? 'var(--warning)' : '#25D366';
                      return (
                        <div key={notif.id} style={{
                          background: 'rgba(0,0,0,0.15)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderLeft: `3px solid ${borderColor}`,
                          borderRadius: '10px', padding: '14px 16px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.72rem' }}>
                            <span style={{ fontWeight: 700, textTransform: 'uppercase', color: typeColor }}>
                              [{notif.type}] To: {notif.recipient}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>{new Date(notif.date).toLocaleTimeString()}</span>
                          </div>
                          <p style={{ fontSize: '0.87rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>{notif.message}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
