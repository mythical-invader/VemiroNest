import React from 'react';

const Contact = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', minHeight: '60vh', textAlign: 'center' }}>
      <h1 style={{ color: '#f97316', marginBottom: '20px' }}>Contact Support</h1>
      <div style={{ background: '#18181b', padding: '40px', borderRadius: '12px', border: '1px solid #27272a' }}>
        <p style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '20px' }}>
          If you have any queries, please don't hesitate to contact our support team.
        </p>
        <p style={{ fontSize: '1.1rem', color: '#a1a1aa' }}>
          Use this email for any inquiries:
        </p>
        <div style={{ margin: '30px 0' }}>
          <a href="mailto:support@vemironest.com" style={{ 
            background: 'rgba(249, 115, 22, 0.1)', 
            border: '1px solid #f97316',
            color: '#f97316',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            support@vemironest.com
          </a>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#71717a' }}>
          We aim to respond to all queries within 24-48 hours.
        </p>
      </div>
    </div>
  );
};

export default Contact;
