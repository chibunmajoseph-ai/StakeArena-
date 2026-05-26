import { useState, useEffect } from "react";

// ============ MOCK DATA ============
const MOCK_USER = {
  id: "usr_001", username: "GoalKing_NG", avatar: "GK",
  balance: 45750, wins: 23, losses: 7,
  totalStaked: 380000, totalEarned: 412500,
};
const MOCK_CHALLENGES = [
  { id: "ch_001", creator: "SoccerMaestro", avatar: "SM", stake: 2000, status: "open", time: "2m ago", mode: "1v1" },
  { id: "ch_002", creator: "FootballKing99", avatar: "FK", stake: 5000, status: "open", time: "5m ago", mode: "1v1" },
  { id: "ch_003", creator: "eFootPro", avatar: "EP", stake: 1000, status: "open", time: "12m ago", mode: "1v1" },
  { id: "ch_004", creator: "PremierPlayer", avatar: "PP", stake: 10000, status: "open", time: "18m ago", mode: "1v1" },
  { id: "ch_005", creator: "StrikerBoss", avatar: "SB", stake: 3000, status: "open", time: "25m ago", mode: "1v1" },
];
const MOCK_LEADERBOARD = [
  { rank: 1, username: "EliteStriker", avatar: "ES", wins: 47, losses: 5, earnings: 892000 },
  { rank: 2, username: "GoalKing_NG", avatar: "GK", wins: 23, losses: 7, earnings: 412500 },
  { rank: 3, username: "SoccerMaestro", avatar: "SM", wins: 19, losses: 9, earnings: 287000 },
  { rank: 4, username: "FootballKing99", avatar: "FK", wins: 15, losses: 11, earnings: 198000 },
  { rank: 5, username: "eFootPro", avatar: "EP", wins: 12, losses: 6, earnings: 156500 },
  { rank: 6, username: "StrikerBoss", avatar: "SB", wins: 10, losses: 8, earnings: 98000 },
  { rank: 7, username: "PremierPlayer", avatar: "PP", wins: 8, losses: 12, earnings: 64000 },
];
const MOCK_TRANSACTIONS = [
  { id: "tx_001", type: "win", amount: 9500, desc: "Won vs SoccerMaestro", time: "Today, 2:30 PM" },
  { id: "tx_002", type: "loss", amount: -5000, desc: "Lost vs FootballKing99", time: "Today, 11:15 AM" },
  { id: "tx_003", type: "deposit", amount: 20000, desc: "Wallet top-up", time: "Yesterday" },
  { id: "tx_004", type: "win", amount: 4750, desc: "Won vs eFootPro", time: "Yesterday" },
  { id: "tx_005", type: "withdrawal", amount: -15000, desc: "Withdrawal to GTBank", time: "2 days ago" },
];
const MOCK_DISPUTES = [
  { id: "dp_001", player1: "GoalKing_NG", p1a: "GK", player2: "SoccerMaestro", p2a: "SM", stake: 4000, reason: "Both players claim win", time: "1h ago", status: "pending" },
  { id: "dp_002", player1: "eFootPro", p1a: "EP", player2: "PremierPlayer", p2a: "PP", stake: 8000, reason: "Screenshot mismatch", time: "3h ago", status: "pending" },
];
const MOCK_WITHDRAWALS = [
  { id: "wd_001", username: "SoccerMaestro", amount: 25000, bank: "Access Bank", time: "30m ago", status: "pending" },
  { id: "wd_002", username: "StrikerBoss", amount: 10000, bank: "GTBank", time: "2h ago", status: "pending" },
];

const fmt = (n) => `₦${Number(n).toLocaleString()}`;
const genCode = () => {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => c[Math.floor(Math.random() * c.length)]).join("");
};

// ============ STYLES ============
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=Barlow:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#07070f;color:#fff;font-family:'Barlow',sans-serif;}
  input,button,select,textarea{font-family:'Barlow',sans-serif;}
  .sa{max-width:430px;margin:0 auto;min-height:100vh;background:#07070f;position:relative;}
  .sa-grid{position:fixed;inset:0;background-image:linear-gradient(rgba(0,255,136,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.025) 1px,transparent 1px);background-size:36px 36px;pointer-events:none;z-index:0;}
  .sa-z{position:relative;z-index:1;}

  /* SPLASH */
  .splash{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:12px;animation:fadeIn .6s ease;}
  .splash-logo{font-family:'Barlow Condensed',sans-serif;font-size:62px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;letter-spacing:-1px;}
  .splash-sub{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:4px;color:rgba(255,255,255,0.3);text-transform:uppercase;}
  .splash-bar{width:60px;height:2px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:40px;overflow:hidden;}
  .splash-bar::after{content:'';display:block;height:100%;background:linear-gradient(90deg,#00ff88,#00ccff);animation:loadBar 2.2s ease forwards;}
  @keyframes loadBar{from{width:0}to{width:100%}}

  /* AUTH */
  .auth{min-height:100vh;display:flex;flex-direction:column;animation:fadeIn .4s ease;}
  .auth-hero{background:linear-gradient(160deg,#0a1a10 0%,#07070f 70%);padding:56px 24px 40px;text-align:center;position:relative;overflow:hidden;}
  .auth-hero::before{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:220px;height:220px;background:radial-gradient(circle,rgba(0,255,136,0.12) 0%,transparent 70%);pointer-events:none;}
  .auth-logo{font-family:'Barlow Condensed',sans-serif;font-size:48px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:6px;}
  .auth-tagline{font-size:13px;color:rgba(255,255,255,0.4);letter-spacing:.3px;}
  .auth-body{flex:1;background:#0c0c18;border-radius:24px 24px 0 0;padding:28px 24px 40px;margin-top:-16px;}
  .tabs{display:flex;background:rgba(255,255,255,0.05);border-radius:10px;padding:4px;margin-bottom:24px;}
  .tab{flex:1;padding:10px;border-radius:7px;border:none;background:transparent;color:rgba(255,255,255,0.4);font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;cursor:pointer;text-transform:uppercase;transition:all .2s;}
  .tab.on{background:#00ff88;color:#07070f;}
  .field{margin-bottom:14px;}
  .flabel{display:block;font-size:10px;font-weight:600;letter-spacing:1.5px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-bottom:7px;font-family:'IBM Plex Mono',monospace;}
  .finput{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:13px 15px;color:#fff;font-size:15px;outline:none;transition:border-color .2s;}
  .finput:focus{border-color:rgba(0,255,136,0.5);}
  .finput::placeholder{color:rgba(255,255,255,0.2);}
  .btn-p{width:100%;background:linear-gradient(135deg,#00ff88,#00ccaa);border:none;border-radius:12px;padding:16px;color:#07070f;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;margin-top:6px;transition:opacity .2s,transform .1s;}
  .btn-p:active{opacity:.85;transform:scale(.99);}
  .btn-s{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:13px 20px;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;}
  .btn-g{background:linear-gradient(135deg,#00ff88,#00ccaa);border:none;border-radius:10px;padding:13px 20px;color:#07070f;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:opacity .2s;}
  .btn-g:active{opacity:.8;}
  .btn-r{background:rgba(255,45,85,0.12);border:1px solid rgba(255,45,85,0.25);border-radius:10px;padding:12px 16px;color:#ff2d55;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:.5px;cursor:pointer;}

  /* HEADER */
  .hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:rgba(7,7,15,0.92);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(255,255,255,0.05);}
  .hdr-logo{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .hdr-right{display:flex;align-items:center;gap:10px;}
  .hdr-badge{background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.2);border-radius:8px;padding:6px 10px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#00ff88;font-weight:600;}
  .ava{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#00ff88,#00ccff);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;color:#07070f;flex-shrink:0;}
  .ava-sm{width:28px;height:28px;font-size:10px;}
  .ava-lg{width:48px;height:48px;font-size:16px;}

  /* NAV */
  .bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:rgba(8,8,18,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.06);display:flex;padding:10px 0 18px;z-index:100;}
  .ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:4px 0;}
  .ni-ico{font-size:20px;line-height:1;}
  .ni-lbl{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.3px;color:rgba(255,255,255,0.25);text-transform:uppercase;transition:color .2s;}
  .ni.on .ni-lbl{color:#00ff88;}
  .ni.on .ni-ico{filter:drop-shadow(0 0 5px rgba(0,255,136,0.7));}

  /* PAGE */
  .page{padding:18px 18px 100px;animation:slideUp .3s ease;}
  .pg-title{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;letter-spacing:.5px;margin-bottom:18px;}
  .pg-sub{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;letter-spacing:.3px;margin-bottom:14px;color:rgba(255,255,255,0.85);}

  /* CARDS */
  .card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:18px;margin-bottom:14px;}
  .gcard{background:linear-gradient(135deg,rgba(0,255,136,0.08),rgba(0,204,255,0.04));border:1px solid rgba(0,255,136,0.18);border-radius:20px;padding:22px;margin-bottom:16px;position:relative;overflow:hidden;}
  .gcard::before{content:'';position:absolute;top:-30px;right:-30px;width:100px;height:100px;background:radial-gradient(circle,rgba(0,255,136,0.15) 0%,transparent 70%);pointer-events:none;}

  /* WALLET CARD */
  .wbal-label{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:8px;}
  .wbal-amt{font-family:'Barlow Condensed',sans-serif;font-size:44px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:18px;}
  .wbal-row{display:flex;gap:10px;}
  .wbal-btn{flex:1;padding:11px;border-radius:10px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;}
  .wbal-dep{background:linear-gradient(135deg,#00ff88,#00ccaa);color:#07070f;}
  .wbal-wit{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12)!important;color:#fff;}

  /* STATS ROW */
  .stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;}
  .stat{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 10px;text-align:center;}
  .stat-val{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800;line-height:1;margin-bottom:4px;}
  .stat-lbl{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1px;color:rgba(255,255,255,0.35);text-transform:uppercase;}
  .stat-val.green{color:#00ff88;}
  .stat-val.red{color:#ff2d55;}
  .stat-val.gold{color:#ffd700;}

  /* CHALLENGE ROW */
  .ch-row{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px;margin-bottom:10px;}
  .ch-info{flex:1;}
  .ch-name{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;margin-bottom:2px;}
  .ch-meta{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.35);}
  .ch-stake{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#ffd700;margin-right:10px;white-space:nowrap;}

  /* TX ROW */
  .tx-row{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .tx-ico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .tx-ico.win{background:rgba(0,255,136,0.12);}
  .tx-ico.loss{background:rgba(255,45,85,0.12);}
  .tx-ico.deposit{background:rgba(0,204,255,0.12);}
  .tx-ico.withdrawal{background:rgba(255,165,0,0.12);}
  .tx-info{flex:1;}
  .tx-desc{font-size:14px;font-weight:500;margin-bottom:2px;}
  .tx-time{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.3);}
  .tx-amt{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;white-space:nowrap;}
  .tx-amt.pos{color:#00ff88;}
  .tx-amt.neg{color:#ff2d55;}

  /* LEADERBOARD */
  .lb-row{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px;margin-bottom:10px;}
  .lb-row.me{background:rgba(0,255,136,0.07);border-color:rgba(0,255,136,0.2);}
  .lb-rank{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;width:28px;text-align:center;flex-shrink:0;}
  .lb-name{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;margin-bottom:2px;}
  .lb-rec{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.35);}
  .lb-earn{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;color:#ffd700;margin-left:auto;white-space:nowrap;}

  /* MATCH ROOM */
  .match-vs{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:20px 0;}
  .match-player{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;}
  .match-pname{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;text-align:center;}
  .match-vstext{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:rgba(255,255,255,0.2);flex-shrink:0;}
  .score-box{display:flex;align-items:center;justify-content:center;gap:0;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;margin:16px 0;}
  .score-side{display:flex;flex-direction:column;align-items:center;flex:1;}
  .score-num{font-family:'Barlow Condensed',sans-serif;font-size:72px;font-weight:900;line-height:1;padding:16px 0;}
  .score-divider{width:1px;background:rgba(255,255,255,0.08);align-self:stretch;}
  .score-ctrl{display:flex;gap:8px;padding:10px 16px;background:rgba(255,255,255,0.03);}
  .sc-btn{flex:1;padding:10px;border-radius:8px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;cursor:pointer;transition:all .15s;}
  .sc-plus{background:rgba(0,255,136,0.15);color:#00ff88;}
  .sc-minus{background:rgba(255,45,85,0.12);color:#ff2d55;}
  .sc-plus:active,.sc-minus:active{transform:scale(.94);}

  /* STATUS BADGE */
  .badge{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:20px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;}
  .badge-wait{background:rgba(255,165,0,0.12);color:#ffaa00;border:1px solid rgba(255,165,0,0.2);}
  .badge-live{background:rgba(255,45,85,0.12);color:#ff2d55;border:1px solid rgba(255,45,85,0.25);}
  .badge-done{background:rgba(0,255,136,0.1);color:#00ff88;border:1px solid rgba(0,255,136,0.2);}
  .badge-dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:pulse 1.4s infinite;}

  /* ROOM CODE */
  .roomcode-box{background:rgba(0,255,136,0.06);border:1px dashed rgba(0,255,136,0.3);border-radius:14px;padding:20px;text-align:center;margin:14px 0;}
  .roomcode-label{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-bottom:10px;}
  .roomcode{font-family:'IBM Plex Mono',monospace;font-size:30px;font-weight:600;color:#00ff88;letter-spacing:6px;}
  .roomcode-copy{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(0,255,136,0.6);margin-top:8px;cursor:pointer;}

  /* UPLOAD ZONE */
  .upload-zone{border:2px dashed rgba(255,255,255,0.1);border-radius:14px;padding:32px 20px;text-align:center;cursor:pointer;transition:all .2s;margin:14px 0;}
  .upload-zone:hover{border-color:rgba(0,255,136,0.3);background:rgba(0,255,136,0.03);}
  .upload-ico{font-size:36px;margin-bottom:10px;}
  .upload-text{font-size:14px;color:rgba(255,255,255,0.4);}

  /* ADMIN */
  .disp-card{background:rgba(255,165,0,0.05);border:1px solid rgba(255,165,0,0.15);border-radius:14px;padding:16px;margin-bottom:12px;}
  .disp-title{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;margin-bottom:6px;}
  .disp-meta{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:12px;}
  .disp-btns{display:flex;gap:8px;}
  .wd-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px;margin-bottom:10px;}

  /* NOTIFICATION */
  .notif{position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#00ff88;color:#07070f;padding:12px 20px;border-radius:10px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;z-index:999;white-space:nowrap;animation:slideDown .3s ease;}
  .notif.err{background:#ff2d55;color:#fff;}
  @keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

  /* STAKE GRID */
  .stake-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:12px 0;}
  .stake-chip{padding:12px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.7);font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;cursor:pointer;text-align:center;transition:all .2s;}
  .stake-chip.sel{background:rgba(0,255,136,0.12);border-color:rgba(0,255,136,0.4);color:#00ff88;}

  /* DIVIDER */
  .divider{height:1px;background:rgba(255,255,255,0.06);margin:16px 0;}

  /* SECTION HEADER */
  .sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
  .sec-title{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;letter-spacing:.3px;}
  .sec-link{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#00ff88;cursor:pointer;letter-spacing:.5px;}

  /* ACTIVE MATCH BANNER */
  .active-banner{background:linear-gradient(135deg,rgba(255,45,85,0.12),rgba(255,80,50,0.08));border:1px solid rgba(255,45,85,0.2);border-radius:14px;padding:14px 16px;margin-bottom:14px;display:flex;align-items:center;gap:12px;cursor:pointer;}
  .ab-info{flex:1;}
  .ab-title{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;margin-bottom:3px;}
  .ab-meta{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.4);}

  /* BACK BTN */
  .back-btn{display:flex;align-items:center;gap:6px;color:rgba(255,255,255,0.5);font-family:'IBM Plex Mono',monospace;font-size:11px;cursor:pointer;margin-bottom:18px;letter-spacing:.5px;}
  .back-btn:hover{color:#fff;}

  /* PROFILE */
  .profile-wrap{display:flex;align-items:center;gap:14px;padding:14px 0 20px;}
  .profile-name{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;margin-bottom:4px;}
  .profile-id{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:1px;}

  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @k
