import { blogroll } from '/data/blogroll';

export default function Blogroll() {
  if (!blogroll.length) return null;

  return (
    <div style={{ marginTop: '40px', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Blogroll
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {blogroll.map((site) => (
          <a
            key={site.url}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '14px 0',
              borderBottom: '1px solid rgba(0,0,0,0.12)',
              textDecoration: 'none',
            }}
          >
            <span>
              <span style={{ fontSize: '18px' }}>{site.name}</span>
              {site.desc && (
                <span style={{ fontSize: '13px', color: '#8B8A80', marginLeft: '10px' }}>
                  {site.desc}
                </span>
              )}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}