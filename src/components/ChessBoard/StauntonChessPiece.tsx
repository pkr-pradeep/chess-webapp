import React, { useId } from 'react';
import { PieceSymbol, Color } from 'chess.js';

interface StauntonChessPieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

/**
 * Premium Classic Staunton set.
 *
 * Design goals:
 * - unmistakably Staunton, not Indian-themed
 * - larger visual footprint inside a board square
 * - heavier, more sculpted bases
 * - consistent proportions across all six pieces
 * - glossy lacquer / ivory appearance
 * - high contrast details that remain readable at small sizes
 */
export const StauntonChessPiece: React.FC<StauntonChessPieceProps> = React.memo(({
  type,
  color,
  className = 'w-full h-full'
}) => {
  const isWhite = color === 'w';
  const id = useId().replace(/:/g, '');

  const bodyId = `piece-body-${id}`;
  const darkId = `piece-dark-${id}`;
  const shineId = `piece-shine-${id}`;

  const body = isWhite ? '#F5F1E8' : '#121923';
  const bodyMid = isWhite ? '#FCFAF4' : '#1C2634';
  const bodyDark = isWhite ? '#C9C4B8' : '#080C12';
  const outline = isWhite ? '#65707B' : '#05080D';
  const highlight = '#FFFFFF';

  const defs = (
    <defs>
      <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={bodyDark} />
        <stop offset="0.17" stopColor={body} />
        <stop offset="0.43" stopColor={bodyMid} />
        <stop offset="0.58" stopColor={body} />
        <stop offset="0.84" stopColor={bodyDark} />
        <stop offset="1" stopColor={bodyDark} />
      </linearGradient>

      <linearGradient id={darkId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={body} />
        <stop offset="0.55" stopColor={bodyDark} />
        <stop offset="1" stopColor={isWhite ? '#AAA59A' : '#05080C'} />
      </linearGradient>

      <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="0.42" stopColor="#FFFFFF" stopOpacity={isWhite ? '0.82' : '0.76'} />
        <stop offset="0.62" stopColor="#FFFFFF" stopOpacity="0.14" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
  );

  const shadow = (
    <ellipse
      cx="50"
      cy="94"
      rx="33"
      ry="3"
      fill="#000"
      opacity={isWhite ? '0.16' : '0.34'}
    />
  );

  const base = (
    <g>
      {/* bottom foot */}
      <path
        d="M17 89.5
           Q18 85.8 23 83.7
           Q30 80.6 37 79.8
           H63
           Q70 80.6 77 83.7
           Q82 85.8 83 89.5
           L82 92.7
           Q81.5 94 78.5 94
           H21.5
           Q18.5 94 18 92.7 Z"
        fill={`url(#${darkId})`}
        stroke={outline}
        strokeWidth="1.35"
      />

      {/* upper base rim */}
      <path
        d="M24 84.1 Q50 81.2 76 84.1 Q75 86.8 72 87.4 H28 Q25 86.8 24 84.1 Z"
        fill={`url(#${bodyId})`}
        stroke={outline}
        strokeWidth="1.1"
      />

      {/* strong polished reflections */}
      <path
        d="M21 89.4 Q50 87 79 89.4"
        fill="none"
        stroke={highlight}
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity={isWhite ? '0.8' : '0.82'}
      />
      <path
        d="M24 92 Q50 90.7 76 92"
        fill="none"
        stroke={highlight}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity={isWhite ? '0.46' : '0.55'}
      />
    </g>
  );

  const ring = (cy: number, rx: number, ry = 2.1) => (
    <ellipse
      cx="50"
      cy={cy}
      rx={rx}
      ry={ry}
      fill={`url(#${darkId})`}
      stroke={outline}
      strokeWidth="1.05"
    />
  );

  const stemHighlight = (d: string, opacity = 0.8) => (
    <path
      d={d}
      fill="none"
      stroke={highlight}
      strokeWidth="1.45"
      strokeLinecap="round"
      opacity={opacity}
    />
  );

  switch (type) {
    case 'p':
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {defs}
          {shadow}

          {/* PAWN — broader shoulder and heavier classic base */}
          <path
            d="M50 12.5
               C43.2 12.5 38.2 17.7 38.2 24.3
               C38.2 29.2 40.8 33 45.2 35
               C40.3 36 36.6 37.8 36.6 39.9
               C36.6 41.7 39.1 43 43 43.6
               C42.2 50.2 40.7 59.4 37.4 71.8
               C36.7 74.1 34.8 75.5 31.4 77.2
               Q28.5 78.6 31.4 80.5
               Q33.5 81.5 37.1 82
               Q29.2 83.3 23.4 87.1
               Q20.4 89.1 20 92.2
               Q20 94 23 94
               H77 Q80 94 80 92.2
               Q79.6 89.1 76.6 87.1
               Q70.8 83.3 62.9 82
               Q66.5 81.5 68.6 80.5
               Q71.5 78.6 68.6 77.2
               C65.2 75.5 63.3 74.1 62.6 71.8
               C59.3 59.4 57.8 50.2 57 43.6
               C60.9 43 63.4 41.7 63.4 39.9
               C63.4 37.8 59.7 36 54.8 35
               C59.2 33 61.8 29.2 61.8 24.3
               C61.8 17.7 56.8 12.5 50 12.5 Z"
            fill={`url(#${bodyId})`}
            stroke={outline}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          <path
            d="M41.2 23.5 C41.3 18.5 44.5 15.3 48.1 14.4"
            fill="none"
            stroke={highlight}
            strokeWidth="1.65"
            strokeLinecap="round"
            opacity={isWhite ? '0.82' : '0.7'}
          />

          {ring(40, 13.7, 2.1)}

          {stemHighlight(
            "M44 45 C42.2 53 41 63.5 38.5 71.5",
            isWhite ? 0.82 : 0.68
          )}

          <path
            d="M37 77.3 Q50 75.3 63 77.3"
            fill="none"
            stroke={highlight}
            strokeWidth="1.15"
            opacity={isWhite ? '0.65' : '0.65'}
          />

          {base}
        </svg>
      );

    case 'r':
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {defs}
          {shadow}

          {/* ROOK — classic four-merlon Staunton crown */}
          <path
            d="M18.5 16.5
               H30.5 V24.8 H38 V18 H47 V24.8
               H53 V18 H62 V24.8 H69.5 V16.5 H81.5
               L80 29
               Q79.7 31 74 32.7
               Q67.4 35 66.1 40.8
               C64.8 50.8 65.5 62.5 68.4 72
               Q69.2 74.3 72 76
               Q73.5 77.5 70.5 79.2
               Q67.1 81 62.5 81.5
               H37.5
               Q32.9 81 29.5 79.2
               Q26.5 77.5 28 76
               Q30.8 74.3 31.6 72
               C34.5 62.5 35.2 50.8 33.9 40.8
               Q32.6 35 26 32.7
               Q20.3 31 20 29 Z"
            fill={`url(#${bodyId})`}
            stroke={outline}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          <path d="M20.5 28.9 Q50 26.8 79.5 28.9"
            fill="none" stroke={highlight} strokeWidth="1.45"
            opacity={isWhite ? '0.78' : '0.7'} />

          {stemHighlight(
            "M35.5 39.5 C37 49 36.7 61.5 33.8 71.2",
            isWhite ? 0.8 : 0.67
          )}

          {ring(77, 20, 2.25)}
          {base}
        </svg>
      );

    case 'n':
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {defs}
          {shadow}

          {/* KNIGHT — classic Staunton horse, cleaner and more substantial */}
          <path
            d="M34.5 82
               C34.8 75 34.1 68.2 33.2 61
               C32 51.2 34 43.2 39.3 36.8
               C43.2 32.1 48.2 28.7 54.2 25.8
               C56.2 21.2 56.7 16.2 54.8 11.5
               C59.6 13.2 63 17.3 64.2 22.2
               C67.1 19.7 71.1 17.6 75.1 17.2
               C74.3 23 72.3 27.6 68.4 31.9
               C74 32.1 79.4 34.2 82.6 38.2
               C85.8 42.1 86.5 46.9 84.5 50.8
               C82.4 54.9 77.9 56.7 72.6 56.5
               L65.1 55.7
               C61.5 61.4 60.5 67.9 62.5 74
               L66.5 82 Z

               M40 37
               C34.5 38.2 28.6 40.2 23.7 43
               C19.2 45.6 16.6 48.3 15.8 50.5
               C16.8 52.6 20.2 53.1 24.3 51.9
               L31.7 49.5
               C29.3 52.7 28.3 55.4 29.1 57.2
               C30.6 59.7 35 58.6 39.5 54.6
               L45.1 49.2
               C48.3 45.9 47.3 41.2 44 38 Z"
            fill={`url(#${bodyId})`}
            stroke={outline}
            strokeWidth="1.55"
            strokeLinejoin="round"
          />

          {/* eye */}
          <ellipse cx="67.3" cy="39.3" rx="2.5" ry="2.25"
            fill={isWhite ? '#4B5563' : '#03060A'} />
          <circle cx="68" cy="38.7" r="0.7" fill="#fff" opacity="0.9" />

          {/* nostril */}
          <ellipse cx="20.8" cy="49.3" rx="1.9" ry="1.15" fill={outline} />

          {/* jaw / mouth */}
          <path d="M16.5 53.7 Q22.5 55.7 29.8 52.7"
            fill="none" stroke={outline} strokeWidth="1"
            strokeLinecap="round" />

          {/* mane ridges */}
          <path d="M56.5 27 C51.2 35 47.6 43 46.8 51 C46 61 48.8 70.8 43 81"
            fill="none" stroke={highlight} strokeWidth="1.9"
            strokeLinecap="round" opacity={isWhite ? '0.68' : '0.58'} />
          <path d="M61.8 29 C57 36.5 54 44 54 51"
            fill="none" stroke={outline} strokeWidth="1.35" opacity="0.75" />

          {/* ears */}
          <path d="M59 15 Q61.3 20 61.2 24.2"
            fill="none" stroke={highlight} strokeWidth="1.15"
            strokeLinecap="round" opacity="0.7" />
          <path d="M72.4 20 Q70.6 25.2 67.9 29.2"
            fill="none" stroke={highlight} strokeWidth="1.15"
            strokeLinecap="round" opacity="0.65" />

          {/* chest highlight */}
          {stemHighlight(
            "M37.5 50 C35.6 59 36.8 69.4 39.2 77.8",
            isWhite ? 0.74 : 0.62
          )}

          {base}
        </svg>
      );

    case 'b':
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {defs}
          {shadow}

          {/* BISHOP — tall, narrow mitre with unmistakable diagonal cut */}
          <path
            d="M50 7.5
               C47.5 7.5 45.8 9.3 45.8 11.7
               C45.8 13.2 46.6 14.2 47.8 14.8
               C40.7 17.6 36.1 24.3 36.1 31.7
               C36.1 38 39.5 42.4 43.7 44.3
               C39.7 45 36.8 46.3 36.8 48.1
               C36.8 49.9 39.4 51.1 43 51.7
               C41.5 58.2 39.8 66 36.3 72.5
               Q35 74.8 31 76.5
               Q28.2 78 31.1 79.6
               Q33.8 81 37 81.6
               Q29.2 83 23 87
               Q20.1 89 19.6 92.4
               Q19.6 94 22.8 94
               H77.2
               Q80.4 94 80.4 92.4
               Q79.9 89 77 87
               Q70.8 83 63 81.6
               Q66.2 81 68.9 79.6
               Q71.8 78 69 76.5
               Q65 74.8 63.7 72.5
               C60.2 66 58.5 58.2 57 51.7
               C60.6 51.1 63.2 49.9 63.2 48.1
               C63.2 46.3 60.3 45 56.3 44.3
               C60.5 42.4 63.9 38 63.9 31.7
               C63.9 24.3 59.3 17.6 52.2 14.8
               C53.4 14.2 54.2 13.2 54.2 11.7
               C54.2 9.3 52.5 7.5 50 7.5 Z"
            fill={`url(#${bodyId})`}
            stroke={outline}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* classic bishop slit */}
          <path d="M56.8 18.2 L43.1 31.8 L46.8 34.2 L59 20.2 Z"
            fill={isWhite ? '#606A75' : '#05080D'}
            stroke={outline} strokeWidth="0.75" />

          <path d="M40 27 C38.3 33.2 40.2 39.4 43.5 42.2"
            fill="none" stroke={highlight} strokeWidth="1.6"
            strokeLinecap="round" opacity={isWhite ? '0.8' : '0.64'} />

          {stemHighlight(
            "M43 53 C41.5 60.5 40 67 37.4 72.2",
            isWhite ? 0.8 : 0.66
          )}

          {ring(48, 13.4, 2.15)}
          {base}
        </svg>
      );

    case 'q':
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {defs}
          {shadow}

          {/* QUEEN — classic broad five-point coronet */}
          <path
            d="M50 6.5
               C47.5 6.5 45.8 8.2 45.8 10.3
               C45.8 11.8 46.7 12.9 48 13.6
               L41.8 19.7
               C39.3 22 36.7 20.2 34.1 18.1
               L30.6 16.1
               C31.2 22.9 34.3 28.9 40.3 32.1
               C36.8 33.6 34.3 35.2 34.3 37.2
               C34.3 39.2 37 40.5 41.3 41.2
               C39.2 48.5 37.5 59.2 34.2 72.5
               Q33 74.7 29 76.5
               Q26.3 78 29.1 79.6
               Q32.2 81 35.9 81.6
               Q28 83 21.7 87
               Q18.7 89 18.2 92.4
               Q18.2 94 21.5 94
               H78.5
               Q81.8 94 81.8 92.4
               Q81.3 89 78.3 87
               Q72 83 64.1 81.6
               Q67.8 81 70.9 79.6
               Q73.7 78 71 76.5
               Q67 74.7 65.8 72.5
               C62.5 59.2 60.8 48.5 58.7 41.2
               C63 40.5 65.7 39.2 65.7 37.2
               C65.7 35.2 63.2 33.6 59.7 32.1
               C65.7 28.9 68.8 22.9 69.4 16.1
               L65.9 18.1
               C63.3 20.2 60.7 22 58.2 19.7
               L52 13.6
               C53.3 12.9 54.2 11.8 54.2 10.3
               C54.2 8.2 52.5 6.5 50 6.5 Z"
            fill={`url(#${bodyId})`}
            stroke={outline}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          <path d="M31.8 18 Q50 29.2 68.2 18"
            fill="none" stroke={highlight} strokeWidth="1.35"
            opacity={isWhite ? '0.76' : '0.65'} />
          <path d="M35.7 23 Q50 30.8 64.3 23"
            fill="none" stroke={outline} strokeWidth="1"
            opacity="0.68" />

          {ring(37.2, 15.1, 2.15)}

          {stemHighlight(
            "M41.8 43 C40 52.5 38.8 63 36 72",
            isWhite ? 0.82 : 0.68
          )}

          {base}
        </svg>
      );

    case 'k':
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {defs}
          {shadow}

          {/* KING — dominant Staunton crown and cross */}
          <path
            d="M46 3 H54 V7.2 H58.2 V12 H53.5 V14.7
               C59.2 16 64.1 19.3 65.8 24
               Q67 27.4 71 29.8
               Q67.8 32 61 33
               Q65.7 34.3 66.2 37.2
               Q66.4 40.2 58.2 41
               C60.2 49.5 61.9 60.5 65.7 72.5
               Q66.8 74.8 70.8 76.5
               Q73.7 78 70.9 79.6
               Q67.8 81 64.1 81.6
               Q72 83 78.3 87
               Q81.3 89 81.8 92.4
               Q81.8 94 78.5 94
               H21.5
               Q18.2 94 18.2 92.4
               Q18.7 89 21.7 87
               Q28 83 35.9 81.6
               Q32.2 81 29.1 79.6
               Q26.3 78 29.2 76.5
               Q33.2 74.8 34.3 72.5
               C38.1 60.5 39.8 49.5 41.8 41
               Q33.6 40.2 33.8 37.2
               Q34.3 34.3 39 33
               Q32.2 32 29 29.8
               Q33 27.4 34.2 24
               C35.9 19.3 40.8 16 46.5 14.7
               V12 H41.8 V7.2 H46 Z"
            fill={`url(#${bodyId})`}
            stroke={outline}
            strokeWidth="1.55"
            strokeLinejoin="round"
          />

          {/* cross highlight */}
          <path d="M48 4.8 H52 V8.4 H55.8 V10.3 H52 V14"
            fill="none" stroke={highlight} strokeWidth="1.35"
            strokeLinecap="round" opacity={isWhite ? '0.84' : '0.72'} />

          <path d="M45.8 16.2 C41.2 18.3 37.5 22.2 36.2 26.7"
            fill="none" stroke={highlight} strokeWidth="1.65"
            strokeLinecap="round" opacity={isWhite ? '0.82' : '0.68'} />

          <path d="M31.5 30 Q50 27.8 68.5 30"
            fill="none" stroke={highlight} strokeWidth="1.4"
            opacity={isWhite ? '0.78' : '0.7'} />

          {ring(38, 16, 2.2)}

          {stemHighlight(
            "M42.8 43 C40.9 52.5 39.5 64 36.5 72",
            isWhite ? 0.84 : 0.7
          )}

          {base}
        </svg>
      );

    default:
      return null;
  }
});

StauntonChessPiece.displayName = 'StauntonChessPiece';
