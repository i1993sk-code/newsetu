import { useState, useEffect } from 'react';

export default function AdPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('adShown_newsetu')) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    localStorage.setItem('adShown_newsetu', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:9999,
      display:'flex',alignItems:'center',justifyContent:'center',
      background:'rgba(0,0,0,.6)',backdropFilter:'blur(4px)',
      padding:16,animation:'fadeIn .3s ease'
    }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .ad-modal{max-width:440px;width:100%;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,.35);position:relative}
        .ad-header{background:linear-gradient(135deg,#f97316,#ec4899,#8b5cf6);padding:32px 24px 24px;text-align:center;position:relative}
        .ad-header::after{content:'';position:absolute;bottom:-20px;left:0;right:0;height:40px;background:#fff;border-radius:50% 50% 0 0}
        .ad-close{position:absolute;top:12px;right:14px;background:rgba(255,255,255,.25);border:none;color:#fff;width:32px;height:32px;border-radius:50%;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;z-index:2;line-height:1}
        .ad-close:hover{background:rgba(255,255,255,.45);transform:rotate(90deg)}
        .ad-icon{font-size:52px;margin-bottom:8px;animation:float 2.5s ease-in-out infinite;display:block}
        .ad-title{font-size:22px;font-weight:900;color:#fff;margin:0;text-shadow:0 2px 10px rgba(0,0,0,.15)}
        .ad-sub{font-size:13px;color:rgba(255,255,255,.9);margin:6px 0 0;font-weight:500}
        .ad-body{padding:20px 24px 24px}
        .ad-desc{font-size:13px;color:#555;line-height:1.6;margin:0 0 16px;text-align:center}
        .ad-services{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px}
        .ad-service{background:linear-gradient(135deg,#fef3c7,#fce7f3);border-radius:10px;padding:10px;text-align:center;font-size:13px;font-weight:700;color:#1e293b;border:1px solid rgba(0,0,0,.04)}
        .ad-phone{display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,#f97316,#ec4899);color:#fff;padding:14px;border-radius:14px;text-decoration:none;font-size:18px;font-weight:900;letter-spacing:1px;animation:pulse 2s ease-in-out infinite;margin-bottom:12px;cursor:pointer}
        .ad-phone:hover{animation:none;opacity:.95}
        .ad-note{text-align:center;font-size:11px;color:#999;margin:0}
      `}</style>

      <div className="ad-modal">
        <div className="ad-header">
          <button className="ad-close" onClick={close} aria-label="Close">&times;</button>
          <span className="ad-icon">🚀</span>
          <h2 className="ad-title">Professional Website<br />Chahiye?</h2>
          <p className="ad-sub">Apne business ko digital banayein</p>
        </div>
        <div className="ad-body">
          <p className="ad-desc">
            Hum banate hain har tarah ke websites — <strong>Fast, Responsive aur Professional</strong>
          </p>
          <div className="ad-services">
            <div className="ad-service">🍕 Food Delivery</div>
            <div className="ad-service">🏥 Hospital / Clinic</div>
            <div className="ad-service">📚 Coaching Institute</div>
            <div className="ad-service">🧾 CA / Tax Consultant</div>
            <div className="ad-service">🛍️ E-commerce Store</div>
            <div className="ad-service">🏨 Hotel / Restaurant</div>
            <div className="ad-service">🎓 Educational Portal</div>
            <div className="ad-service">📱 Service Platform</div>
          </div>
          <a className="ad-phone" href="tel:+919608354372">
            📞 +91-9608354372
          </a>
          <p className="ad-note">Call ya WhatsApp karein — Free Consultation</p>
        </div>
      </div>
    </div>
  );
}