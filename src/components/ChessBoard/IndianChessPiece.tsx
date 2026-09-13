import React from 'react';
import { PieceSymbol, Color } from 'chess.js';

interface IndianChessPieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

/**
 * Royal Jewel Chess Piece Set — bold, chunky edition
 * Classic Staunton silhouettes finished with Indian royal detailing:
 * gold trim bands, ruby-red gem accents, a lotus-petal queen's crown,
 * and a kalgi (turban feather) finial on the king.
 * - White: ivory body with gold trim and espresso outlines.
 * - Black: ebony body with the same gold trim and near-black outlines.
 * - Every piece is scaled ~28% wider / ~7% taller around its own vertical
 *   axis for a chunkier, more substantial look, with bold ~3.6px outlines
 *   throughout (accent strokes scaled up to match).
 *
 * viewBox is 0 0 100 160 (taller than a 1:1 square) to give each piece a
 * proper base / neck / finial silhouette. Let the SVG's default
 * preserveAspectRatio ('xMidYMid meet') letterbox it inside a square
 * container — don't stretch it to 1:1.
 */
export const IndianChessPiece: React.FC<IndianChessPieceProps> = React.memo(({
  type,
  color,
  className = 'w-full h-full',
}) => {
  const isWhite = color === 'w';
  const pfx = (isWhite ? 'w_' : 'b_') + type + '_';

  const outline = isWhite ? '#3d2a10' : '#0d0805';
  const sw = 3.6;

  const renderDefs = () => (
    <defs>
      <linearGradient id={`${pfx}body`} x1="15%" y1="0%" x2="85%" y2="100%">
        {isWhite ? (
          <>
            <stop offset="0%" stopColor="#fff6e0" />
            <stop offset="45%" stopColor="#f3dfae" />
            <stop offset="100%" stopColor="#d6b169" />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor="#4a3c34" />
            <stop offset="45%" stopColor="#241a15" />
            <stop offset="100%" stopColor="#0c0805" />
          </>
        )}
      </linearGradient>

      <linearGradient id={`${pfx}gold`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fff0b0" />
        <stop offset="45%" stopColor="#e8b93d" />
        <stop offset="100%" stopColor="#a9760e" />
      </linearGradient>

      <radialGradient id={`${pfx}gem`} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ff8a7a" />
        <stop offset="45%" stopColor="#c81f34" />
        <stop offset="100%" stopColor="#6e0a17" />
      </radialGradient>
    </defs>
  );

  // Shared pedestal base used by rook / knight / bishop / queen / king
  const Base = () => (
    <>
      <ellipse cx="50" cy="150" rx="30" ry="7" fill={`url(#${pfx}gold)`} stroke={outline} strokeWidth={sw} />
      <path
        d="M24 149 C22 138 27 128 34 122 L66 122 C73 128 78 138 76 149 Z"
        fill={`url(#${pfx}body)`}
        stroke={outline}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="122" rx="16" ry="4.5" fill={`url(#${pfx}gold)`} stroke={outline} strokeWidth={sw * 0.85} />
    </>
  );

  // A row of three small ruby gems set into the collar band
  const GemRow: React.FC<{ cy: number }> = ({ cy }) => (
    <>
      <circle cx="40" cy={cy} r="2.1" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.4} />
      <circle cx="50" cy={cy} r="2.1" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.4} />
      <circle cx="60" cy={cy} r="2.1" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.4} />
    </>
  );

  // Widens each piece ~28% and stretches it ~7% taller around its own
  // vertical axis (x=50) for the chunkier look, without touching the
  // 0 0 100 160 viewBox itself.
  const Fatten: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <g transform="translate(50 0) scale(1.28 1.07) translate(-50 0)">{children}</g>
  );

  switch (type) {
    // =========================================================================
    // PAWN
    // =========================================================================
    case 'p':
      return (
        <svg viewBox="0 0 100 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}
          <Fatten>
            <ellipse cx="50" cy="150" rx="22" ry="6" fill={`url(#${pfx}gold)`} stroke={outline} strokeWidth={sw} />
            <path
              d="M32 149 C31 140 35 132 40 128 L60 128 C65 132 69 140 68 149 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <ellipse cx="50" cy="128" rx="12" ry="3.5" fill={`url(#${pfx}gold)`} stroke={outline} strokeWidth={sw * 0.8} />
            <circle cx="44" cy="122" r="2" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.2} />
            <circle cx="56" cy="122" r="2" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.2} />
            <path
              d="M41 108 C42 100 44 92 46 87 L54 87 C56 92 58 100 59 108 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw}
            />
            <ellipse cx="50" cy="87" rx="8" ry="3" fill={`url(#${pfx}gold)`} stroke={outline} strokeWidth={sw * 0.8} />
            <circle cx="50" cy="72" r="10" fill={`url(#${pfx}body)`} stroke={outline} strokeWidth={sw} />
            <circle cx="50" cy="72" r="2.6" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.4} />
          </Fatten>
        </svg>
      );

    // =========================================================================
    // ROOK
    // =========================================================================
    case 'r':
      return (
        <svg viewBox="0 0 100 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}
          <Fatten>
            <Base />
            <path
              d="M28 122 C27 108 27 90 29 76 L71 76 C73 90 73 108 72 122 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <GemRow cy={115} />
            <rect x="25" y="66" width="50" height="12" rx="1.5" fill={`url(#${pfx}gold)`} stroke={outline} strokeWidth={sw} />
            <rect x="27" y="50" width="10" height="16" fill={`url(#${pfx}body)`} stroke={outline} strokeWidth={sw} />
            <rect x="45" y="50" width="10" height="16" fill={`url(#${pfx}body)`} stroke={outline} strokeWidth={sw} />
            <rect x="63" y="50" width="10" height="16" fill={`url(#${pfx}body)`} stroke={outline} strokeWidth={sw} />
            <rect x="37" y="58" width="8" height="8" fill={`url(#${pfx}gold)`} />
            <rect x="55" y="58" width="8" height="8" fill={`url(#${pfx}gold)`} />
          </Fatten>
        </svg>
      );

    // =========================================================================
    // KNIGHT — proper horse-head silhouette: elongated snout, ear, eye,
    // nostril, mouth line, jeweled bridle strap, and a flowing gold mane.
    // =========================================================================
    case 'n':
      return (
        <svg viewBox="0 0 100 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}
          <Fatten>
            <Base />
            <path
              d="M58 122 C56 108 52 96 48 90 L40 80 C34 82 26 85 22 86 C18 87 15 88 13 89 C9 87 8 84 9 80 C10 76 13 72 16 70 L20 68 C26 66 34 64 40 62 C44 59 47 56 50 54 C54 54 58 55 60 58 C64 62 68 68 70 76 C72 85 72 95 72 105 C71 112 70 118 68 122 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* ear */}
            <path
              d="M58 58 L53 45 L65 53 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw * 0.7}
              strokeLinejoin="round"
            />
            {/* eye */}
            <circle cx="44" cy="68" r="2.2" fill={outline} />
            {/* nostril */}
            <circle cx="14" cy="81" r="1.8" fill={outline} />
            {/* mouth line */}
            <path
              d="M16 85 C20 87 25 86 29 84"
              fill="none"
              stroke={outline}
              strokeWidth="1.7"
              strokeLinecap="round"
              opacity={0.6}
            />
            {/* jeweled bridle strap */}
            <path
              d="M15 76 C23 73 31 74 38 80"
              fill="none"
              stroke={`url(#${pfx}gold)`}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <circle cx="27" cy="75" r="2.2" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.4} />
            {/* mane */}
            <path
              d="M62 60 L57 66 L64 69 L58 75 L66 78 L60 84 L68 88"
              fill="none"
              stroke={`url(#${pfx}gold)`}
              strokeWidth="3.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <GemRow cy={115} />
          </Fatten>
        </svg>
      );

    // =========================================================================
    // BISHOP
    // =========================================================================
    case 'b':
      return (
        <svg viewBox="0 0 100 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}
          <Fatten>
            <Base />
            <path
              d="M32 122 C31 108 33 92 40 80 C44 73 46 66 46 58 L54 58 C54 66 56 73 60 80 C67 92 69 108 68 122 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <GemRow cy={100} />
            <path
              d="M40 58 C39 50 43 44 50 44 C57 44 61 50 60 58 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path d="M44 46 L56 52" stroke={outline} strokeWidth="3.0" strokeLinecap="round" />
            <circle cx="50" cy="36" r="6.5" fill={`url(#${pfx}body)`} stroke={outline} strokeWidth={sw} />
            <circle cx="50" cy="36" r="2.4" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.4} />
            <circle cx="50" cy="26" r="2.8" fill={`url(#${pfx}gold)`} stroke={outline} strokeWidth="1.9" />
          </Fatten>
        </svg>
      );

    // =========================================================================
    // QUEEN — lotus-petal crown
    // =========================================================================
    case 'q':
      return (
        <svg viewBox="0 0 100 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}
          <Fatten>
            <Base />
            <path
              d="M30 122 C29 106 32 90 38 78 C42 70 44 62 44 54 L56 54 C56 62 58 70 62 78 C68 90 71 106 70 122 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <GemRow cy={98} />
            <ellipse cx="50" cy="54" rx="13" ry="4" fill={`url(#${pfx}gold)`} stroke={outline} strokeWidth={sw * 0.85} />
            <path
              d="M37 50 L40 30 L46 42 L50 24 L54 42 L60 30 L63 50 Z"
              fill={`url(#${pfx}gold)`}
              stroke={outline}
              strokeWidth={sw * 0.85}
              strokeLinejoin="round"
            />
            <circle cx="40" cy="30" r="2" fill={`url(#${pfx}gem)`} />
            <circle cx="50" cy="24" r="2.2" fill={`url(#${pfx}gem)`} />
            <circle cx="60" cy="30" r="2" fill={`url(#${pfx}gem)`} />
            <circle cx="50" cy="44" r="2.6" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.4} />
          </Fatten>
        </svg>
      );

    // =========================================================================
    // KING — jeweled crown with a kalgi (turban feather) finial
    // =========================================================================
    case 'k':
      return (
        <svg viewBox="0 0 100 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}
          <Fatten>
            <Base />
            <path
              d="M28 122 C27 104 30 86 37 73 C41 65 43 57 43 49 L57 49 C57 57 59 65 63 73 C70 86 73 104 72 122 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <GemRow cy={93} />
            <ellipse cx="50" cy="49" rx="14" ry="4.2" fill={`url(#${pfx}gold)`} stroke={outline} strokeWidth={sw * 0.85} />
            <path
              d="M36 45 C36 36 42 30 50 30 C58 30 64 36 64 45 Z"
              fill={`url(#${pfx}body)`}
              stroke={outline}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <circle cx="50" cy="38" r="3" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.4} />
            {/* feather finial (kalgi plume) */}
            <path
              d="M50 30 C46 24 44 16 47 8 C48 5 50 3 51 2 C52 5 53 10 52 15 C55 12 58 9 61 8 C60 13 57 18 53 21 C55 20 58 20 60 21 C57 25 52 28 50 30 Z"
              fill={`url(#${pfx}gold)`}
              stroke={outline}
              strokeWidth="2.1"
              strokeLinejoin="round"
            />
            <path
              d="M50 29 C49 22 49 13 51 4"
              fill="none"
              stroke={outline}
              strokeWidth="1.4"
              opacity={0.55}
              strokeLinecap="round"
            />
            <circle cx="50" cy="32" r="2.4" fill={`url(#${pfx}gem)`} stroke={outline} strokeWidth={1.4} />
          </Fatten>
        </svg>
      );

    default:
      return null;
  }
});

IndianChessPiece.displayName = 'IndianChessPiece';