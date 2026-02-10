import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Comments({ postId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchComments() {
      setLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .select('id, post_id, author_name, content, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching comments:', error)
      } else {
        setComments(data || [])
      }
      setLoading(false)
    }

    fetchComments()
  }, [postId])

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!name.trim() || !email.trim() || !content.trim()) {
      alert('모든 필드를 입력해주세요')
      return
    }

    setSubmitting(true)

    const { data, error } = await supabase
      .from('comments')
      .insert([
        { 
          post_id: postId,
          author_name: name.trim(),
          author_email: email.trim(),
          content: content.trim()
        }
      ])
      .select()

    if (error) {
      console.error('Error adding comment:', error)
      alert('댓글 작성 실패')
    } else {
      setComments(prev => [data[0], ...prev])
      setName('')
      setEmail('')
      setContent('')
    }
    
    setSubmitting(false)
  }

  const formStyle = {
    marginBottom: '60px',
    marginTop: '30px'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#000'
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    border: '1px solid #000',
    backgroundColor: '#e2e0d4',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  }

  const textareaStyle = {
    ...inputStyle,
    minHeight: '200px',
    resize: 'vertical'
  }

  const buttonStyle = {
    padding: '12px 30px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#e2e0d4',
    color: '#000',
    border: '1px solid #000',
    cursor: submitting ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    opacity: submitting ? 0.6 : 1,
    borderRadius: 0
  }

  const commentItemStyle = {
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #000',
    backgroundColor: '#E8E4D9'
  }

  const commentHeaderStyle = {
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }

  const authorNameStyle = {
    fontWeight: 'bold',
    fontSize: '15px'
  }

  const dateStyle = {
    fontSize: '14px',
    color: '#666'
  }

  const commentContentStyle = {
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: '1',
    fontSize: '15px'
  }

  return (
    <div className="container">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '40px', marginTop: '80px' }}>
        댓글 ({comments.length})
      </h2>
      
      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={{ marginBottom: '30px' }}>
          <label style={labelStyle}>Your Name</label>
          <input
            className="comment-input"
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label style={labelStyle}>Your Email</label>
          <input
            className="comment-input"
            type="email"
            placeholder="your@email.com(비공개)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label style={labelStyle}>Comment</label>
          <textarea
            className="comment-textarea"
            placeholder="Your comment here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={textareaStyle}
          />
        </div>
        
        <button className="comment-button" type="submit" disabled={submitting} style={buttonStyle}>
          {submitting ? 'Sending...' : 'Send Comment'}
        </button>
      </form>

      {/* 댓글 목록 */}
    {loading ? (
    <p style={{ fontSize: '15px', color: '#666' }}>댓글을 불러오는 중...</p>
    ) : (
    <>
        {comments.length > 0 && (
        <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginBottom: '30px',
            fontStyle: 'italic'
        }}>
            💡 Refresh the page to see new comments from other users / 다른 사용자의 새 댓글을 보려면 페이지를 새로고침해주세요
        </p>
        )}
        
        {comments.length === 0 ? (
        <p style={{ fontSize: '15px', color: '#666' }}>첫 댓글을 작성해보세요!</p>
        ) : (
        <div>
            {comments.map((comment) => (
            <div key={comment.id} style={commentItemStyle}>
                <div style={commentHeaderStyle}>
                <span style={authorNameStyle}>{comment.author_name}</span>
                <span style={dateStyle}>
                    {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                    })}
                </span>
                </div>
                <p style={commentContentStyle}>{comment.content}</p>
            </div>
            ))}
        </div>
        )}
    </>
    )}  
    </div>
  )
}