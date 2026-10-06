function Hero() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #a5192e 0%, #6b0f1a 100%)',
      color: 'white',
      padding: '50px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '30px',
      flexWrap: 'wrap'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        pointerEvents: 'none'
      }}></div>

      {/* Blood bag SVG illustration */}
      <svg width="80" height="100" viewBox="0 0 80 100" style={{ position: 'relative', flexShrink: 0 }}>
        <rect x="15" y="25" width="50" height="65" rx="8" fill="white" opacity="0.95" />
        <rect x="15" y="55" width="50" height="35" rx="8" fill="#ffffff" opacity="0.95" />
        <path d="M15 55 L65 55 L65 82 Q65 90 57 90 L23 90 Q15 90 15 82 Z" fill="#a5192e" />
        <rect x="32" y="8" width="16" height="20" rx="3" fill="white" opacity="0.9" />
        <circle cx="40" cy="10" r="6" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
        <text x="40" y="45" fontSize="14" fontWeight="700" fill="#a5192e" textAnchor="middle">BLOOD</text>
      </svg>

      <div style={{ position: 'relative', textAlign: 'left' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 10px' }}>
          Blood Request Network
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.9, margin: 0, maxWidth: '360px' }}>
          Connecting urgent blood requests with life-saving donors — instantly, when it matters most.
        </p>
      </div>
    </div>
  );
}

export default Hero;