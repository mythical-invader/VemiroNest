import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: isMobile ? '20px auto' : '40px auto', padding: isMobile ? '15px' : '20px', minHeight: '60vh', textAlign: 'center', boxSizing: 'border-box', width: '100%' }}>
      <h1 style={{ color: '#f97316', marginBottom: '20px', fontSize: isMobile ? '2rem' : '2.5rem' }}>Contact Support</h1>
      <div style={{ background: '#18181b', padding: isMobile ? '25px 15px' : '40px', borderRadius: '12px', border: '1px solid #27272a', width: '100%', boxSizing: 'border-box' }}>
        <p style={{ fontSize: isMobile ? '1.05rem' : '1.2rem', color: '#fff', marginBottom: '20px', lineHeight: '1.5' }}>
          If you have any queries, please don't hesitate to contact our support team.
        </p>
        <p style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', color: '#a1a1aa' }}>
          Use this email for any inquiries:
        </p>
        <div style={{ margin: isMobile ? '20px 0' : '30px 0' }}>
          <a href="mailto:support@vemironest.com" style={{ 
            background: 'rgba(249, 115, 22, 0.1)', 
            border: '1px solid #f97316',
            color: '#f97316',
            padding: isMobile ? '12px 20px' : '15px 30px',
            borderRadius: '8px',
            fontSize: isMobile ? '1rem' : '1.2rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
            wordBreak: 'break-word',
            maxWidth: '100%'
          }}>
            support@vemironest.com
          </a>
        </div>
        <p style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#71717a' }}>
          We aim to respond to all queries within 24-48 hours.
        </p>
      </div>
    </div>
  );
};

export default Contact;
