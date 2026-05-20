import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface CertificateProps {
  studentName: string;
  eventName: string;
  date: string;
  certificateId: string;
  collegeName?: string;
}

// ─── Inline SVG: WeFest Authenticated Seal ───────────────────────────────────
const WeFestSeal = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sealGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#F5D77E" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
      <linearGradient id="sealInner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a0a00" />
        <stop offset="100%" stopColor="#2d1500" />
      </linearGradient>
    </defs>

    {/* Outer gear ring */}
    {Array.from({ length: 36 }).map((_, i) => {
      const angle = (i * 10 * Math.PI) / 180;
      const x1 = 100 + 95 * Math.cos(angle);
      const y1 = 100 + 95 * Math.sin(angle);
      const x2 = 100 + 85 * Math.cos(angle);
      const y2 = 100 + 85 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#sealGold)" strokeWidth="2.5" />;
    })}

    {/* Outer ring */}
    <circle cx="100" cy="100" r="92" fill="none" stroke="url(#sealGold)" strokeWidth="2" />
    <circle cx="100" cy="100" r="84" fill="none" stroke="url(#sealGold)" strokeWidth="0.8" />

    {/* Star burst */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 100 + 80 * Math.cos(angle);
      const y1 = 100 + 80 * Math.sin(angle);
      const x2 = 100 + 48 * Math.cos(angle);
      const y2 = 100 + 48 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#sealGold)" strokeWidth="0.8" opacity="0.5" />;
    })}

    {/* Inner circle background */}
    <circle cx="100" cy="100" r="78" fill="url(#sealInner)" />
    <circle cx="100" cy="100" r="75" fill="none" stroke="url(#sealGold)" strokeWidth="1" />

    {/* Curved text paths */}
    <defs>
      <path id="topArc" d="M 22,100 A 78,78 0 0,1 178,100" />
      <path id="bottomArc" d="M 30,110 A 72,72 0 0,0 170,110" />
    </defs>

    <text fill="url(#sealGold)" fontSize="10" fontFamily="Georgia, serif" fontWeight="bold" letterSpacing="3">
      <textPath href="#topArc" startOffset="10%">WEFEST • OFFICIAL • CREDENTIAL •</textPath>
    </text>
    <text fill="url(#sealGold)" fontSize="8.5" fontFamily="Georgia, serif" letterSpacing="2">
      <textPath href="#bottomArc" startOffset="14%">VERIFIED & AUTHENTICATED</textPath>
    </text>

    {/* WeFest W Logo mark center */}
    <g transform="translate(100,100)" opacity="0.9">
      {/* Stylized W */}
      <polygon
        points="-24,-10 -16,14 -8,-4 0,14 8,-4 16,14 24,-10 20,-10 16,8 8,-10 0,8 -8,-10 -20,8"
        fill="url(#sealGold)"
      />
      {/* Crown above */}
      <polygon points="-10,-14 -6,-22 0,-16 6,-22 10,-14" fill="url(#sealGold)" />
    </g>
  </svg>
);

// ─── Inline SVG: Security Guilloche Pattern ──────────────────────────────────
const GuillochePattern = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="guillocheWave" x="0" y="0" width="120" height="60" patternUnits="userSpaceOnUse">
        <path d="M0 30 Q15 0,30 30 T60 30 T90 30 T120 30" fill="none" stroke="#8B6914" strokeWidth="0.4" />
        <path d="M0 20 Q15 -10,30 20 T60 20 T90 20 T120 20" fill="none" stroke="#8B6914" strokeWidth="0.3" />
        <path d="M0 40 Q15 10,30 40 T60 40 T90 40 T120 40" fill="none" stroke="#8B6914" strokeWidth="0.3" />
      </pattern>
      <pattern id="diagonalLines" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="20" y2="0" stroke="#8B6914" strokeWidth="0.2" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#guillocheWave)" opacity="0.6" />
    <rect width="100%" height="100%" fill="url(#diagonalLines)" opacity="0.25" />
  </svg>
);

// ─── Inline SVG: Corner Ornament ─────────────────────────────────────────────
const CornerOrnament = ({ rotate = 0 }: { rotate?: number }) => (
  <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg"
    style={{ transform: `rotate(${rotate}deg)` }}>
    <path d="M4,4 L4,36 M4,4 L36,4" fill="none" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M4,4 L22,22" fill="none" stroke="#C9A227" strokeWidth="0.8" opacity="0.6" />
    <circle cx="4" cy="4" r="3" fill="#C9A227" />
    <circle cx="22" cy="4" r="1.5" fill="#C9A227" opacity="0.6" />
    <circle cx="4" cy="22" r="1.5" fill="#C9A227" opacity="0.6" />
    <path d="M14,4 Q18,14 4,14" fill="none" stroke="#C9A227" strokeWidth="0.8" opacity="0.5" />
  </svg>
);

// ─── Main Certificate Component ───────────────────────────────────────────────
export function CertificateTemplate({
  studentName,
  eventName,
  date,
  certificateId,
  collegeName,
}: CertificateProps) {
  const verifyUrl = `https://wefest.weskill.org/verify/${certificateId}`;

  return (
    <div
      className="certificate-outer"
      style={{
        background: "#0a0a0c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        minHeight: "100vh",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* ── Certificate Paper ── */}
      <div
        id="certificate-print-area"
        style={{
          position: "relative",
          width: "297mm",
          minHeight: "210mm",
          background: "linear-gradient(145deg, #fffef9 0%, #fefce8 40%, #fffdf5 70%, #fefce8 100%)",
          overflow: "hidden",
          boxSizing: "border-box",
          // Triple border system for premium look
          outline: "2px solid #C9A227",
          outlineOffset: "-6px",
          boxShadow:
            "0 0 0 1px #C9A227, 0 0 0 8px #7c5c0a, 0 0 0 10px #C9A227, 0 60px 120px -20px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Security Background ── */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.07, pointerEvents: "none" }}>
          <GuillochePattern />
        </div>

        {/* ── Watermark ── */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%) rotate(-35deg)",
            pointerEvents: "none",
            userSelect: "none",
            opacity: 0.025,
            fontSize: "160px",
            fontWeight: 900,
            fontFamily: "Georgia, serif",
            color: "#7c5c0a",
            whiteSpace: "nowrap",
            letterSpacing: "0.3em",
          }}
        >
          WEFEST
        </div>

        {/* ── Corners ── */}
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <CornerOrnament rotate={0} />
        </div>
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <CornerOrnament rotate={90} />
        </div>
        <div style={{ position: "absolute", bottom: 14, left: 14 }}>
          <CornerOrnament rotate={270} />
        </div>
        <div style={{ position: "absolute", bottom: 14, right: 14 }}>
          <CornerOrnament rotate={180} />
        </div>

        {/* ── Gold stripe accents ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #7c5c0a, #D4AF37, #F5D77E, #D4AF37, #7c5c0a)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #7c5c0a, #D4AF37, #F5D77E, #D4AF37, #7c5c0a)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "6px",
            background: "linear-gradient(180deg, #7c5c0a, #D4AF37, #F5D77E, #D4AF37, #7c5c0a)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "6px",
            background: "linear-gradient(180deg, #7c5c0a, #D4AF37, #F5D77E, #D4AF37, #7c5c0a)",
          }}
        />

        {/* ── Main Content ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "44px 56px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "210mm",
            boxSizing: "border-box",
          }}
        >
          {/* ── HEADER: Logo + Title ── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 10 }}>
            {/* Logo */}
            <div style={{ width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src="/logo-gold.png"
                alt="WeFest"
                style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(196,163,45,0.4))" }}
              />
            </div>

            {/* Brand name */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: "0.28em",
                  color: "#1a0d00",
                  fontFamily: "Georgia, serif",
                  textTransform: "uppercase",
                }}
              >
                WEFEST
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 4,
                  justifyContent: "center",
                }}
              >
                <div style={{ height: 1, width: 40, background: "linear-gradient(to right, transparent, #C9A227)" }} />
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.35em",
                    color: "#C9A227",
                    textTransform: "uppercase",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  OFFICIAL CREDENTIAL
                </span>
                <div style={{ height: 1, width: 40, background: "linear-gradient(to left, transparent, #C9A227)" }} />
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              width: "100%",
              height: 1,
              background: "linear-gradient(to right, transparent, #C9A22788, #C9A227, #C9A22788, transparent)",
              margin: "10px 0 16px",
            }}
          />

          {/* ── Certificate Title ── */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <div
              style={{
                fontSize: 13,
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "#7c5c0a",
                fontWeight: 600,
                fontFamily: "Georgia, serif",
                marginBottom: 6,
              }}
            >
              CERTIFICATE OF PARTICIPATION
            </div>
            <div
              style={{
                fontSize: 46,
                fontWeight: 700,
                color: "#1a0d00",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              Certificate of Merit
            </div>
          </div>

          {/* ── Body Text ── */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <p
              style={{
                fontSize: 13,
                color: "#5c4a2a",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                letterSpacing: "0.02em",
                marginBottom: 0,
              }}
            >
              This is to certify that
            </p>
          </div>

          {/* ── Student Name ── */}
          <div
            style={{
              textAlign: "center",
              borderBottom: "2px solid #C9A227",
              paddingBottom: 8,
              marginBottom: 10,
              minWidth: "60%",
              maxWidth: "80%",
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: "#1a0800",
                fontFamily: "Georgia, 'Times New Roman', serif",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {studentName}
            </div>
            {collegeName && (
              <div
                style={{
                  fontSize: 11,
                  color: "#7c5c0a",
                  fontFamily: "Georgia, serif",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                {collegeName}
              </div>
            )}
          </div>

          {/* ── Event Description ── */}
          <div style={{ textAlign: "center", maxWidth: "75%", marginBottom: 16 }}>
            <p
              style={{
                fontSize: 13,
                color: "#5c4a2a",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              has successfully participated in and demonstrated exemplary enthusiasm,
              <br />
              leadership and dedication at the official festival event
            </p>
            <div
              style={{
                marginTop: 8,
                fontSize: 22,
                fontWeight: 800,
                color: "#7c3d00",
                fontFamily: "Georgia, serif",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {eventName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#9a7a40",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.1em",
                marginTop: 4,
              }}
            >
              Held on {date}
            </div>
          </div>

          {/* ── FOOTER: Seal + Signature + QR ── */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              alignItems: "flex-end",
              marginTop: "auto",
              paddingTop: 16,
              borderTop: "1px solid #C9A22755",
            }}
          >
            {/* Left: WeFest Authenticated Seal */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 100, height: 100 }}>
                <WeFestSeal />
              </div>
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#7c5c0a",
                  fontFamily: "Georgia, serif",
                  textAlign: "center",
                }}
              >
                Authenticated Seal
              </div>
            </div>

            {/* Center: Signature */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              {/* Cert ID */}
              <div
                style={{
                  fontSize: 8,
                  letterSpacing: "0.15em",
                  color: "#9a7a40",
                  fontFamily: "Georgia, serif",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                CERT # {certificateId}
              </div>

              {/* Signature line */}
              <div style={{ textAlign: "center", width: "100%" }}>
                {/* Cursive signature using SVG path */}
                <svg viewBox="0 0 180 50" width="180" height="50" style={{ marginBottom: 2 }}>
                  <path
                    d="M 20,40 C 30,15 50,10 70,28 C 85,42 95,20 110,22 C 125,24 140,38 160,32"
                    fill="none"
                    stroke="#1a0800"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                  <path
                    d="M 40,35 C 55,20 75,18 90,30"
                    fill="none"
                    stroke="#1a0800"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>
                <div style={{ height: 1, background: "#1a0800", opacity: 0.4, marginBottom: 6 }} />
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#1a0800",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  WeFest Executive Board
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "#9a7a40",
                    letterSpacing: "0.1em",
                    fontFamily: "Georgia, serif",
                    marginTop: 2,
                  }}
                >
                  Authorized Signatory
                </div>
              </div>
            </div>

            {/* Right: QR + ID */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              {/* QR code in gold frame */}
              <div
                style={{
                  background: "#fff",
                  padding: 6,
                  border: "2px solid #C9A227",
                  boxShadow: "0 2px 8px rgba(196,163,45,0.25)",
                  display: "inline-block",
                }}
              >
                <QRCodeSVG
                  value={verifyUrl}
                  size={64}
                  level="M"
                  fgColor="#1a0800"
                  bgColor="#ffffff"
                />
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: "#16a34a",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontFamily: "Georgia, serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    justifyContent: "flex-end",
                  }}
                >
                  ✓ SECURE VERIFICATION
                </div>
                <div style={{ fontSize: 7.5, color: "#9a7a40", fontFamily: "monospace", marginTop: 2 }}>
                  wefest.weskill.org/verify/{certificateId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Paper texture overlay ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
            pointerEvents: "none",
            opacity: 0.5,
          }}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,700;1,900&display=swap');

        /* Hide print root on screen but keep it in DOM for asset loading */
        @media screen {
          .print-root {
            position: absolute !important;
            top: -10000px !important;
            left: -10000px !important;
            visibility: hidden !important;
          }
        }

        @media print {
          /* Hide everything by default */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            background: #fff !important;
          }
          
          body > *:not(.print-root) {
            display: none !important;
          }

          .print-root {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            z-index: 9999999 !important;
            opacity: 1 !important;
            visibility: visible !important;
            background: #fff !important;
          }

          .certificate-outer {
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
            display: block !important;
            min-height: 0 !important;
            perspective: none !important;
            width: 297mm !important;
            height: 210mm !important;
          }

          #certificate-print-area {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            width: 297mm !important;
            height: 209mm !important; /* Slightly less to avoid extra blank page */
            box-shadow: none !important;
            outline: none !important;
            margin: 0 !important;
            transform: none !important;
            border: none !important;
            float: none !important;
          }

          /* Ensure colors and backgrounds print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
