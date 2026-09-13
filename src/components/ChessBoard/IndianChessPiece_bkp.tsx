import React from 'react';
import { PieceSymbol, Color } from 'chess.js';

interface IndianChessPieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

/**
 * Classical Indian Musical Heritage Chess Piece Set
 * Modified for better piece recognizability while maintaining Indian theme
 * - White: Radiant amber/honey-gold lacquer with warm gold highlights & deep espresso outlines.
 * - Black: Roasted walnut/mahogany dark wood lacquer with warm bronze highlights & rich dark umber outlines.
 *
 * Pieces redesigned with clearer chess piece recognition:
 * - Pawn (p): Elongated Temple Bell / Ghungroo with clear pawn-like proportions
 * - Rook (r): Dholak / Mridangam barrel drum with fortified battlement-like top
 * - Knight (n): Regal steed with curved war horn/shankha crest (unchanged - already recognizable)
 * - Bishop (b): Shehnai / Nadaswaram with pronounced mitre-like split at top
 * - Queen (q): Saptak triple-flute scepters crown with enhanced regal presentation
 * - King (k): Royal Saraswati Veena / Tanpura with prominent crown and majestic proportions
 */
export const IndianChessPiece: React.FC<IndianChessPieceProps> = React.memo(({
  type,
  color,
  className = 'w-full h-full',
}) => {
  const isWhite = color === 'w';
  const pfx = isWhite ? 'w_sangeet_' : 'b_sangeet_';

  // Palette definitions inspired directly by user's image
  const outlineColor = isWhite ? '#381c03' : '#1a0b02';
  const strokeWidth = 2.4;
  const cordStroke = isWhite ? '#5c3108' : '#2d1403';

  // Gradients for White (Amber Gold) and Black (Roasted Dark Wood)
  const renderDefs = () => (
    <defs>
      {/* Primary body gradient */}
      <linearGradient id={`${pfx}body`} x1="20%" y1="0%" x2="80%" y2="100%">
        {isWhite ? (
          <>
            <stop offset="0%" stopColor="#ffea88" />
            <stop offset="25%" stopColor="#f5b821" />
            <stop offset="70%" stopColor="#db8e09" />
            <stop offset="100%" stopColor="#9e5c02" />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor="#87481b" />
            <stop offset="25%" stopColor="#663411" />
            <stop offset="70%" stopColor="#4d2409" />
            <stop offset="100%" stopColor="#2c1203" />
          </>
        )}
      </linearGradient>

      {/* Surface Highlight sheen */}
      <linearGradient id={`${pfx}highlight`} x1="0%" y1="0%" x2="0%" y2="100%">
        {isWhite ? (
          <>
            <stop offset="0%" stopColor="#fff8cf" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#f5b821" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c27704" stopOpacity="0.1" />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor="#b5672b" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#663411" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2c1203" stopOpacity="0.1" />
          </>
        )}
      </linearGradient>

      {/* Rim / Cord / String Accent */}
      <linearGradient id={`${pfx}accent`} x1="0%" y1="0%" x2="100%" y2="0%">
        {isWhite ? (
          <>
            <stop offset="0%" stopColor="#ffe175" />
            <stop offset="50%" stopColor="#f7bc28" />
            <stop offset="100%" stopColor="#b56f03" />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor="#9c5421" />
            <stop offset="50%" stopColor="#733b14" />
            <stop offset="100%" stopColor="#3d1904" />
          </>
        )}
      </linearGradient>

      {/* Deep Shadow for inner cavities / soundholes */}
      <radialGradient id={`${pfx}cavity`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#120601" stopOpacity="0.9" />
        <stop offset="80%" stopColor="#2b1104" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#421a05" stopOpacity="0.5" />
      </radialGradient>
    </defs>
  );

  switch (type) {
    // =========================================================================
    // PAWN: Ghungroo / Sacred Temple Bell (Modified for pawn-like recognition)
    // =========================================================================
    case 'p':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}

          {/* Pedestal / Ground Base Rim - Made more prominent for pawn base */}
          <ellipse
            cx="50"
            cy="86"
            rx="20"
            ry="5"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Under-bell Clapper / Sound Lip */}
          <path
            d="M42 86 C42 92 58 92 58 86 Z"
            fill={`url(#${pfx}cavity)`}
            stroke={outlineColor}
            strokeWidth={1.8}
          />

          {/* Bell Skirt Body - Made more tapered/elongated for pawn profile */}
          <path
            d="M26 86 C28 84 32 78 36 70 C40 62 44 54 48 46 L52 46 C56 54 60 62 64 70 C68 78 72 84 74 86 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />

          {/* Bell Body Contour Highlight */}
          <path
            d="M30 83 C33 79 38 73 42 65 C46 57 50 49 54 43 L56 43 C52 49 48 57 44 65 C40 73 35 79 32 83 Z"
            fill={`url(#${pfx}highlight)`}
            opacity={isWhite ? 0.75 : 0.45}
          />

          {/* Middle Collar Ring - More defined */}
          <ellipse
            cx="50"
            cy="44"
            rx="14"
            ry="3.5"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Upper Bell Dome / Ghungroo Bulb - Slightly reduced for balance */}
          <circle
            cx="50"
            cy="28"
            r="11"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Dome Top Finial / Teardrop Handle */}
          <path
            d="M47 18 C47 14 53 14 53 18 C53 20 51 22 50 22 C49 22 47 20 47 18 Z"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={1.5}
          />

          {/* Dome Highlight Sheen */}
          <circle
            cx="46"
            cy="24"
            r="4"
            fill={`url(#${pfx}highlight)`}
            opacity={isWhite ? 0.8 : 0.5}
          />
        </svg>
      );

    // =========================================================================
    // ROOK: Dholak / Mridangam Drum with V-Lacing Cords (Enhanced for rook recognition)
    // =========================================================================
    case 'r':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}

          {/* Drum Bottom Base Rim - More substantial */}
          <ellipse
            cx="50"
            cy="86"
            rx="26"
            ry="6"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Main Drum Barrel Body - Made more tower-like */}
          <path
            d="M24 20 C22 34 22 54 24 68 L76 68 C78 54 78 34 76 20 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />

          {/* Body Sheen / Reflection */}
          <path
            d="M28 21 C26 35 26 55 28 67 L34 67 C32 55 32 35 34 21 Z"
            fill={`url(#${pfx}highlight)`}
            opacity={isWhite ? 0.6 : 0.35}
          />

          {/* Enhanced Top with Battlement-like Elements for Rook Recognition */}
          {/* Top Drum Base Fortification */}
          <rect
            x="20"
            y="18"
            width="60"
            height="8"
            rx="2"
            ry="2"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Battlement Merlons (the tall rectangular parts) */}
          <rect
            x="24"
            y="10"
            width="8"
            height="8"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />
          <rect
            x="34"
            y="10"
            width="8"
            height="8"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />
          <rect
            x="44"
            y="10"
            width="8"
            height="8"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />
          <rect
            x="54"
            y="10"
            width="8"
            height="8"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />
          <rect
            x="64"
            y="10"
            width="8"
            height="8"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Taut V-Lacing Tension Cords (Adjusted for new positioning) */}
          <g stroke={cordStroke} strokeWidth="1.8" strokeLinecap="round">
            {/* Cord 1: Left */}
            <line x1="26" y1="22" x2="33" y2="62" />
            <line x1="33" y1="62" x2="41" y2="22" />
            {/* Cord 2: Center */}
            <line x1="41" y1="22" x2="50" y2="62" />
            <line x1="50" y1="62" x2="58" y2="22" />
            {/* Cord 3: Right */}
            <line x1="58" y1="22" x2="66" y2="62" />
            <line x1="66" y1="62" x2="74" y2="22" />
          </g>

          {/* Horizontal Tuning Pegs / Ring Braces (Adjusted) */}
          <line x1="27" y1="30" x2="73" y2="30" stroke={outlineColor} strokeWidth="1.4" opacity="0.6" />
          <line x1="26" y1="42" x2="74" y2="42" stroke={outlineColor} strokeWidth="1.4" opacity="0.6" />

          {/* Top Drum Head Collar Rim */}
          <ellipse
            cx="50"
            cy="18"
            rx="24"
            ry="5"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Top Drum Playing Skin (Syahi resonance patch) */}
          <ellipse
            cx="50"
            cy="18"
            rx="14"
            ry="3.5"
            fill={`url(#${pfx}cavity)`}
            stroke={outlineColor}
            strokeWidth="1.2"
          />
        </svg>
      );

    // =========================================================================
    // KNIGHT: Regal Steed with War Horn / Shankha Crest (Already recognizable)
    // =========================================================================
    case 'n':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}

          {/* Pedestal Base - Enhanced */}
          <ellipse
            cx="50"
            cy="86"
            rx="24"
            ry="5.5"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Base Rim Step */}
          <path
            d="M26 85 C26 79 34 78 38 76 L62 76 C66 78 74 79 74 85 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Horse Neck & Body Silhouette facing Left (Enhanced definition) */}
          <path
            d="M38 76 C36 70 33 62 30 56 C28 52 24 51 22 49 C19 46 20 40 25 38 C30 36 35 39 38 37 C42 34 46 24 51 20 C56 16 62 18 64 25 C65 28 66 32 66 40 C68 48 70 64 62 76 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />

          {/* Neck Highlight */}
          <path
            d="M34 72 C31 64 29 57 27 52 C26 48 24 46 23 45 C24 42 27 41 31 40 C34 41 37 42 40 39 C43 36 48 26 53 22 C54 25 54 29 54 37 C54 49 52 63 48 71 Z"
            fill={`url(#${pfx}highlight)`}
            opacity={isWhite ? 0.6 : 0.35}
          />

          {/* Conch / Horn Coiled Crest (Enhanced definition) */}
          <path
            d="M51 20 C47 24 45 30 47 36 C49 41 55 44 61 42 C66 40 68 34 66 28 C64 24 57 20 51 20 Z"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />
          <ellipse cx="56" cy="32" rx="5" ry="4" fill={`url(#${pfx}cavity)`} stroke={outlineColor} strokeWidth="1.2" />

          {/* Circular Harness Medallion on Cheek */}
          <circle
            cx="39"
            cy="47"
            r="8"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />
          <circle cx="39" cy="47" r="4.5" fill={`url(#${pfx}body)`} stroke={outlineColor} strokeWidth="1.2" />
          <circle cx="39" cy="47" r="1.8" fill={`url(#${pfx}cavity)`} />

          {/* Muzzle and Nostril */}
          <circle cx="24" cy="40" r="1.6" fill={outlineColor} />

          {/* Stylized Mane Ridges (Enhanced) */}
          <path
            d="M62 26 C67 29 70 36 69 43 M67 46 C72 51 73 59 70 66"
            stroke={outlineColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
      );

    // =========================================================================
    // BISHOP: Shehnai / Nadaswaram Musical Wind Horn (Enhanced for bishop recognition)
    // =========================================================================
    case 'b':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}

          {/* Pedestal Base */}
          <ellipse
            cx="50"
            cy="86"
            rx="23"
            ry="5.5"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Flared Pedestal Neck */}
          <path
            d="M27 86 C29 80 35 76 40 70 L60 70 C65 76 71 80 73 86 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Main Conical Shehnai Body Pipe - Modified for bishop mitre effect */}
          <path
            d="M40 70 C42 56 43 42 44 28 L56 28 C57 42 58 56 60 70 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Bishop's Mitre Split - Enhanced for recognition */}
          {/* Left side of split */}
          <path
            d="M44 28 C43 24 41 22 39 22 L37 22 C35 22 33 24 32 28 L32 28 C33 32 35 34 37 34 L39 34 C41 34 43 32 44 28 Z"
            fill={`url(#${pfx}accent)`}
          />
          {/* Right side of split */}
          <path
            d="M56 28 C57 24 59 22 61 22 L63 22 C65 22 67 24 68 28 L68 28 C67 32 65 34 63 34 L61 34 C59 34 58 32 57 28 L56 28 Z"
            fill={`url(#${pfx}accent)`}
          />

          {/* Left Shehnai Finger-Stops (Tone Holes) - Adjusted positioning */}
          <circle cx="45" cy="40" r="2.2" fill={`url(#${pfx}cavity)`} stroke={outlineColor} strokeWidth="1" />
          <circle cx="45" cy="48" r="2.2" fill={`url(#${pfx}cavity)`} stroke={outlineColor} strokeWidth="1" />
          <circle cx="45" cy="56" r="2.2" fill={`url(#${pfx}cavity)`} stroke={outlineColor} strokeWidth="1" />

          {/* Side-Flared Shehnai Trumpet Bell (Enhanced) */}
          <path
            d="M52 30 C58 26 66 27 72 35 C77 42 77 50 70 58 C64 62 57 60 54 50 Z"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />

          {/* Bell Sound Opening Oval */}
          <ellipse
            cx="69"
            cy="46"
            rx="5.5"
            ry="9"
            transform="rotate(20 69 46)"
            fill={`url(#${pfx}cavity)`}
            stroke={outlineColor}
            strokeWidth={1.8}
          />

          {/* Reed Mouthpiece & Crown Loop at Top */}
          <path
            d="M45 28 C45 20 49 16 53 16 C58 16 60 22 58 26 C56 30 50 30 47 28"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx="53" cy="16" r="2.2" fill={`url(#${pfx}body)`} stroke={outlineColor} strokeWidth="1" />
        </svg>
      );

    // =========================================================================
    // QUEEN: Saptak Triple-Flute / Scepter Crown (Enhanced for queen recognition)
    // =========================================================================
    case 'q':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}

          {/* Base Rim - Made more substantial */}
          <ellipse
            cx="50"
            cy="86"
            rx="25"
            ry="6"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Flared Pedestal Column */}
          <path
            d="M25 86 C27 80 35 76 40 68 L60 68 C65 76 73 80 75 86 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Lotus Pedestal Band */}
          <ellipse
            cx="50"
            cy="68"
            rx="15"
            ry="4.5"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Central Flute Stem */}
          <path
            d="M46 68 L46 32 L54 32 L54 68 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Left Flared Flute Stem */}
          <path
            d="M43 67 L26 36 L32 34 L49 65 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Right Flared Flute Stem */}
          <path
            d="M51 65 L68 34 L74 36 L55 65 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Enhanced Queen Crown - More regal and recognizable */}
          {/* Central Crown Element (tallest) */}
          <circle
            cx="50"
            cy="22"
            r="7"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />
          <circle cx="48" cy="19" r="3" fill={`url(#${pfx}highlight)`} opacity={isWhite ? 0.8 : 0.5} />

          {/* Left Crown Element */}
          <circle
            cx="30"
            cy="28"
            r="6"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />
          <circle cx="28" cy="25" r="2.5" fill={`url(#${pfx}highlight)`} opacity={isWhite ? 0.8 : 0.5} />

          {/* Right Crown Element */}
          <circle
            cx="70"
            cy="28"
            r="6"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />
          <circle cx="68" cy="25" r="2.5" fill={`url(#${pfx}highlight)`} opacity={isWhite ? 0.8 : 0.5} />

          {/* Connecting Arches for Crown Structure */}
          <path
            d="M30 28 Q40 20 50 22 Q60 20 70 28"
            fill="none"
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Small Top Beads */}
          <circle cx="50" cy="14" r="2" fill={outlineColor} />
          <circle cx="30" cy="20" r="1.8" fill={outlineColor} />
          <circle cx="70" cy="20" r="1.8" fill={outlineColor} />
        </svg>
      );

    // =========================================================================
    // KING: Royal Saraswati Veena / Tanpura (Enhanced for king recognition)
    // =========================================================================
    case 'k':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}

          {/* Base Rim - Made more substantial for king's base */}
          <ellipse
            cx="50"
            cy="86"
            rx="26"
            ry="6"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Resonant Lute / Soundbox Body - Made more majestic */}
          <path
            d="M24 86 C23 76 26 60 34 48 C40 38 44 30 44 20 L56 20 C56 30 60 38 66 48 C74 60 77 76 76 86 Z"
            fill={`url(#${pfx}body)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />

          {/* Soundbox Sheen */}
          <path
            d="M29 83 C28 73 31 59 38 50 C41 42 44 34 45 24 L48 24 C47 34 44 40 41 32 C35 40 32 52 33 62 C34 74 31 82 32 83 Z"
            fill={`url(#${pfx}highlight)`}
            opacity={isWhite ? 0.6 : 0.35}
          />

          {/* Traditional Indian Bronze Veena Strings (Tuned Chord) */}
          <g stroke={cordStroke} strokeWidth="1.6" strokeLinecap="round">
            <line x1="46" y1="20" x2="44" y2="78" />
            <line x1="50" y1="20" x2="50" y2="78" />
            <line x1="54" y1="20" x2="56" y2="78" />
          </g>

          {/* Bridge at Bottom of Strings */}
          <ellipse
            cx="50"
            cy="78"
            rx="9"
            ry="2.8"
            fill={`url(#${pfx}cavity)`}
            stroke={outlineColor}
            strokeWidth="1.4"
          />

          {/* Enhanced King Crown - More prominent and regal */}
          {/* Main Crown Base */}
          <ellipse
            cx="50"
            cy="18"
            rx="12"
            ry="5"
            fill={`url(#${pfx}accent)`}
            stroke={outlineColor}
            strokeWidth={strokeWidth}
          />

          {/* Crown Spikes (enhanced for regality) */}
          {/* Center Spike - Tallest */}
          <path
            d="M50 8 C50 2 54 2 54 8 L54 8 C54 2 58 2 58 8 L58 8 C58 2 62 2 62 8 Z"
            fill={`url(#${pfx}accent)`}
          />
          {/* Left Spike */}
          <path
            d="M38 12 C38 8 42 8 42 12 L42 12 C42 8 46 8 46 12 L46 12 C46 8 50 8 50 12 Z"
            fill={`url(#${pfx}accent)`}
          />
          {/* Right Spike */}
          <path
            d="M54 12 C54 8 58 8 58 12 L58 12 C58 8 62 8 62 12 L62 12 C62 8 66 8 66 12 Z"
            fill={`url(#${pfx}accent)`}
          />

          {/* Crown Jewels / Decorative Elements */}
          <circle cx="50" cy="10" r="2.5" fill={outlineColor} />
          <circle cx="40" cy="14" r="2" fill={outlineColor} />
          <circle cx="60" cy="14" r="2" fill={outlineColor} />

          {/* Side Tuning Pegs (Khunti) - Enhanced visibility */}
          <line x1="38" y1="22" x2="46" y2="22" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="54" y1="22" x2="62" y2="22" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="36" cy="22" r="2.2" fill={`url(#${pfx}accent)`} stroke={outlineColor} strokeWidth="1" />
          <circle cx="64" cy="22" r="2.2" fill={`url(#${pfx}accent)`} stroke={outlineColor} strokeWidth="1" />
        </svg>
      );

    default:
      return null;
  }
});