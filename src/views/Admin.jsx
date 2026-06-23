import { useState, useRef, useEffect } from 'react';
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

// 프론트매터 + 본문 파싱
function parseMarkdown(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { fm: { ...defaultFrontmatter }, body: content };

  const fmText = match[1];
  const body = match[2];
  const fm = { ...defaultFrontmatter };

  fmText.split('\n').forEach((line) => {
    const m = line.match(/^(\w+):\s*"?(.*?)"?$/);
    if (m && fm.hasOwnProperty(m[1])) {
      fm[m[1]] = m[2];
    }
  });

  return { fm, body };
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [fm, setFm] = useState({ ...defaultFrontmatter, date: formatDate() });
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [posts, setPosts] = useState([]);
  const [originalSlug, setOriginalSlug] = useState(''); // 슬러그 변경 감지용
  const textareaRef = useRef(null);

  function showStatus(msg, type = '') {
    setStatus(msg);
    setStatusType(type);
  }

  function handleLogin() {
    if (pw === PASSWORD) {
      setAuthed(true);
      showStatus('');
      loadPosts();
    } else {
      showStatus('비밀번호가 틀렸어요', 'error');
    }
  }

  async function loadPosts() {
    try {
      const res = await fetch('/api/github-list');
      const data = await res.json();
      if (data.files) setPosts(data.files);
    } catch (err) {
      showStatus('목록 로드 실패: ' + err.message, 'error');
    }
  }

  async function handleLoadPost(filename) {
    try {
      const res = await fetch(`/api/github-get?filename=${filename}`);
      const data = await res.json();
      if (!data.content) return showStatus('로드 실패', 'error');

      const { fm: loadedFm, body: loadedBody } = parseMarkdown(data.content);
      setFm(loadedFm);
      setBody(loadedBody);
      setOriginalSlug(loadedFm.slug);
      showStatus(`불러옴: ${filename}`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showStatus('로드 실패: ' + err.message, 'error');
    }
  }

  async function handleDelete(filename) {
    if (!confirm(`정말 삭제할까요?\n${filename}`)) return;

    try {
      const res = await fetch('/api/github-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      if (!res.ok) {
        const err = await res.json();
        return showStatus('삭제 실패: ' + err.error, 'error');
      }
      showStatus(`삭제됨: ${filename}`, 'success');
      loadPosts();
    } catch (err) {
      showStatus('삭제 실패: ' + err.message, 'error');
    }
  }

  function handleNew() {
    setFm({ ...defaultFrontmatter, date: formatDate() });
    setBody('');
    setOriginalSlug('');
    showStatus('새 글 작성 모드', '');
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

  async function handleBodyImageUpload(e) {
  const file = e.target.files[0];
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

  // 같은 파일 재선택 가능하도록 초기화
  e.target.value = '';
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

      // 슬러그 변경 시 기존 파일 삭제
      if (originalSlug && originalSlug !== fm.slug) {
        const oldFilename = `${originalSlug}.md`;
        await fetch('/api/github-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: oldFilename }),
        });
        showStatus(`저장 완료 (${oldFilename} → ${filename})`, 'success');
      } else {
        showStatus('저장 완료!', 'success');
      }
      setOriginalSlug(fm.slug);
      loadPosts();
    } catch (err) {
      showStatus('저장 실패: ' + err.message, 'error');
    }
  }

  if (!authed) {
    return (
      <div className="container">
        <div className={`${styles.floatingCircle} ${styles.circle1}`} />
        <div className={`${styles.floatingCircle} ${styles.circle2}`} />
        <div className={`${styles.floatingCircle} ${styles.circle3}`} />
        <h1 className="page-title">Admin</h1>
        <div className="contact-form-section" style={{ position: 'relative', zIndex: 1 }}>
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
            {status && <div className={`status-message ${statusType}`}>{status}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={`${styles.floatingCircle} ${styles.circle1}`} />
      <div className={`${styles.floatingCircle} ${styles.circle2}`} />
      <div className={`${styles.floatingCircle} ${styles.circle3}`} />

      <h1 className="page-title">Admin</h1>

      <div className={styles.editorSection}>
        <div className="contact-form">
          <button
            type="button"
            className="submit-button"
            onClick={handleNew}
            style={{ alignSelf: 'flex-start' }}
          >
            + New Post
          </button>

          {['title', 'date', 'tags', 'slug'].map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key}</label>
              <input
                id={key}
                type="text"
                value={fm[key]}
                onChange={(e) => setFm((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="imgUrl">imgUrl</label>
            <div className={styles.imgUrlRow}>
              <input
                id="imgUrl"
                type="text"
                value={fm.imgUrl}
                onChange={(e) => setFm((prev) => ({ ...prev, imgUrl: e.target.value }))}
              />
              <label className={styles.uploadLabel}>
                Upload
                <input type="file" accept="image/*" onChange={handleImgUrlUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className={styles.bodyLabelRow}>
                <label htmlFor="body">body</label>
                <label className={styles.uploadLabel}>
                Insert Image
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleBodyImageUpload}
                    style={{ display: 'none' }}
                />
                </label>
            </div>
            <textarea
                id="body"
                ref={textareaRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                placeholder="본문을 작성하세요. 이미지는 드래그앤드롭 또는 위 버튼."
                className={styles.bodyTextarea}
            />
          </div>

          <button className="submit-button" onClick={handleSave}>
            Save (Commit to GitHub)
          </button>

          {status && <div className={`status-message ${statusType}`}>{status}</div>}
        </div>

        {/* 포스트 목록 */}
        <div className={styles.postsList}>
          <h2 className={styles.sectionTitle}>Posts</h2>
          {posts.length === 0 && <p>목록을 불러오는 중...</p>}
          <ul className={styles.postUl}>
            {posts.map((post) => (
              <li key={post.name} className={styles.postLi}>
                <span className={styles.postName}>{post.name}</span>
                <div className={styles.postActions}>
                  <button onClick={() => handleLoadPost(post.name)}>Edit</button>
                  <button onClick={() => handleDelete(post.name)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}