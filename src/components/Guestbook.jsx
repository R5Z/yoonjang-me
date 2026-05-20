import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Guestbook() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true)
      const { data, error } = await supabase
        .from('guestbook')
        .select('id, author_name, content, created_at')
        .order('created_at', { ascending: false }) // 최신순

      if (error) {
        console.error('Error fetching guestbook:', error)
      } else {
        setEntries(data || [])
      }
      setLoading(false)
    }

    fetchEntries()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !content.trim()) {
      alert('이름과 메시지를 입력해주세요')
      return
    }

    setSubmitting(true)

    const { data, error } = await supabase
      .from('guestbook')
      .insert([
        {
          author_name: name.trim(),
          author_email: email.trim() || null,
          content: content.trim()
        }
      ])
      .select()

    if (error) {
      console.error('Error adding entry:', error)
      alert('방명록 작성 실패')
    } else {
      // 최신순이므로 새 항목을 맨 앞에 추가
      setEntries(prev => [data[0], ...prev])
      setName('')
      setEmail('')
      setContent('')
    }

    setSubmitting(false)
  }

  // --- 스타일 ---
  const formStyle = { marginBottom: '60px', marginTop: '30px' }
  const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '10px', color: '#000' }
  const inputStyle = {
    width: '100%', padding: '12px', fontSize: '15px', border: '1px solid #000',
    backgroundColor: '#e2e0d4', boxSizing: 'border-box', fontFamily: 'inherit'
  }
  const textareaStyle = { ...inputStyle, minHeight: '150px', resize: 'vertical' }
  const buttonStyle = {
    padding: '12px 30px', fontSize: '1rem', fontWeight: '600', backgroundColor: '#e2e0d4',
    color: '#000', border: '1px solid #000', cursor: submitting ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', opacity: submitting ? 0.6 : 1, borderRadius: 0
  }
  const entryItemStyle = { padding: '20px', marginBottom: '20px', border: '1px solid #000', backgroundColor: '#E8E4D9' }
  const entryHeaderStyle = { marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }
  const authorNameStyle = { fontWeight: 'bold', fontSize: '15px' }
  const dateStyle = { fontSize: '14px', color: '#666' }
  const entryContentStyle = { margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4', fontSize: '15px' }

  return (
    <div style={{ marginTop: '40px', maxWidth: '600px'}}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Guestbook ({entries.length})
      </h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '0.7fr 1fr', 
          gap: '20px',
          marginBottom: '20px' 
        }} className="guestbook-row">
          <div>
            <label style={labelStyle}>Your Name</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={inputStyle} 
              placeholder="Your name here..." 
              className="comment-input"
            />
          </div>

          <div>
            <label style={labelStyle}>Your Email (Optional)</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={inputStyle} 
              placeholder="your@email.com (private)" 
              className="comment-input"
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Message</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            style={textareaStyle} 
            placeholder="Leave your message here..." 
            className="comment-textarea"
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting} 
          style={buttonStyle}
          className="comment-button"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {loading ? (
        <p style={{ fontSize: '15px', color: '#666' }}>방명록을 불러오는 중...</p>
      ) : (
        <>
          {entries.length === 0 ? (
            <p style={{ fontSize: '15px', color: '#666' }}>첫 방명록을 남겨보세요!</p>
          ) : (
            <div>
              {entries.map((entry) => (
                <div key={entry.id} style={entryItemStyle}>
                  <div style={entryHeaderStyle}>
                    <span style={authorNameStyle}>{entry.author_name}</span>
                    <span style={dateStyle}>
                      {new Date(entry.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p style={entryContentStyle}>{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}