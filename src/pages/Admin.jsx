import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import styles from './Admin.module.css';

const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const defaultFrontmatter = {
  title: '',
  date: '',
  tags: '',
  slug: '',
  imgUrl: '',
};

function formatDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}. ${mm}. ${dd}`;
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [fm, setFm] = useState({ ...defaultFrontmatter, date: formatDate() });
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // '', 'success', 'error'
  const textareaRef = useRef(null);

  function showStatus(msg, type = '') {
    setStatus(msg);
    setStatusType(type);
  }

  function handleLogin() {
    if (pw === PASSWORD) {
      setAuthed(true);
      showStatus('');
    } else {
      showStatus('비밀번호가 틀렸어요', 'error');
    }
  }

  async function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    showStatus('이미지 업로드 중...');
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/blob-upload',
      });

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const before = body.slice(0, start);
      const after = body.slice(start);
      const tag = `<img src="${blob.url}" width="500" />`;
      setBody(before + tag + after);
      showStatus('이미지 업로드 완료', 'success');
    } catch (err) {
      showStatus('이미지 업로드 실패: ' + err.message, 'error');
    }
  }

  async function handleImgUrlUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    showStatus('대표 이미지 업로드 중...');
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/blob-upload',
      });
      setFm((prev) => ({ ...prev, imgUrl: blob.url }));
      showStatus('대표 이미지 업로드 완료', 'success');
    } catch (err) {
      showStatus('대표 이미지 업로드 실패: ' + err.message, 'error');
    }
  }

  async function handleSave() {
    if (!fm.slug) return showStatus('slug를 입력해주세요', 'error');

    const filename = `${fm.slug}.md`;
    const frontmatter = `---
title: "${fm.title}"
date: "${fm.date}"
tags: "${fm.tags}"
slug: "${fm.slug}"
imgUrl: "${fm.imgUrl}"
---
`;
    const content = frontmatter + body;

    showStatus('저장 중...');
    try {
      const res = await fetch('/api/github-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content }),
      });

      if (!res.ok) {
        const err = await res.json();
        return showStatus('저장 실패: ' + err.error, 'error');
      }

      showStatus('저장 완료! GitHub에 커밋됐어요', 'success');
    } catch (err) {
      showStatus('저장 실패: ' + err.message, 'error');
    }
  }

  // 로그인 화면
  if (!authed) {
    return (
      <div className="container">
        <div className={`${styles.floatingCircle} ${styles.circle1}`} />
        <div className={`${styles.floatingCircle} ${styles.circle2}`} />
        <div className={`${styles.floatingCircle} ${styles.circle3}`} />
        <h1 className="page-title">Admin</h1>
        <div className="contact-form-section">
          <div className="contact-form">
            <div className="form-group">
              <label htmlFor="pw">Password</label>
              <input
                id="pw"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
              />
            </div>
            <button className="submit-button" onClick={handleLogin}>
              Enter
            </button>
            {status && (
              <div className={`status-message ${statusType}`}>{status}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 에디터 화면
  return (
    <div className="container">
        <div className={`${styles.floatingCircle} ${styles.circle1}`} />
        <div className={`${styles.floatingCircle} ${styles.circle2}`} />
        <div className={`${styles.floatingCircle} ${styles.circle3}`} />
      <h1 className="page-title">Admin</h1>

      <div className={styles.editorSection}>
        <div className="contact-form">
          {/* 프론트매터 */}
          {['title', 'date', 'tags', 'slug'].map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key}</label>
              <input
                id={key}
                type="text"
                value={fm[key]}
                onChange={(e) =>
                  setFm((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            </div>
          ))}

          {/* imgUrl */}
          <div className="form-group">
            <label htmlFor="imgUrl">imgUrl</label>
            <div className={styles.imgUrlRow}>
              <input
                id="imgUrl"
                type="text"
                value={fm.imgUrl}
                onChange={(e) =>
                  setFm((prev) => ({ ...prev, imgUrl: e.target.value }))
                }
              />
              <label className={styles.uploadLabel}>
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImgUrlUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* 본문 */}
          <div className="form-group">
            <label htmlFor="body">body</label>
            <textarea
              id="body"
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              placeholder="본문을 작성하세요. 이미지는 여기에 드래그앤드롭."
              className={styles.bodyTextarea}
            />
          </div>

          <button className="submit-button" onClick={handleSave}>
            Save (Commit to GitHub)
          </button>

          {status && (
            <div className={`status-message ${statusType}`}>{status}</div>
          )}
        </div>
      </div>
    </div>
  );
}