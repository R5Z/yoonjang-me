import { useEffect, useRef, useState, useCallback } from "react";

const C = {
  bg: "#e8e4dc",
  bgDim: "#d4cfc5",
  dark: "#1a1a1a",
  muted: "#666",
  blue: "#0015ff",
};

const DOT_R = 1.8;
const DOT_SPACING = 7;


function makeExcerpt(content, maxLen = 70) {
  if (!content) return "";
  const plain = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/[*_`>~]/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLen ? plain.slice(0, maxLen).trim() + "…" : plain;
}


function buildTagMap(posts) {
  const map = new Map();
  for (const p of posts) {
    for (const t of p.tags || []) {
      const key = t.startsWith("#") ? t : `#${t}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
  }
  return map;
}

export default function RouletteModal({ posts, isOpen, onClose, onSelect }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rotRef = useRef(0);
  const spinningRef = useRef(false);
  const sizeRef = useRef(240);

  const [tags, setTags] = useState([]);
  const [tagMap, setTagMap] = useState(new Map());
  const [result, setResult] = useState(null);
  const [resultTag, setResultTag] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);


  useEffect(() => {
    const map = buildTagMap(posts);
    setTagMap(map);
    setTags(Array.from(map.keys()));
  }, [posts]);


  const drawWheel = useCallback(
    (rot) => {
      const canvas = canvasRef.current;
      if (!canvas || tags.length === 0) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const size = sizeRef.current;
      const CXY = size / 2;
      const R = size / 2 - 8;
      const N = tags.length;
      const SA = (2 * Math.PI) / N;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      
      for (let i = 0; i < N; i++) {
        const start = rot + i * SA;
        ctx.beginPath();
        ctx.moveTo(CXY, CXY);
        ctx.arc(CXY, CXY, R, start, start + SA);
        ctx.closePath();
        ctx.fillStyle = i % 2 ? C.bgDim : C.bg;
        ctx.fill();
      }

      
      for (let i = 0; i < N; i++) {
        const start = rot + i * SA;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(CXY, CXY);
        ctx.arc(CXY, CXY, R, start, start + SA);
        ctx.closePath();
        ctx.clip();
        for (let dy = -R; dy <= R; dy += DOT_SPACING) {
          for (let dx = -R; dx <= R; dx += DOT_SPACING) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > R) continue;
            const t = dist / R;
            ctx.beginPath();
            ctx.arc(CXY + dx, CXY + dy, DOT_R, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(26,26,26,${0.07 + t * 0.1})`;
            ctx.fill();
          }
        }
        ctx.restore();
      }

      
      for (let i = 0; i < N; i++) {
        const start = rot + i * SA;
        ctx.beginPath();
        ctx.moveTo(CXY, CXY);
        ctx.arc(CXY, CXY, R, start, start + SA);
        ctx.closePath();
        ctx.strokeStyle = C.dark;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      const fontPx = Math.max(7, Math.min(11, Math.round(size * 0.4 / N)));
      const hubR = size * 0.058;          // 허브 반지름 (텍스트 시작 안쪽 한계)
      const maxChars = Math.max(6, Math.floor((R - hubR) / (fontPx * 0.62)));
      ctx.font = `500 ${fontPx}px 'helvetica neue',helvetica,arial,sans-serif`;
      for (let i = 0; i < N; i++) {
        const mid = rot + i * SA + SA / 2;
        let label = tags[i];
        if (label.length > maxChars) label = label.slice(0, maxChars - 1) + "…";

        ctx.save();
        ctx.translate(CXY, CXY);
        ctx.rotate(mid);
        ctx.fillStyle = C.dark;
        ctx.textBaseline = "middle";
        
        const flipped = Math.cos(mid) < 0;
        if (flipped) {
          ctx.rotate(Math.PI);
          ctx.textAlign = "left";
          ctx.fillText(label, -(R - 6), 0);
        } else {
          ctx.textAlign = "right";
          ctx.fillText(label, R - 6, 0);
        }
        ctx.restore();
      }

      
      ctx.beginPath();
      ctx.arc(CXY, CXY, size * 0.058, 0, 2 * Math.PI);
      ctx.fillStyle = C.bg;
      ctx.fill();
      ctx.strokeStyle = C.dark;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(CXY, CXY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = C.dark;
      ctx.fill();
    },
    [tags]
  );

  /* 캔버스 크기 세팅 (모바일 대응 + DPR) */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const avail = wrap.clientWidth;
    const size = Math.max(180, Math.min(avail, 280));
    sizeRef.current = size;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    drawWheel(rotRef.current);
  }, [drawWheel]);

  
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(resizeCanvas);
    const ro = new ResizeObserver(resizeCanvas);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", resizeCanvas);

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, resizeCanvas, onClose]);

  
  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setHasSpun(false);
      rotRef.current = 0;
    }
  }, [isOpen]);

  const easeOut = (t) => 1 - Math.pow(1 - t, 4);

  const startSpin = useCallback(() => {
    if (spinningRef.current || tags.length === 0) return;
    spinningRef.current = true;
    setSpinning(true);
    setResult(null);

    const N = tags.length;
    const SA = (2 * Math.PI) / N;
    const pickedIdx = Math.floor(Math.random() * N);
    const pickedTag = tags[pickedIdx];

    
    const targetCenter = -(pickedIdx * SA + SA / 2);
    const extra = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const norm = rotRef.current % (2 * Math.PI);
    const diff = ((targetCenter - norm) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const totalDelta = extra + diff;
    const startRot = rotRef.current;
    const duration = 3200;
    const t0 = performance.now();

    const frame = (now) => {
      const t = Math.min((now - t0) / duration, 1);
      rotRef.current = startRot + totalDelta * easeOut(t);
      drawWheel(rotRef.current);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        spinningRef.current = false;
        setSpinning(false);
        setHasSpun(true);
        const pool = tagMap.get(pickedTag) || [];
        const post = pool[Math.floor(Math.random() * pool.length)];
        setResultTag(pickedTag);
        setResult(post || null);
      }
    };
    requestAnimationFrame(frame);
  }, [tags, tagMap, drawWheel]);

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div
        className="rlt-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="rlt-modal" role="dialog" aria-modal="true" aria-label="키워드 룰렛">
          <div className="rlt-header">
            <div>
              <div className="rlt-title">random posts</div>
              <div className="rlt-sub">spin to find something to read</div>
            </div>
            <button className="rlt-close" aria-label="닫기" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="rlt-wheel-area">
            <div className="rlt-canvas-wrap" ref={wrapRef}>
              <canvas ref={canvasRef} />
              <div className="rlt-pointer" aria-hidden="true" />
            </div>
            <button className="rlt-spin" onClick={startSpin} disabled={spinning}>
              {spinning ? "spinning…" : hasSpun ? "spin again" : "spin"}
            </button>
          </div>

          {result && (
            <div className="rlt-result">
              <div className="rlt-result-tag">{resultTag}</div>
              <div className="rlt-result-title">{result.title}</div>
              <div className="rlt-result-desc">{makeExcerpt(result.content)}</div>
              <button className="rlt-go" onClick={() => onSelect(result)}>
                read post →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


const styles = `
.rlt-backdrop{
  position:fixed;inset:0;z-index:1000;
  background:rgba(26,26,26,0.45);
  display:flex;align-items:center;justify-content:center;
  padding:16px;
  font-family:'helvetica neue',helvetica,arial,sans-serif;
  -webkit-tap-highlight-color:transparent;
}
.rlt-modal{
  background:${C.bg};
  border:1.5px solid ${C.dark};
  width:100%;max-width:400px;
  max-height:calc(100vh - 32px);
  overflow-y:auto;
}
.rlt-header{
  border-bottom:1.5px solid ${C.dark};
  padding:14px 16px 12px;
  display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
}
.rlt-title{font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${C.dark};}
.rlt-sub{font-size:10px;color:${C.muted};letter-spacing:0.06em;margin-top:3px;}
.rlt-close{
  background:none;border:none;cursor:pointer;
  font-size:20px;line-height:1;color:${C.dark};padding:0;
  font-family:inherit;flex-shrink:0;
}
.rlt-wheel-area{
  padding:24px 16px 18px;
  display:flex;flex-direction:column;align-items:center;gap:18px;
}
.rlt-canvas-wrap{
  position:relative;width:100%;max-width:280px;
  display:flex;justify-content:center;
}
.rlt-canvas-wrap canvas{display:block;}
.rlt-pointer{
  position:absolute;top:50%;right:-4px;transform:translateY(-50%);
  width:0;height:0;
  border-top:9px solid transparent;
  border-bottom:9px solid transparent;
  border-right:16px solid ${C.dark};
}
.rlt-spin{
  font-family:inherit;
  font-size:11px;letter-spacing:0.14em;text-transform:uppercase;
  padding:11px 30px;border:1.5px solid ${C.dark};
  background:${C.bg};color:${C.dark};cursor:pointer;
  transition:background 0.15s,color 0.15s;
}
.rlt-spin:hover:not(:disabled){background:${C.dark};color:${C.bg};}
.rlt-spin:disabled{opacity:0.35;cursor:default;}
.rlt-result{
  border-top:1.5px solid ${C.dark};padding:16px;
}
.rlt-result-tag{
  font-size:10px;letter-spacing:0.12em;text-transform:uppercase;
  color:${C.blue};margin-bottom:8px;
}
.rlt-result-title{
  font-size:22px;font-weight:400;color:${C.dark};
  line-height:1.2;letter-spacing:-0.01em;margin-bottom:8px;
}
.rlt-result-desc{
  font-size:11px;color:${C.muted};line-height:1.7;
  letter-spacing:0.02em;margin-bottom:14px;
}
.rlt-go{
  font-family:inherit;
  font-size:10px;letter-spacing:0.14em;text-transform:uppercase;
  padding:10px 22px;border:1.5px solid ${C.dark};
  background:${C.bg};color:${C.dark};cursor:pointer;
  transition:background 0.15s,color 0.15s;
}
.rlt-go:hover{background:${C.dark};color:${C.bg};}

@media (max-width:480px){
  .rlt-result-title{font-size:19px;}
  .rlt-wheel-area{padding:20px 14px 16px;}
}
`;
