import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Send, CheckCircle, MessageSquare, PhoneCall } from 'lucide-react';

const ContactForm = ({ onReturnHome }) => {
  const { addContactRequest } = useDatabase();
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);

    setTimeout(() => {
      addContactRequest({
        name: formData.name,
        schoolName: formData.schoolName || 'Not Specified',
        email: formData.email,
        phone: formData.phone || 'Not Specified',
        message: formData.message
      });

      setSubmitting(false);
      setShowPopup(true);

      setFormData({ name: '', schoolName: '', phone: '', email: '', message: '' });
    }, 800);
  };

  const handleWhatsAppRedirect = () => {
    const number = "919000143404";

    const text = encodeURIComponent("Hello VBD, I would like to enquire about your Multi-School Educational Services.");
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div className="relative">
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalZoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes bounceCheck { from { transform: scale(1); } to { transform: scale(1.1) translateY(-5px); } }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-[30px] md:gap-[40px]">
        <div className="glass-card p-[30px] flex flex-col gap-6">
          <div className="mb-2.5">
            <h3 className="text-[1.5rem] text-white mb-1.5">Get In Touch</h3>
            <p className="text-[#94A3B8] text-[0.9rem]">Connect with our administrative desk for custom procurement SLA setups.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-[14px]">
              <div className="w-[44px] h-[44px] rounded-full bg-[rgba(0,82,204,0.1)] border border-[rgba(0,82,204,0.2)] flex items-center justify-center text-primary"><PhoneCall size={18} /></div>
              <div>
                <p className="text-[0.75rem] text-[#64748B]">CALL SUPPORT</p>
                <p className="font-semibold text-white text-[0.9rem]">+91 (800) 234-5678</p>
              </div>
            </div>

            <div className="flex items-center gap-[14px]">
              <div className="w-[44px] h-[44px] rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(0,82,204,0.2)] flex items-center justify-center text-gold"><Send size={18} /></div>
              <div>
                <p className="text-[0.75rem] text-[#64748B]">EMAIL DIRECTORY</p>
                <p className="font-semibold text-white text-[0.9rem]">enquiries@vbdeducation.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[rgba(255,255,255,0.08)] my-2.5"></div>

          <p className="text-[0.85rem] text-[#94A3B8] leading-[1.5]">
            Need an instant response? Text our onboarding managers on WhatsApp for rapid school registration checks.
          </p>

          <button className="btn mt-2.5 bg-[#25D366] text-white font-bold shadow-[0_4px_14px_rgba(37,211,102,0.4)] gap-[10px] self-start hover:bg-[#128C7E] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(18,140,126,0.6)]" onClick={handleWhatsAppRedirect}>
            <MessageSquare size={16} />
            WhatsApp Chat
          </button>
        </div>

        <form className="glass-card p-[30px]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div className="form-group !mb-0">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Max" className="form-control" required />
            </div>
            <div className="form-group !mb-0">
              <label className="form-label">School Name</label>
              <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="e.g. Kakatiya School" className="form-control" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div className="form-group !mb-0">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 123456" className="form-control" />
            </div>
            <div className="form-group !mb-0">
              <label className="form-label">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="max@example.com" className="form-control" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we assist you today? Provide as many details as possible..."
              rows={4}
              className="form-control resize-y"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-full p-[14px]" disabled={submitting}>
            <Send size={16} />
            {submitting ? 'Transmitting Request...' : 'Send Enquiry'}
          </button>
        </form>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgba(10,25,47,0.85)] backdrop-blur-[8px] flex items-center justify-center z-[1000] animate-[modalFadeIn_0.3s_ease_forwards]">
          <div className="glass-card w-full max-w-[500px] p-[40px_30px] text-center flex flex-col items-center animate-[modalZoomIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
            <CheckCircle size={72} className="text-success mb-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-[bounceCheck_1s_cubic-bezier(0.175,0.885,0.32,1.275)_infinite_alternate]" />
            <h3 className="text-[1.6rem] text-white mb-[14px] font-heading">Enquiry Registered</h3>
            <p className="text-[#94A3B8] text-[0.95rem] leading-[1.6] mb-[30px]">
              Thank you for contacting VBD Education Services.
              <br /><br />
              We have successfully received your enquiry. Our team will review your request and contact you within the next 2 hours during business hours.
              <br /><br />
              We appreciate your interest and look forward to assisting you.
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Close</button>
              {onReturnHome && (
                <button className="btn btn-gold" onClick={() => { setShowPopup(false); onReturnHome(); }}>
                  Return to Homepage
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
