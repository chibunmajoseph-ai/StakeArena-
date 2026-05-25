'use client'
import { useState, useEffect, useCallback } from "react";

const SB = 'https://xslgwpokhzdwkawljsqt.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbGd3cG9raHpkd2thd2xqc3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTU4NTEsImV4cCI6MjA5NTEzMTg1MX0.9BwBrEkbsXxwMfbctMe_NJ9l9obxZrOrCrtw5EGn0to';
const h = (t) => ({ 'Content-Type': 'application/json', 'apikey': KEY, 'Authorization': `Bearer ${t || KEY}`, 'Prefer': 'return=representation' });
const db = {
  signup: (e, pw, u) => fetch(`${SB}/auth/v1/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': KEY }, body: JSON.stringify({ email: e, password: pw, data: { username: u } }) }).then(r => r.json()),
  signin: (e, pw) => fetch(`${SB}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': KEY }, body: JSON.stringify({ email: e, password: pw }) }).then(r => r.json()),
  get: (path, t) => fetch(`${SB}/rest/v1/${path}`, { headers: h(t) }).then(r => r.json()),
  post: (path, t, data) => fetch(`${SB}/rest/v1/${path}`, { method: 'POST', headers: h(t), body: JSON.stringify(data) }).then(r => r.json()),
  patch: (path, t, data) => fetch(`${SB}/rest/v1/${path}`, { method: 'PATCH', headers: h(t), body: JSON.stringify(data) }).then(r => r.json()),
  rpc: (fn, t, params) => fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: h(t), body: JSON.stringify(params) }).then(r => r.json()),
};

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;
const gc = () => { const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; return Array.from({ length: 8 }, () => c[Math.floor(Math.random() * c.length)]).join(''); };
const ago = (ts) => { if (!ts) return ''; const d = (Date.now() - new Date(ts)) / 1000; if (d < 60) return 'just now'; if (d < 3600) return `${Math.floor(d / 60)}m ago`; if (d < 86400) return `${Math.floor(d / 3600)}h ago`; return `${Math.floor(d / 86400)}d ago`; };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=Barlow:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#07070f;color:#fff;font-family:'Barlow',sans-serif;}
  input,button,select,textarea{font-family:'Barlow',sans-serif;}
  .sa{max-width:430px;margin:0 auto;min-height:100vh;background:#07070f;position:relative;}
  .sa-grid{position:fixed;inset:0;background-image:linear-gradient(rgba(0,255,136,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.025) 1px,transparent 1px);background-size:36px 36px;pointer-events:none;z-index:0;}
  .z{position:relative;z-index:1;}
  .splash{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:12px;animation:fadeIn .6s ease;}
  .splash-logo{font-family:'Barlow Condensed',sans-serif;font-size:62px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;letter-spacing:-1px;}
  .splash-sub{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:4px;color:rgba(255,255,255,0.3);text-transform:uppercase;}
  .splash-bar{width:60px;height:2px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:40px;overflow:hidden;}
  .splash-bar::after{content:'';display:block;height:100%;background:linear-gradient(90deg,#00ff88,#00ccff);animation:loadBar 2.2s ease forwards;}
  @keyframes loadBar{from{width:0}to{width:100%}}
  .auth{min-height:100vh;display:flex;flex-direction:column;animation:fadeIn .4s ease;}
  .auth-hero{background:linear-gradient(160deg,#0a1a10 0%,#07070f 70%);padding:56px 24px 40px;text-align:center;position:relative;overflow:hidden;}
  .auth-hero::before{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:220px;height:220px;background:radial-gradient(circle,rgba(0,255,136,0.12) 0%,transparent 70%);pointer-events:none;}
  .auth-logo{font-family:'Barlow Condensed',sans-serif;font-size:48px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:6px;}
  .auth-tagline{font-size:13px;color:rgba(255,255,255,0.4);}
  .auth-body{flex:1;background:#0c0c18;border-radius:24px 24px 0 0;padding:28px 24px 40px;margin-top:-16px;}
  .tabs{display:flex;background:rgba(255,255,255,0.05);border-radius:10px;padding:4px;margin-bottom:24px;}
  .tab{flex:1;padding:10px;border-radius:7px;border:none;background:transparent;color:rgba(255,255,255,0.4);font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;cursor:pointer;text-transform:uppercase;transition:all .2s;}
  .tab.on{background:#00ff88;color:#07070f;}
  .field{margin-bottom:14px;}
  .flabel{display:block;font-size:10px;font-weight:600;letter-spacing:1.5px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-bottom:7px;font-family:'IBM Plex Mono',monospace;}
  .finput{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:13px 15px;color:#fff;font-size:15px;outline:none;transition:border-color .2s;}
  .finput:focus{border-color:rgba(0,255,136,0.5);}
  .finput::placeholder{color:rgba(255,255,255,0.2);}
  .btn-p{width:100%;background:linear-gradient(135deg,#00ff88,#00ccaa);border:none;border-radius:12px;padding:16px;color:#07070f;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;margin-top:6px;transition:opacity .2s,transform .1s;display:flex;align-items:center;justify-content:center;gap:8px;}
  .btn-p:active{opacity:.85;transform:scale(.99);}
  .btn-p:disabled{opacity:.5;cursor:not-allowed;}
  .btn-g{background:linear-gradient(135deg,#00ff88,#00ccaa);border:none;border-radius:10px;padding:12px 18px;color:#07070f;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;letter-spacing:1px;text-transform:uppercase;cursor:pointer;}
  .btn-g:active{opacity:.8;}
  .btn-r{background:rgba(255,45,85,0.12);border:1px solid rgba(255,45,85,0.25);border-radius:10px;padding:12px 16px;color:#ff2d55;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;cursor:pointer;}
  .hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:rgba(7,7,15,0.92);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(255,255,255,0.05);}
  .hdr-logo{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .hdr-right{display:flex;align-items:center;gap:10px;}
  .hdr-badge{background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.2);border-radius:8px;padding:6px 10px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#00ff88;font-weight:600;}
  .ava{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#00ff88,#00ccff);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;color:#07070f;flex-shrink:0;}
  .ava-sm{width:28px;height:28px;font-size:10px;}
  .ava-lg{width:48px;height:48px;font-size:16px;}
  .bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:rgba(8,8,18,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.06);display:flex;padding:10px 0 18px;z-index:100;}
  .ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:4px 0;}
  .ni-ico{font-size:20px;line-height:1;}
  .ni-lbl{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.3px;color:rgba(255,255,255,0.25);text-transform:uppercase;}
  .ni.on .ni-lbl{color:#00ff88;}
  .ni.on .ni-ico{filter:drop-shadow(0 0 5px rgba(0,255,136,0.7));}
  .page{padding:18px 18px 100px;animation:slideUp .3s ease;}
  .pg-title{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;letter-spacing:.5px;margin-bottom:18px;}
  .pg-sub{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;margin-bottom:14px;color:rgba(255,255,255,0.85);}
  .card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:18px;margin-bottom:14px;}
  .gcard{background:linear-gradient(135deg,rgba(0,255,136,0.08),rgba(0,204,255,0.04));border:1px solid rgba(0,255,136,0.18);border-radius:20px;padding:22px;margin-bottom:16px;position:relative;overflow:hidden;}
  .gcard::before{content:'';position:absolute;top:-30px;right:-30px;width:100px;height:100px;background:radial-gradient(circle,rgba(0,255,136,0.15) 0%,transparent 70%);pointer-events:none;}
  .wbal-label{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:8px;}
  .wbal-amt{font-family:'Barlow Condensed',sans-serif;font-size:44px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:18px;}
  .wbal-row{display:flex;gap:10px;}
  .wbal-btn{flex:1;padding:11px;border-radius:10px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;}
  .wbal-dep{background:linear-gradient(135deg,#00ff88,#00ccaa);color:#07070f;}
  .wbal-wit{background:rgba(255,255,255,0.08)!important;border:1px solid rgba(255,255,255,0.12)!important;color:#fff!important;}
  .stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;}
  .stat{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 10px;text-align:center;}
  .stat-val{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800;line-height:1;margin-bottom:4px;}
  .stat-lbl{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1px;color:rgba(255,255,255,0.35);text-transform:uppercase;}
  .green{color:#00ff88!important;} .red{color:#ff2d55!important;} .gold{color:#ffd700!important;}
  .ch-row{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px;margin-bottom:10px;}
  .ch-info{flex:1;}
  .ch-name{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;margin-bottom:2px;}
  .ch-meta{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.35);}
  .ch-stake{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#ffd700;margin-right:10px;white-space:nowrap;}
  .tx-row{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .tx-ico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .tx-ico.win{background:rgba(0,255,136,0.12);} .tx-ico.loss{background:rgba(255,45,85,0.12);} .tx-ico.deposit{background:rgba(0,204,255,0.12);} .tx-ico.withdrawal{background:rgba(255,165,0,0.12);} .tx-ico.stake{background:rgba(255,255,255,0.06);}
  .tx-info{flex:1;}
  .tx-desc{font-size:14px;font-weight:500;margin-bottom:2px;}
  .tx-time{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.3);}
  .tx-amt{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;white-space:nowrap;}
  .tx-amt.pos{color:#00ff88;} .tx-amt.neg{color:#ff2d55;}
  .lb-row{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px;margin-bottom:10px;}
  .lb-row.me{background:rgba(0,255,136,0.07);border-color:rgba(0,255,136,0.2);}
  .lb-rank{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;width:28px;text-align:center;flex-shrink:0;}
  .lb-name{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;margin-bottom:2px;}
  .lb-rec{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.35);}
  .lb-earn{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;color:#ffd700;margin-left:auto;white-space:nowrap;}
  .match-vs{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:20px 0;}
  .match-player{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;}
  .match-pname{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;text-align:center;}
  .match-vstext{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:rgba(255,255,255,0.2);flex-shrink:0;}
  .score-box{display:flex;align-items:center;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;margin:16px 0;}
  .score-side{display:flex;flex-direction:column;align-items:center;flex:1;}
  .score-num{font-family:'Barlow Condensed',sans-serif;font-size:72px;font-weight:900;line-height:1;padding:16px 0;}
  .score-divider{width:1px;background:rgba(255,255,255,0.08);align-self:stretch;}
  .score-ctrl{display:flex;gap:8px;padding:10px 16px;background:rgba(255,255,255,0.03);width:100%;}
  .sc-btn{flex:1;padding:10px;border-radius:8px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;cursor:pointer;}
  .sc-plus{background:rgba(0,255,136,0.15);color:#00ff88;} .sc-minus{background:rgba(255,45,85,0.12);color:#ff2d55;}
  .sc-btn:active{transform:scale(.94);} .sc-btn:disabled{opacity:.3;cursor:not-allowed;}
  .badge{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:20px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;}
  .badge-wait{background:rgba(255,165,0,0.12);color:#ffaa00;border:1px solid rgba(255,165,0,0.2);}
  .badge-live{background:rgba(255,45,85,0.12);color:#ff2d55;border:1px solid rgba(255,45,85,0.25);}
  .badge-done{background:rgba(0,255,136,0.1);color:#00ff88;border:1px solid rgba(0,255,136,0.2);}
  .badge-dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:pulse 1.4s infinite;}
  .roomcode-box{background:rgba(0,255,136,0.06);border:1px dashed rgba(0,255,136,0.3);border-radius:14px;padding:20px;text-align:center;margin:14px 0;}
  .roomcode-label{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-bottom:10px;}
  .roomcode{font-family:'IBM Plex Mono',monospace;font-size:30px;font-weight:600;color:#00ff88;letter-spacing:6px;}
  .roomcode-copy{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(0,255,136,0.6);margin-top:8px;cursor:pointer;}
  .upload-zone{border:2px dashed rgba(255,255,255,0.1);border-radius:14px;padding:32px 20px;text-align:center;cursor:pointer;transition:all .2s;margin:14px 0;}
  .upload-zone:hover,.upload-zone.done{border-color:rgba(0,255,136,0.3);background:rgba(0,255,136,0.03);}
  .upload-ico{font-size:36px;margin-bottom:10px;}
  .upload-text{font-size:14px;color:rgba(255,255,255,0.4);}
  .stake-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:12px 0;}
  .stake-chip{padding:12px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.7);font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;cursor:pointer;text-align:center;transition:all .2s;}
  .stake-chip.sel{background:rgba(0,255,136,0.12);border-color:rgba(0,255,136,0.4);color:#00ff88;}
  .sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
  .sec-title{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;}
  .sec-link{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#00ff88;cursor:pointer;}
  .active-banner{background:linear-gradient(135deg,rgba(255,45,85,0.12),rgba(255,80,50,0.08));border:1px solid rgba(255,45,85,0.2);border-radius:14px;padding:14px 16px;margin-bottom:14px;display:flex;align-items:center;gap:12px;cursor:pointer;}
  .ab-info{flex:1;}
  .ab-title{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;margin-bottom:3px;}
  .ab-meta{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.4);}
  .back-btn{display:flex;align-items:center;gap:6px;color:rgba(255,255,255,0.5);font-family:'IBM Plex Mono',monospace;font-size:11px;cursor:pointer;margin-bottom:18px;background:none;border:none;padding:0;}
  .profile-wrap{display:flex;align-items:center;gap:14px;padding:14px 0 20px;}
  .profile-name{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;margin-bottom:4px;}
  .profile-id{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:1px;}
  .disp-card{background:rgba(255,165,0,0.05);border:1px solid rgba(255,165,0,0.15);border-radius:14px;padding:16px;margin-bottom:12px;}
  .notif{position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#00ff88;color:#07070f;padding:12px 20px;border-radius:10px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;z-index:999;white-space:nowrap;animation:slideDown .3s ease;}
  .notif.err{background:#ff2d55;color:#fff;}
  .loading-overlay{position:fixed;inset:0;background:rgba(7,7,15,0.7);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);}
  .loading-dots{display:flex;gap:8px;}
  .loading-dots span{width:10px;height:10px;border-radius:50%;background:#00ff88;animation:dotBounce 1.2s infinite;}
  .loading-dots span:nth-child(2){animation-delay:.2s;}
  .loading-dots span:nth-child(3){animation-delay:.4s;}
  .empty{text-align:center;padding:40px 0;color:rgba(255,255,255,0.3);font-family:'IBM Plex Mono',monospace;font-size:13px;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes dotBounce{0%,80%,100%{transform:scale(0);opacity:.5}40%{transform:scale(1);opacity:1}}
`;

const Ava = ({ s = '', size = '', color = '' }) => (
  <div className={`ava ${size}`} style={color ? { background: color } : {}}>{s.slice(0, 2).toUpperCase()}</div>
);
const Badge = ({ type, label }) => (
  <span className={`badge badge-${type}`}>{type === 'live' && <span className="badge-dot" />}{label}</span>
);
const Loading = () => <div className="loading-overlay"><div className="loading-dots"><span /><span /><span /></div></div>;
const Empty = ({ msg }) => <div className="empty">{msg}</div>;

const Splash = () => (
  <div className="splash">
    <div className="splash-logo">StakeArena</div>
    <div className="splash-sub">Play. Stake. Win.</div>
    <div className="splash-bar" />
  </div>
);

function Auth({ onAuth, loading }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ username: '', email: '', password: '' });
  const set = k => e => setF({ ...f, [k]: e.target.value });
  return (
    <div className="auth">
      <div className="auth-hero">
        <div className="auth-logo">StakeArena</div>
        <div className="auth-tagline">Challenge. Stake. Claim Victory.</div>
      </div>
      <div className="auth-body">
        <div className="tabs">
          <button className={`tab ${mode === 'login' ? 'on' : ''}`} onClick={() => setMode('login')}>Login</button>
          <button className={`tab ${mode === 'register' ? 'on' : ''}`} onClick={() => setMode('register')}>Register</button>
        </div>
        {mode === 'register' && (
          <div className="field">
            <label className="flabel">Game Tag / Username</label>
            <input className="finput" placeholder="e.g. GoalKing_NG" value={f.username} onChange={set('username')} />
          </div>
        )}
        <div className="field">
          <label className="flabel">Email</label>
          <input className="finput" type="email" placeholder="Enter email" value={f.email} onChange={set('email')} />
        </div>
        <div className="field">
          <label className="flabel">Password</label>
          <input className="finput" type="password" placeholder="Min 6 characters" value={f.password} onChange={set('password')} />
        </div>
        <button className="btn-p" disabled={loading} onClick={() => onAuth(f.email, f.password, f.username, mode === 'register')}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login to Arena' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ profile, wallet, transactions, activeMatch, setScreen, onNav }) {
  const wr = profile ? Math.round((profile.wins / Math.max(profile.wins + profile.losses, 1)) * 100) : 0;
  const txIco = { win: '🏆', loss: '💔', deposit: '💰', withdrawal: '📤', stake: '⚔️', refund: '↩️' };
  return (
    <div className="page">
      <div className="profile-wrap">
        <Ava s={profile?.username || '?'} size="ava-lg" />
        <div>
          <div className="profile-name">{profile?.username || 'Loading...'}</div>
          <div className="profile-id">eFootball Player · StakeArena</div>
        </div>
      </div>
      <div className="gcard">
        <div className="wbal-label">Wallet Balance</div>
        <div className="wbal-amt">{fmt(wallet?.balance)}</div>
        <div className="wbal-row">
          <button className="wbal-btn wbal-dep" onClick={() => onNav('wallet')}>＋ Deposit</button>
          <button className="wbal-btn wbal-wit" onClick={() => onNav('wallet')}>↑ Withdraw</button>
        </div>
      </div>
      <div className="stats">
        <div className="stat"><div className="stat-val green">{profile?.wins || 0}</div><div className="stat-lbl">Wins</div></div>
        <div className="stat"><div className="stat-val red">{profile?.losses || 0}</div><div className="stat-lbl">Losses</div></div>
        <div className="stat"><div className="stat-val gold">{wr}%</div><div className="stat-lbl">Win Rate</div></div>
      </div>
      {activeMatch && (
        <div className="active-banner" onClick={() => setScreen('match-room')}>
          <span style={{ fontSize: 28 }}>⚽</span>
          <div className="ab-info">
            <div className="ab-title">Active Match · {fmt(activeMatch.stake_amount)}</div>
            <div className="ab-meta">Tap to open live match room</div>
          </div>
          <Badge type="live" label="LIVE" />
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { icon: '⚔️', label: 'Create Challenge', s: 'create' },
          { icon: '🔍', label: 'Browse Challenges', s: 'challenges' },
          { icon: '🏆', label: 'Leaderboard', s: 'leaderboard' },
          { icon: '💳', label: 'My Wallet', s: 'wallet' },
        ].map(a => (
          <button key={a.s} className="card" style={{ cursor: 'pointer', textAlign: 'center', border: 'none', background: 'rgba(255,255,255,0.04)' }} onClick={() => setScreen(a.s)}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{a.icon}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 700 }}>{a.label}</div>
          </button>
        ))}
      </div>
      <div className="sec-hdr">
        <div className="sec-title">Recent Activity</div>
        <div className="sec-link" onClick={() => onNav('wallet')}>See all →</div>
      </div>
      {transactions.length === 0 ? <div className="card"><Empty msg="No transactions yet" /></div> : (
        <div className="card" style={{ padding: '4px 16px' }}>
          {transactions.slice(0, 4).map(tx => (
            <div key={tx.id} className="tx-row">
              <div className={`tx-ico ${tx.type}`}>{txIco[tx.type] || '💸'}</div>
              <div className="tx-info">
                <div className="tx-desc">{tx.description}</div>
                <div className="tx-time">{ago(tx.created_at)}</div>
              </div>
              <div className={`tx-amt ${tx.amount > 0 ? 'pos' : 'neg'}`}>{tx.amount > 0 ? '+' : ''}{fmt(tx.amount)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Challenges({ token, userId, wallet, profile, setScreen, setActiveMatch, showNotif, onJoin }) {
  const [tab, setTab] = useState('browse');
  const [challenges, setChallenges] = useState([]);
  const [loadingC, setLoadingC] = useState(false);
  const [stake, setStake] = useState(2000);
  const [custom, setCustom] = useState('');
  const [creating, setCreating] = useState(false);
  const presets = [1000, 2000, 5000, 10000, 20000, 50000];

  useEffect(() => { if (tab === 'browse') loadC(); }, [tab]);

  const loadC = async () => {
    setLoadingC(true);
    try {
      const data = await db.get(`challenges?status=eq.open&select=id,stake_amount,room_code,created_at,creator_id,profiles!challenges_creator_id_fkey(username)&order=created_at.desc`, token);
      setChallenges(Array.isArray(data) ? data.filter(c => c.creator_id !== userId) : []);
    } catch (e) { showNotif('Failed to load challenges', 'err'); }
    finally { setLoadingC(false); }
  };

  const handleJoin = async (ch) => {
    if (!wallet || wallet.balance < ch.stake_amount) { showNotif('Insufficient balance! Deposit first.', 'err'); return; }
    await onJoin(ch);
    setActiveMatch(ch);
    setScreen('match-room');
  };

  const handleCreate = async () => {
    const amount = Number(custom) || stake;
    if (!wallet || wallet.balance < amount) { showNotif('Insufficient balance! Deposit first.', 'err'); return; }
    setCreating(true);
    try {
      const roomCode = gc();
      const newBal = wallet.balance - amount;
      await db.patch(`wallets?user_id=eq.${userId}`, token, { balance: newBal });
      const result = await db.post('challenges', token, { creator_id: userId, stake_amount: amount, room_code: roomCode, status: 'open' });
      await db.post('transactions', token, { user_id: userId, type: 'stake', amount: -amount, description: `Challenge created · Room ${roomCode}` });
      wallet.balance = newBal;
      const ch = Array.isArray(result) ? result[0] : result;
      setActiveMatch({ ...ch, creator_username: profile?.username });
      setScreen('match-room-create');
      showNotif('Challenge live! Share your room code.');
    } catch (e) { showNotif('Failed to create. Try again.', 'err'); }
    finally { setCreating(false); }
  };

  return (
    <div className="page">
      <div className="pg-title">Challenges</div>
      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${tab === 'browse' ? 'on' : ''}`} onClick={() => setTab('browse')}>Browse</button>
        <button className={`tab ${tab === 'create' ? 'on' : ''}`} onClick={() => setTab('create')}>Create</button>
      </div>
      {tab === 'browse' && (
        <>
          <div className="sec-hdr">
            <div className="sec-title">Open Challenges</div>
            <div className="sec-link" onClick={loadC}>↻ Refresh</div>
          </div>
          {loadingC ? <Empty msg="Loading..." /> : challenges.length === 0 ? <Empty msg="No open challenges yet. Create one!" /> :
            challenges.map(ch => (
              <div key={ch.id} className="ch-row">
                <Ava s={ch.profiles?.username || '?'} />
                <div className="ch-info">
                  <div className="ch-name">{ch.profiles?.username || 'Unknown'}</div>
                  <div className="ch-meta">1v1 · {ago(ch.created_at)}</div>
                </div>
                <div className="ch-stake">{fmt(ch.stake_amount)}</div>
                <button className="btn-g" onClick={() => handleJoin(ch)}>Join</button>
              </div>
            ))
          }
        </>
      )}
      {tab === 'create' && (
        <>
          <div className="pg-sub">Set Stake Amount</div>
          <div className="stake-grid">
            {presets.map(p => <div key={p} className={`stake-chip ${stake === p && !custom ? 'sel' : ''}`} onClick={() => { setStake(p); setCustom(''); }}>{fmt(p)}</div>)}
          </div>
          <div className="field" style={{ marginTop: 8 }}>
            <label className="flabel">Custom Amount</label>
            <input className="finput" type="number" placeholder="Enter amount e.g. 7500" value={custom} onChange={e => { setCustom(e.target.value); setStake(0); }} />
          </div>
          <div className="gcard" style={{ marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>YOU STAKE</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 800, color: '#ffd700' }}>{fmt(Number(custom) || stake)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>YOU WIN</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 800, color: '#00ff88' }}>{fmt((Number(custom) || stake) * 1.9)}</div>
              </div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>* Platform takes 5% commission</div>
          </div>
          <button className="btn-p" disabled={creating} onClick={handleCreate}>{creating ? 'Creating...' : '⚔️ Create Challenge'}</button>
        </>
      )}
    </div>
  );
}

function MatchRoomCreate({ token, activeMatch, setScreen, showNotif, setActiveMatch }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!activeMatch?.id) return;
    const poll = setInterval(async () => {
      try {
        const data = await db.get(`challenges?id=eq.${activeMatch.id}&select=status`, token);
        if (data[0]?.status === 'live') { clearInterval(poll); showNotif('Opponent joined! 🔥'); setScreen('match-room'); }
      } catch (e) {}
    }, 5000);
    return () => clearInterval(poll);
  }, [activeMatch?.id]);
  const copy = () => { if (navigator.clipboard) navigator.clipboard.writeText(activeMatch?.room_code || ''); setCopied(true); showNotif('Room code copied!'); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="page">
      <button className="back-btn" onClick={() => setScreen('challenges')}>← Back</button>
      <div className="pg-title">Challenge Created</div>
      <div className="roomcode-box">
        <div className="roomcode-label">Your Room Code</div>
        <div className="roomcode">{activeMatch?.room_code || '--------'}</div>
        <div className="roomcode-copy" onClick={copy}>{copied ? '✓ Copied!' : 'tap to copy'}</div>
      </div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Stake Amount</span>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 700, color: '#ffd700' }}>{fmt(activeMatch?.stake_amount)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Status</span>
          <Badge type="wait" label="Waiting for opponent" />
        </div>
      </div>
      <div className="card" style={{ background: 'rgba(0,255,136,0.04)', borderColor: 'rgba(0,255,136,0.1)' }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.9 }}>
          📋 Share this room code with your opponent<br />
          ⚽ Use code in eFootball to start match<br />
          📸 Screenshot final score when done<br />
          ⚠️ Disconnecting mid-game = forfeit
        </div>
      </div>
      <button className="btn-p" onClick={() => setScreen('match-room')}>▶ Open Match Room</button>
    </div>
  );
}

function MatchRoom({ token, userId, profile, activeMatch, setScreen, showNotif }) {
  const [match, setMatch] = useState(activeMatch || {});
  const [elapsed, setElapsed] = useState(0);
  const [ended, setEnded] = useState(false);
  const isCreator = userId === match.creator_id;

  useEffect(() => { if (ended) return; const t = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(t); }, [ended]);
  useEffect(() => {
    if (!match.id) return;
    const poll = setInterval(async () => {
      try { const data = await db.get(`challenges?id=eq.${match.id}&select=*`, token); if (data[0]) setMatch(data[0]); } catch (e) {}
    }, 4000);
    return () => clearInterval(poll);
  }, [match.id]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');
  const myScore = isCreator ? match.creator_score || 0 : match.opponent_score || 0;
  const oppScore = isCreator ? match.opponent_score || 0 : match.creator_score || 0;
  const oppName = isCreator ? (match.opponent_username || 'Opponent') : (match.creator_username || 'Creator');

  const updateScore = async (side, delta) => {
    const field = side === 'me' ? (isCreator ? 'creator_score' : 'opponent_score') : (isCreator ? 'opponent_score' : 'creator_score');
    const newVal = Math.max(0, (match[field] || 0) + delta);
    const update = { [field]: newVal, updated_at: new Date().toISOString() };
    setMatch(prev => ({ ...prev, ...update }));
    try { await db.patch(`challenges?id=eq.${match.id}`, token, update); } catch (e) {}
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => setScreen('dashboard')}>← Dashboard</button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div className="pg-title" style={{ margin: 0 }}>Live Match</div>
        {!ended ? <Badge type="live" label={`${mins}:${secs}`} /> : <Badge type="done" label="FT" />}
      </div>
      <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#ffd700', marginBottom: 4 }}>
        Stake: {fmt(match.stake_amount)} · Win: {fmt((match.stake_amount || 0) * 1.9)}
      </div>
      <div className="match-vs">
        <div className="match-player">
          <Ava s={profile?.username || 'Me'} size="ava-lg" />
          <div className="match-pname">{profile?.username || 'You'}</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>YOU</div>
        </div>
        <div className="match-vstext">VS</div>
        <div className="match-player">
          <Ava s={oppName} size="ava-lg" color="linear-gradient(135deg,#ff6b35,#ff2d55)" />
          <div className="match-pname">{oppName}</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>OPP</div>
        </div>
      </div>
      <div className="score-box">
        <div className="score-side">
          <div className="score-num" style={{ color: myScore > oppScore ? '#00ff88' : '#fff' }}>{myScore}</div>
          <div className="score-ctrl">
            <button className="sc-btn sc-plus" onClick={() => updateScore('me', 1)} disabled={ended}>+</button>
            <button className="sc-btn sc-minus" onClick={() => updateScore('me', -1)} disabled={ended}>−</button>
          </div>
        </div>
        <div className="score-divider" />
        <div className="score-side">
          <div className="score-num" style={{ color: oppScore > myScore ? '#ff2d55' : '#fff' }}>{oppScore}</div>
          <div className="score-ctrl">
            <button className="sc-btn sc-plus" onClick={() => updateScore('opp', 1)} disabled={ended}>+</button>
            <button className="sc-btn sc-minus" onClick={() => updateScore('opp', -1)} disabled={ended}>−</button>
          </div>
        </div>
      </div>
      {!ended ? (
        <button className="btn-p" style={{ background: 'linear-gradient(135deg,#ff6b35,#ff2d55)', color: '#fff' }} onClick={() => setEnded(true)}>🏁 End Match</button>
      ) : (
        <>
          <button className="btn-p" onClick={() => setScreen('submit-result')}>📸 Submit Screenshot Result</button>
          <button className="btn-r" style={{ width: '100%', marginTop: 8 }} onClick={() => setScreen('dispute')}>⚠️ Raise Dispute</button>
        </>
      )}
    </div>
  );
}

function SubmitResult({ token, userId, activeMatch, setScreen, showNotif, onSubmit }) {
  const [uploaded, setUploaded] = useState(false);
  const [winner, setWinner] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const match = activeMatch || {};
  const isCreator = userId === match.creator_id;
  const myId = isCreator ? match.creator_id : match.opponent_id;
  const oppId = isCreator ? match.opponent_id : match.creator_id;
  const myName = match.creator_username || 'You';
  const oppName = match.opponent_username || 'Opponent';

  const submit = async () => {
    if (!uploaded) { showNotif('Upload screenshot first', 'err'); return; }
    if (!winner) { showNotif('Select who won', 'err'); return; }
    setSubmitting(true);
    try {
      const winnerId = winner === 'me' ? myId : oppId;
      const res = await db.rpc('claim_win', token, { p_challenge_id: match.id, p_winner_id: winnerId });
      if (res?.error) { showNotif('Submit failed. Admin will review.', 'err'); }
      else { showNotif(winner === 'me' ? `🏆 You won ${fmt(res.payout)}!` : 'Result submitted.'); }
      await onSubmit();
      setScreen('dashboard');
    } catch (e) { showNotif('Result submitted. Admin will verify.'); setScreen('dashboard'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => setScreen('match-room')}>← Back</button>
      <div className="pg-title">Submit Result</div>
      <div className="card">
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Room Code</div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 22, color: '#00ff88', letterSpacing: 4 }}>{match.room_code || 'N/A'}</div>
      </div>
      <div className="pg-sub">Upload Match Screenshot</div>
      <div className={`upload-zone ${uploaded ? 'done' : ''}`} onClick={() => { setUploaded(true); showNotif('Screenshot attached!'); }}>
        <div className="upload-ico">{uploaded ? '✅' : '📸'}</div>
        <div className="upload-text">{uploaded ? 'Screenshot attached' : 'Tap to attach final score screenshot'}</div>
      </div>
      <div className="pg-sub">Who Won?</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[{ id: 'me', label: `${myName} (Me)` }, { id: 'opp', label: oppName }].map(p => (
          <button key={p.id} className="card"
            style={{ flex: 1, cursor: 'pointer', textAlign: 'center', borderColor: winner === p.id ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.07)', background: winner === p.id ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.04)' }}
            onClick={() => setWinner(p.id)}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 700 }}>{p.label}</div>
          </button>
        ))}
      </div>
      <button className="btn-p" disabled={submitting} onClick={submit}>{submitting ? 'Submitting...' : 'Submit Result'}</button>
    </div>
  );
}

function Dispute({ token, userId, activeMatch, setScreen, showNotif }) {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const match = activeMatch || {};
  const submit = async () => {
    if (!reason) { showNotif('Select a reason', 'err'); return; }
    try {
      await db.post('disputes', token, { challenge_id: match.id, raised_by: userId, reason });
      await db.patch(`challenges?id=eq.${match.id}`, token, { status: 'disputed' });
      setSubmitted(true); showNotif('Dispute filed!');
    } catch (e) { showNotif('Failed to submit dispute', 'err'); }
  };
  if (submitted) return (
    <div className="page">
      <div className="gcard" style={{ textAlign: 'center', padding: 40, marginTop: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Dispute Filed</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Admin will review within 24 hours. Funds frozen until resolved.</div>
        <button className="btn-g" onClick={() => setScreen('dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );
  return (
    <div className="page">
      <button className="back-btn" onClick={() => setScreen('match-room')}>← Back</button>
      <div className="pg-title">Raise Dispute</div>
      <div className="field">
        <label className="flabel">Reason</label>
        <select className="finput" value={reason} onChange={e => setReason(e.target.value)}>
          <option value="">Select a reason</option>
          <option>Opponent claims wrong score</option>
          <option>Opponent disconnected intentionally</option>
          <option>Match never started</option>
          <option>Screenshot appears edited</option>
          <option>Other</option>
        </select>
      </div>
      <button className="btn-p" onClick={submit}>Submit Dispute</button>
    </div>
  );
}

function Leaderboard({ token, userId }) {
  const [board, setBoard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  useEffect(() => {
    db.get('profiles?select=id,username,wins,losses,total_earned&order=wins.desc&limit=10', token)
      .then(data => { if (Array.isArray(data)) { setBoard(data); const i = data.findIndex(p => p.id === userId); if (i >= 0) setMyRank(i + 1); } }).catch(() => {});
  }, []);
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div className="page">
      <div className="pg-title">🏆 Leaderboard</div>
      {myRank && (
        <div className="card" style={{ background: 'linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,165,0,0.04))', borderColor: 'rgba(255,215,0,0.2)', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: 2 }}>YOUR RANK</div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 52, fontWeight: 900, color: '#ffd700', lineHeight: 1 }}>#{myRank}</div>
        </div>
      )}
      {board.length === 0 ? <Empty msg="No players yet. Be the first!" /> :
        board.map((p, i) => {
          const wr = Math.round(p.wins / Math.max(p.wins + p.losses, 1) * 100);
          return (
            <div key={p.id} className={`lb-row ${p.id === userId ? 'me' : ''}`}>
              <div className="lb-rank" style={{ color: i < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][i] : 'rgba(255,255,255,0.3)' }}>{i < 3 ? medals[i] : `#${i + 1}`}</div>
              <Ava s={p.username} color={p.id === userId ? undefined : 'linear-gradient(135deg,#333,#555)'} />
              <div style={{ flex: 1 }}>
                <div className="lb-name">{p.username}{p.id === userId ? ' (You)' : ''}</div>
                <div className="lb-rec">{p.wins}W · {p.losses}L · {wr}% WR</div>
              </div>
              <div className="lb-earn">{fmt(p.total_earned)}</div>
            </div>
          );
        })
      }
    </div>
  );
}

function Wallet({ token, userId, wallet, onDeposit, onWithdraw }) {
  const [tab, setTab] = useState('history');
  const [txs, setTxs] = useState([]);
  const [depAmt, setDepAmt] = useState('');
  const [witAmt, setWitAmt] = useState('');
  const [bank, setBank] = useState('GTBank');
  const [acct, setAcct] = useState('');
  const presets = [1000, 2000, 5000, 10000, 20000, 50000];
  const txIco = { win: '🏆', loss: '💔', deposit: '💰', withdrawal: '📤', stake: '⚔️', refund: '↩️' };
  useEffect(() => {
    if (tab === 'history') db.get(`transactions?user_id=eq.${userId}&order=created_at.desc&limit=30`, token).then(d => { if (Array.isArray(d)) setTxs(d); }).catch(() => {});
  }, [tab]);
  return (
    <div className="page">
      <div className="pg-title">💳 Wallet</div>
      <div className="gcard">
        <div className="wbal-label">Total Balance</div>
        <div className="wbal-amt">{fmt(wallet?.balance)}</div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Live · synced with Supabase</div>
      </div>
      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${tab === 'deposit' ? 'on' : ''}`} onClick={() => setTab('deposit')}>Deposit</button>
        <button className={`tab ${tab === 'withdraw' ? 'on' : ''}`} onClick={() => setTab('withdraw')}>Withdraw</button>
        <button className={`tab ${tab === 'history' ? 'on' : ''}`} onClick={() => setTab('history')}>History</button>
      </div>
      {tab === 'deposit' && (
        <>
          <div className="stake-grid">{presets.map(p => <div key={p} className={`stake-chip ${depAmt == p ? 'sel' : ''}`} onClick={() => setDepAmt(p)}>{fmt(p)}</div>)}</div>
          <div className="field" style={{ marginTop: 8 }}>
            <label className="flabel">Custom Amount</label>
            <input className="finput" type="number" placeholder="Enter amount (₦)" value={depAmt} onChange={e => setDepAmt(e.target.value)} />
          </div>
          <div className="card" style={{ background: 'rgba(0,255,136,0.04)', borderColor: 'rgba(0,255,136,0.1)' }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
              💡 Demo mode: funds added instantly<br />🔜 Paystack integration coming next
            </div>
          </div>
          <button className="btn-p" disabled={!depAmt} onClick={() => onDeposit(depAmt)}>Deposit {depAmt ? fmt(depAmt) : ''}</button>
        </>
      )}
      {tab === 'withdraw' && (
        <>
          <div className="field"><label className="flabel">Amount</label><input className="finput" type="number" placeholder="Enter amount" value={witAmt} onChange={e => setWitAmt(e.target.value)} /></div>
          <div className="field">
            <label className="flabel">Bank Name</label>
            <select className="finput" value={bank} onChange={e => setBank(e.target.value)}>
              {['GTBank','Access Bank','First Bank','Zenith Bank','UBA','Opay','Palmpay','Kuda'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="field"><label className="flabel">Account Number</label><input className="finput" type="number" placeholder="10-digit account number" value={acct} onChange={e => setAcct(e.target.value)} /></div>
          <button className="btn-p" disabled={!witAmt || !acct} onClick={() => onWithdraw(witAmt, bank, acct)}>Request Withdrawal</button>
        </>
      )}
      {tab === 'history' && (
        txs.length === 0 ? <Empty msg="No transactions yet" /> :
          <div className="card" style={{ padding: '4px 16px' }}>
            {txs.map(tx => (
              <div key={tx.id} className="tx-row">
                <div className={`tx-ico ${tx.type}`}>{txIco[tx.type] || '💸'}</div>
                <div className="tx-info"><div className="tx-desc">{tx.description}</div><div className="tx-time">{ago(tx.created_at)}</div></div>
                <div className={`tx-amt ${tx.amount > 0 ? 'pos' : 'neg'}`}>{tx.amount > 0 ? '+' : ''}{fmt(tx.amount)}</div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

function Admin({ token, showNotif }) {
  const [tab, setTab] = useState('disputes');
  const [disputes, setDisputes] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({ vol: 0, matches: 0 });
  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const [d, w, ch] = await Promise.all([
        db.get('disputes?status=eq.pending&select=*,profiles!disputes_raised_by_fkey(username),challenges(id,stake_amount,room_code,creator_id,opponent_id,profiles!challenges_creator_id_fkey(username))&order=created_at.desc', token),
        db.get('withdrawal_requests?status=eq.pending&select=*,profiles(username)&order=created_at.desc', token),
        db.get('challenges?select=stake_amount', token),
      ]);
      if (Array.isArray(d)) setDisputes(d);
      if (Array.isArray(w)) setWithdrawals(w);
      if (Array.isArray(ch)) setStats({ vol: ch.reduce((s, c) => s + (c.stake_amount || 0) * 2, 0), matches: ch.length });
    } catch (e) {}
  };
  const resolveDispute = async (d, winnerId, winnerName) => {
    try {
      await db.rpc('admin_resolve_dispute', token, { p_dispute_id: d.id, p_challenge_id: d.challenges?.id || d.challenge_id, p_winner_id: winnerId });
      setDisputes(prev => prev.filter(x => x.id !== d.id)); showNotif(`Resolved → ${winnerName} wins 🏆`);
    } catch (e) { showNotif('Failed to resolve', 'err'); }
  };
  const approveWd = async (wd) => {
    try { await db.patch(`withdrawal_requests?id=eq.${wd.id}`, token, { status: 'approved' }); setWithdrawals(prev => prev.filter(x => x.id !== wd.id)); showNotif('Approved!'); }
    catch (e) { showNotif('Failed', 'err'); }
  };
  const rejectWd = async (wd) => {
    try {
      await db.patch(`withdrawal_requests?id=eq.${wd.id}`, token, { status: 'rejected' });
      const ownerW = await db.get(`wallets?user_id=eq.${wd.user_id}&select=balance`, token);
      if (ownerW[0]) await db.patch(`wallets?user_id=eq.${wd.user_id}`, token, { balance: ownerW[0].balance + wd.amount });
      setWithdrawals(prev => prev.filter(x => x.id !== wd.id)); showNotif('Rejected & refunded');
    } catch (e) { showNotif('Failed', 'err'); }
  };
  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div className="pg-title" style={{ margin: 0 }}>Admin Panel</div>
        <Badge type="live" label="ADMIN" />
      </div>
      <div className="stats" style={{ marginBottom: 18 }}>
        <div className="stat"><div className="stat-val gold" style={{ fontSize: 16 }}>{fmt(stats.vol)}</div><div className="stat-lbl">Volume</div></div>
        <div className="stat"><div className="stat-val green">{stats.matches}</div><div className="stat-lbl">Matches</div></div>
        <div className="stat"><div className="stat-val red">{disputes.length}</div><div className="stat-lbl">Disputes</div></div>
      </div>
      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${tab === 'disputes' ? 'on' : ''}`} onClick={() => setTab('disputes')}>Disputes ({disputes.length})</button>
        <button className={`tab ${tab === 'withdrawals' ? 'on' : ''}`} onClick={() => setTab('withdrawals')}>Withdrawals ({withdrawals.length})</button>
      </div>
      {tab === 'disputes' && (disputes.length === 0 ? <Empty msg="✅ No pending disputes" /> :
        disputes.map(d => {
          const ch = d.challenges || {};
          return (
            <div key={d.id} className="disp-card">
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 4 }}>⚠️ {d.reason}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Room: {ch.room_code} · Stake: {fmt(ch.stake_amount)}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-g" style={{ flex: 1, fontSize: 13 }} onClick={() => resolveDispute(d, ch.creator_id, ch.profiles?.username || 'Player 1')}>{ch.profiles?.username || 'P1'} Wins</button>
                <button className="btn-g" style={{ flex: 1, fontSize: 13, background: 'linear-gradient(135deg,#ff6b35,#ff2d55)', color: '#fff' }} onClick={() => resolveDispute(d, ch.opponent_id, 'Player 2')}>P2 Wins</button>
              </div>
            </div>
          );
        })
      )}
      {tab === 'withdrawals' && (withdrawals.length === 0 ? <Empty msg="✅ No pending withdrawals" /> :
        withdrawals.map(wd => (
          <div key={wd.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Ava s={wd.profiles?.username || '?'} />
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 17, fontWeight: 700 }}>{wd.profiles?.username}</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{wd.bank_name} · {wd.account_number}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 800, color: '#ffd700' }}>{fmt(wd.amount)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-g" style={{ flex: 1 }} onClick={() => approveWd(wd)}>Approve</button>
              <button className="btn-r" style={{ flex: 1 }} onClick={() => rejectWd(wd)}>Reject & Refund</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function StakeArena() {
  const [screen, setScreen] = useState('splash');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [activeNav, setActiveNav] = useState('home');
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = userEmail?.includes('admin');
  const showNotif = (msg, type = 'success') => { setNotif({ msg, type }); setTimeout(() => setNotif(null), 2800); };

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sa_session') : null;
    if (saved) {
      try {
        const { token: t, userId: u, email: e } = JSON.parse(saved);
        setToken(t); setUserId(u); setUserEmail(e);
        loadUserData(u, t).then(() => setScreen('dashboard'));
      } catch { setTimeout(() => setScreen('auth'), 2600); }
    } else { setTimeout(() => setScreen('auth'), 2600); }
  }, []);

  const loadUserData = useCallback(async (uid, tok) => {
    try {
      const [p, w, tx] = await Promise.all([
        db.get(`profiles?id=eq.${uid}&select=*`, tok),
        db.get(`wallets?user_id=eq.${uid}&select=*`, tok),
        db.get(`transactions?user_id=eq.${uid}&order=created_at.desc&limit=10`, tok),
      ]);
      if (p[0]) setProfile(p[0]);
      if (w[0]) setWallet(w[0]);
      if (Array.isArray(tx)) setTransactions(tx);
    } catch (e) { console.error(e); }
  }, []);

  const handleAuth = async (email, password, username, isSignUp) => {
    setLoading(true);
    try {
      const data = isSignUp ? await db.signup(email, password, username) : await db.signin(email, password);
      if (data.error || data.msg) { showNotif(data.error?.message || data.msg || 'Auth failed', 'err'); return; }
      const tok = data.access_token;
      const uid = data.user?.id;
      const em = data.user?.email;
      if (typeof window !== 'undefined') localStorage.setItem('sa_session', JSON.stringify({ token: tok, userId: uid, email: em }));
      setToken(tok); setUserId(uid); setUserEmail(em);
      await loadUserData(uid, tok);
      setScreen('dashboard'); setActiveNav('home');
      showNotif(isSignUp ? 'Account created! Welcome 🎉' : 'Welcome back!');
    } catch (e) { showNotif('Connection error. Try again.', 'err'); }
    finally { setLoading(false); }
  };

  const nav = (to) => {
    setActiveNav(to);
    setScreen(to === 'home' ? 'dashboard' : to);
    if (to === 'home') loadUserData(userId, token);
  };

  const handleDeposit = async (amount) => {
    setLoading(true);
    try {
      const newBal = (wallet?.balance || 0) + Number(amount);
      await db.patch(`wallets?user_id=eq.${userId}`, token, { balance: newBal });
      await db.post('transactions', token, { user_id: userId, type: 'deposit', amount: Number(amount), description: 'Wallet top-up' });
      setWallet(prev => ({ ...prev, balance: newBal }));
      showNotif(`${fmt(amount)} added! ✅`);
    } catch (e) { showNotif('Deposit failed', 'err'); }
    finally { setLoading(false); }
  };

  const handleWithdraw = async (amount, bank, acct) => {
    if ((wallet?.balance || 0) < Number(amount)) { showNotif('Insufficient balance!', 'err'); return; }
    setLoading(true);
    try {
      const newBal = wallet.balance - Number(amount);
      await db.patch(`wallets?user_id=eq.${userId}`, token, { balance: newBal });
      await db.post('withdrawal_requests', token, { user_id: userId, amount: Number(amount), bank_name: bank, account_number: acct });
      await db.post('transactions', token, { user_id: userId, type: 'withdrawal', amount: -Number(amount), description: `Withdrawal to ${bank}`, status: 'pending' });
      setWallet(prev => ({ ...prev, balance: newBal }));
      showNotif('Withdrawal request submitted!');
    } catch (e) { showNotif('Withdrawal failed', 'err'); }
    finally { setLoading(false); }
  };

  const handleJoinChallenge = async (ch) => {
    if (!wallet || wallet.balance < ch.stake_amount) { showNotif('Insufficient balance!', 'err'); return; }
    setLoading(true);
    try {
      const newBal = wallet.balance - ch.stake_amount;
      await db.patch(`wallets?user_id=eq.${userId}`, token, { balance: newBal });
      await db.patch(`challenges?id=eq.${ch.id}`, token, { opponent_id: userId, status: 'live' });
      await db.post('transactions', token, { user_id: userId, type: 'stake', amount: -ch.stake_amount, description: `Joined challenge · Room ${ch.room_code}` });
      setWallet(prev => ({ ...prev, balance: newBal }));
      setActiveMatch({ ...ch, opponent_id: userId });
    } catch (e) { showNotif('Failed to join', 'err'); }
    finally { setLoading(false); }
  };

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'challenges', icon: '⚔️', label: 'Challenges' },
    { id: 'leaderboard', icon: '🏆', label: 'Rankings' },
    { id: 'wallet', icon: '💳', label: 'Wallet' },
    ...(isAdmin ? [{ id: 'admin', icon: '🛡️', label: 'Admin' }] : []),
  ];

  const showNav = token && !['splash', 'auth'].includes(screen);
  const shared = { token, userId, profile, wallet, transactions, activeMatch, setScreen, setActiveMatch, showNotif };

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <Splash />;
      case 'auth': return <Auth onAuth={handleAuth} loading={loading} />;
      case 'dashboard': return <Dashboard {...shared} onNav={nav} />;
      case 'challenges': return <Challenges {...shared} onJoin={handleJoinChallenge} />;
      case 'create': return <Challenges {...shared} onJoin={handleJoinChallenge} />;
      case 'match-room-create': return <MatchRoomCreate {...shared} />;
      case 'match-room': return <MatchRoom {...shared} />;
      case 'submit-result': return <SubmitResult {...shared} onSubmit={() => loadUserData(userId, token)} />;
      case 'dispute': return <Dispute {...shared} />;
      case 'leaderboard': return <Leaderboard token={token} userId={userId} />;
      case 'wallet': return <Wallet {...shared} onDeposit={handleDeposit} onWithdraw={handleWithdraw} />;
      case 'admin': return <Admin token={token} showNotif={showNotif} />;
      default: return <Dashboard {...shared} onNav={nav} />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="sa">
        <div className="sa-grid" />
        <div className="z">
          {loading && <Loading />}
          {notif && <div className={`notif ${notif.type === 'err' ? 'err' : ''}`}>{notif.msg}</div>}
          {showNav && (
            <div className="hdr">
              <div className="hdr-logo">StakeArena</div>
              <div className="hdr-right">
                <div className="hdr-badge">{fmt(wallet?.balance)}</div>
                <Ava s={profile?.username || '?'} />
              </div>
            </div>
          )}
          {renderScreen()}
          {showNav && (
            <div className="bnav">
              {navItems.map(n => (
                <div key={n.id} className={`ni ${activeNav === n.id ? 'on' : ''}`} onClick={() => nav(n.id)}>
                  <span className="ni-ico">{n.icon}</span>
                  <span className="ni-lbl">{n.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
