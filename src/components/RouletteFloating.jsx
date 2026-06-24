import { useState } from "react";
import { useRouter } from "next/router";
import RouletteModal from "./RouletteModal";

export default function RouletteFloating({ posts = [] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="키워드 룰렛 열기"
        className="rlt-fab"
        onClick={() => setIsOpen(true)}
      >
        <RouletteWheelIcon />
      </button>

      <RouletteModal
        posts={posts}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={(post) => {
          setIsOpen(false);
          router.push(`/post/${post.id}`);
        }}
      />

      <style jsx>{`
        .rlt-fab {
          position: fixed;
          right: 24px;
          bottom: calc(var(--footer-height) + 24px); 
          z-index: 900;
          width: 52px;
          height: 52px;
          padding: 0;
          border: 1.5px solid #1a1a1a;
          border-radius: 50%;
          background: #e8e4dc;
          color: #1a1a1a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s ease, transform 0.18s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .rlt-fab:hover {
          background: #1a1a1a;
          color: #e8e4dc;
          transform: rotate(15deg);
        }
        .rlt-fab:active {
          transform: rotate(15deg) scale(0.94);
        }
        @media (max-width: 480px) {
        .rlt-fab {
            right: 16px;
            bottom: calc(var(--footer-height) + 16px);
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </>
  );
}

/* B — 도트 원형 룰렛 휠 아이콘 (currentColor 사용 → hover 시 색 반전) */
function RouletteWheelIcon() {
  const cx = 14;
  const cy = 14;
  const r = 10;
  const spokes = 8;

  // 8등분 스포크 라인
  const lines = Array.from({ length: spokes }, (_, i) => {
    const a = (Math.PI * 2 * i) / spokes;
    return {
      x2: cx + r * Math.cos(a),
      y2: cy + r * Math.sin(a),
      key: `s${i}`,
    };
  });

  // 내부 도트 패턴 (격자 중 원 안에 들어오는 것만)
  const dots = [];
  for (let dx = -r; dx <= r; dx += 4) {
    for (let dy = -r; dy <= r; dy += 4) {
      if (Math.sqrt(dx * dx + dy * dy) <= r - 2) {
        dots.push({ x: cx + dx, y: cy + dy, key: `d${dx}_${dy}` });
      }
    }
  }

  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* 바깥 원 */}
      <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth="1.5" />
      {/* 도트 패턴 */}
      {dots.map((d) => (
        <circle key={d.key} cx={d.x} cy={d.y} r="0.7" fill="currentColor" opacity="0.35" />
      ))}
      {/* 스포크 */}
      {lines.map((l) => (
        <line
          key={l.key}
          x1={cx}
          y1={cy}
          x2={l.x2}
          y2={l.y2}
          stroke="currentColor"
          strokeWidth="0.9"
          opacity="0.55"
        />
      ))}
      {/* 중심점 */}
      <circle cx={cx} cy={cy} r="2" fill="currentColor" />
    </svg>
  );
}
