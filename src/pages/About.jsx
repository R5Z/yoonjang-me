import { useState } from 'react';

export default function About() {
  const [formData, setFormData] = useState({
    from_email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ from_email: '', subject: '', message: '' });
        setTimeout(() => setStatus(''), 3000);
      } else {
        throw new Error(data.error || 'Failed to send');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Jangmi Yoon</h1>
      <div className="page-content">
        <p>who continues to walk despite the fear<br/>
          and builds things along the way
        </p>
        <a href="mailto:hey@yoonjang.me" className="email-link">hey@yoonjang.me</a> | <a href="https://instagram.com/asaucybloom" target="_blank" rel="noopener noreferrer">
  IG asaucybloom</a>
        <p>재밌는 일 있으면 좀 알려주세요. 재미없어도 ↓ Tell me if something fun or silly comes up.</p>
      </div>

      {/* Contact Form */}
      <div className="contact-form-section">
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="from_email">Your Email</label>
            <input
              type="email"
              id="from_email"
              name="from_email"
              value={formData.from_email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              disabled={status === 'sending'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="What's this about?"
              disabled={status === 'sending'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Your message here..."
              disabled={status === 'sending'}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <div className="status-message success">
              ✓ Message sent successfully!
            </div>
          )}

          {status === 'error' && (
            <div className="status-message error">
              ✗ Failed to send. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}