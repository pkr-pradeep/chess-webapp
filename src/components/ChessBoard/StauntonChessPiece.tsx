import React from 'react';
import { PieceSymbol, Color } from 'chess.js';

interface StauntonChessPieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

/**
 * Staunton Chess Pieces modeled with 100% fidelity to the classic luxury Staunton set
 * as depicted in Adobe Stock #249534780 (glossy silhouette with white specular highlights).
 */
export const StauntonChessPiece: React.FC<StauntonChessPieceProps> = React.memo(({
  type,
  color,
  className = 'w-full h-full'
}) => {
  const isWhite = color === 'w';

  // Palette definition
  // Black pieces: Deep jet-black lacquer with brilliant white specular highlights exactly as in photo
  // White pieces: Royal ivory-white with deep slate contouring and crisp gloss highlights
  const mainFill = isWhite ? '#F8FAFC' : '#11161F';
  const strokeColor = isWhite ? '#1E293B' : '#090D14';
  const strokeWidth = isWhite ? 1.6 : 1.2;
  const highlightFill = '#FFFFFF';
  const highlightOpacity = isWhite ? 0.75 : 0.95;
  const shadowFill = isWhite ? '#E2E8F0' : '#0B0F16';

  switch (type) {
    case 'p': // PAWN
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base Drop Shadow for depth */}
          <ellipse cx="50" cy="94" rx="28" ry="3.5" fill="black" opacity="0.18" />

          {/* Main Pawn Silhouette */}
          <path
            d="
              M 50 13.5
              C 44.2 13.5 39.5 18.2 39.5 24
              C 39.5 28.5 42.4 32.3 46.5 33.7
              C 41.5 34.8 37.5 36.8 37.5 38.5
              C 37.5 40 40 41.2 43.5 41.8
              C 42 48 40.5 56 36.5 73.5
              C 34.5 74.2 33 75.3 33 76.5
              C 33 77.8 34.8 78.8 37.2 79.4
              C 34 81 26 84.5 24 88
              L 23 92.5
              C 23 93.5 24 94 25.5 94
              L 74.5 94
              C 76 94 77 93.5 77 92.5
              L 76 88
              C 74 84.5 66 81 62.8 79.4
              C 65.2 78.8 67 77.8 67 76.5
              C 67 75.3 65.5 74.2 63.5 73.5
              C 59.5 56 58 48 56.5 41.8
              C 60 41.2 62.5 40 62.5 38.5
              C 62.5 36.8 58.5 34.8 53.5 33.7
              C 57.6 32.3 60.5 28.5 60.5 24
              C 60.5 18.2 55.8 13.5 50 13.5
              Z
            "
            fill={mainFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* White Shading Accent for White Pieces */}
          {isWhite && (
            <path
              d="
                M 50 14.5
                C 45 14.5 40.5 18.7 40.5 24
                C 40.5 28 43 31.5 47 33
                C 42.5 34.5 38.5 36.5 38.5 38.5
                C 38.5 39.8 41 40.8 44 41.5
                C 42.5 48 41 56 37.5 73.5
                L 62.5 73.5
                C 59 56 57.5 48 56 41.5
                C 59 40.8 61.5 39.8 61.5 38.5
                C 61.5 36.5 57.5 34.5 53 33
                C 57 31.5 59.5 28 59.5 24
                C 59.5 18.7 55 14.5 50 14.5
                Z
              "
              fill={shadowFill}
              opacity="0.25"
            />
          )}

          {/* Exact Specular Highlights as seen in Adobe Stock #249534780 */}
          {/* 1. Ball head crescent highlight */}
          <path
            d="M 42 24 C 41 20 43 16.5 47 15 C 45 17 43.5 20.5 44 24.5 C 44 25.5 42.2 25.5 42 24 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* 2. Collar ring highlight */}
          <path
            d="M 41 38.5 C 45 37.8 54 37.8 58 38.5 C 54 39.2 45 39.2 41 38.5 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.85}
          />

          {/* 3. Stem left curvature reflection */}
          <path
            d="M 44 44 C 42.8 51 42 59 38.5 71.5 C 39.8 61 41 51 45.2 44 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* 4. Torus ring highlight */}
          <path
            d="M 37 77 C 43 76.2 56 76.2 62 77 C 56 77.8 43 77.8 37 77 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.75}
          />

          {/* 5. Broad base horizontal reflection */}
          <path
            d="M 28 89 C 38 87.8 52 87.8 63 89.2 C 52 90.5 38 90.5 28 89 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />
        </svg>
      );

    case 'r': // ROOK (CASTLE)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="94" rx="31" ry="3.5" fill="black" opacity="0.18" />

          {/* Main Rook Silhouette: 4 merlons, 3 crenels, flared corbel, tapered shaft, tiered base */}
          <path
            d="
              M 22 17.5
              L 28.5 17.5
              L 28.5 25
              L 36 25
              L 36 18.5
              L 44.5 18.5
              L 44.5 25
              L 55.5 25
              L 55.5 18.5
              L 64 18.5
              L 64 25
              L 71.5 25
              L 71.5 17.5
              L 78 17.5
              L 77 28.5
              C 77 30 74 31 71 31.5
              C 67 34 65.5 37 65.5 40
              C 64.5 50 65.5 62 67.5 73.5
              C 69.5 74.2 71 75.3 71 76.5
              C 71 77.8 69.2 78.8 66.8 79.4
              C 70 81 78 84.5 80 88
              L 81 92.5
              C 81 93.5 80 94 78.5 94
              L 21.5 94
              C 20 94 19 93.5 19 92.5
              L 20 88
              C 22 84.5 30 81 33.2 79.4
              C 30.8 78.8 29 77.8 29 76.5
              C 29 75.3 30.5 74.2 32.5 73.5
              C 34.5 62 35.5 50 34.5 40
              C 34.5 37 33 34 29 31.5
              C 26 31 23 30 23 28.5
              L 22 17.5
              Z
            "
            fill={mainFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {isWhite && (
            <path
              d="
                M 24 28.5
                H 76
                V 31
                C 71 32.5 66 35 66 40
                C 65 50 66 62 68 73.5
                H 32
                C 34 62 35 50 34 40
                C 34 35 29 32.5 24 31
                Z
              "
              fill={shadowFill}
              opacity="0.25"
            />
          )}

          {/* Highlights */}
          {/* 1. Under-battlement horizontal rim */}
          <path
            d="M 26 29.5 C 36 29 64 29 74 29.5 C 64 30.2 36 30.2 26 29.5 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.9}
          />

          {/* 2. Tower neck highlight */}
          <path
            d="M 33 34 C 40 33.2 60 33.2 67 34 C 60 34.8 40 34.8 33 34 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.75}
          />

          {/* 3. Long tower left flank specular streak */}
          <path
            d="M 35.5 40 C 36.5 50 36 61 33.5 71.5 C 35 61 36 50 36.8 40 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* 4. Torus ring reflection */}
          <path
            d="M 33 77 C 42 76.2 58 76.2 67 77 C 58 77.8 42 77.8 33 77 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.75}
          />

          {/* 5. Broad base horizontal reflection */}
          <path
            d="M 25 89 C 36 87.8 54 87.8 67 89.2 C 54 90.5 36 90.5 25 89 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />
        </svg>
      );

    case 'n': // KNIGHT (HORSE)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="94" rx="31" ry="3.5" fill="black" opacity="0.18" />

          {/* Main Knight Silhouette: Facing left, pointed ear, chiseled snout, 4 stylized mane crests */}
          <path
            d="
              M 30.5 13
              C 30.5 13 32 17.5 31.5 21
              C 28 23 21 27 18 30.5
              C 16 33 16 34.5 17 35.5
              C 17.8 36.2 19.5 35.5 21.5 34
              C 21.8 34.8 21.5 36.5 19.5 38.5
              C 18.5 39.5 19.5 40.5 21 40
              C 24.5 38.5 27 34.5 29 33.5
              C 27.5 37.5 27 42 29 46
              C 27.5 50 29.5 58 32.5 65
              C 34.5 69.5 35.5 73.5 35.5 73.5
              C 33.5 74.2 32 75.3 32 76.5
              C 32 77.8 33.8 78.8 36.2 79.4
              C 33 81 25 84.5 23 88
              L 22 92.5
              C 22 93.5 23 94 24.5 94
              L 76.5 94
              C 78 94 79 93.5 79 92.5
              L 78 88
              C 76 84.5 68 81 64.8 79.4
              C 67.2 78.8 69 77.8 69 76.5
              C 69 75.3 67.5 74.2 65.5 73.5
              C 65.5 73.5 66 69 64 61
              C 68.5 58 72 50 72 44
              C 70.5 45.5 67 47 65.5 47
              C 69.5 42 72.5 36 71 30
              C 69 31.5 66 33 64.5 33
              C 67.5 27 69 21 66 16
              C 63.5 18 60 20 57.5 20.5
              C 58 17 56 14 51.5 11.5
              C 48 13.5 44 14.5 41 14.8
              C 39 12 36 10.5 34 10.5
              C 32 10.5 30.5 13 30.5 13
              Z
            "
            fill={mainFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Stylized Mane cutaway slits matching photo */}
          {/* Slit between Tuft 1 & 2 */}
          <path
            d="M 57.5 20.5 C 53 23 48 24 45 23.5"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Slit between Tuft 2 & 3 */}
          <path
            d="M 64.5 33 C 58 35 52 36 48 34"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Slit between Tuft 3 & 4 */}
          <path
            d="M 65.5 47 C 59 48 53 47 50 44"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Knight's Distinct Carved Eye & Brow */}
          <path
            d="M 24 24.5 C 27 24.5 29 27 28 29 C 25.5 29 23.5 26.5 24 24.5 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />
          <path
            d="M 23 23 C 26 22 29 23.5 30 25"
            stroke={highlightFill}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={highlightOpacity}
          />

          {/* Nostril & Mouth Highlight */}
          <path
            d="M 18.5 34.5 C 20.5 33.5 22 34 22 34"
            stroke={highlightFill}
            strokeWidth="1"
            strokeLinecap="round"
            opacity={highlightOpacity * 0.8}
          />

          {/* Chest Specular Highlight Curve */}
          <path
            d="M 30.5 48 C 29 55 31 63 34 71 C 32.5 63 31.5 55 32 48 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* Mane crest highlight lines */}
          <path
            d="M 43 16 C 47 18 52 23 54 28"
            stroke={highlightFill}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={highlightOpacity * 0.7}
          />
          <path
            d="M 49 31 C 53 35 58 40 60 46"
            stroke={highlightFill}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={highlightOpacity * 0.7}
          />

          {/* Base Horizontal Reflection */}
          <path
            d="M 28 89 C 38 87.8 54 87.8 66 89.2 C 54 90.5 38 90.5 28 89 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />
        </svg>
      );

    case 'b': // BISHOP
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="94" rx="30" ry="3.5" fill="black" opacity="0.18" />

          {/* Main Bishop Silhouette: Finial ball, oval mitre with deep right-hand cut, waisted stem, flared base */}
          <path
            d="
              M 50 9
              C 48 9 46.5 10.5 46.5 12.5
              C 46.5 13.5 47 14.3 48 14.8
              C 41 17.5 36.5 24 36.5 31
              C 36.5 37 40 41.5 44 43.5
              C 40 44.5 37 46 37 47.5
              C 37 49 39.5 50.2 43 50.8
              C 41.5 57 40 64 36 73.5
              C 34 74.2 32.5 75.3 32.5 76.5
              C 32.5 77.8 34.3 78.8 36.7 79.4
              C 33.5 81 25.5 84.5 23.5 88
              L 22.5 92.5
              C 22.5 93.5 23.5 94 25 94
              L 75 94
              C 76.5 94 77.5 93.5 77.5 92.5
              L 76.5 88
              C 74.5 84.5 66.5 81 63.3 79.4
              C 65.7 78.8 67.5 77.8 67.5 76.5
              C 67.5 75.3 66 74.2 64 73.5
              C 60 64 58.5 57 57 50.8
              C 60.5 50.2 63 49 63 47.5
              C 63 46 60 44.5 56 43.5
              C 60 41.5 63.5 37 63.5 31
              C 63.5 24 59 17.5 52 14.8
              C 53 14.3 53.5 13.5 53.5 12.5
              C 53.5 10.5 52 9 50 9
              Z
            "
            fill={mainFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* The Classic Bishop's Mitre Cut (Distinctive diagonal slash on right side) */}
          <path
            d="M 54 20 L 44 30 L 46 32 L 57 21 Z"
            fill={isWhite ? '#1E293B' : '#0B0F16'}
            stroke={isWhite ? '#1E293B' : '#FFFFFF'}
            strokeWidth="0.8"
          />

          {/* Highlights */}
          {/* 1. Finial ball highlight */}
          <circle cx="49" cy="11.5" r="1" fill={highlightFill} opacity={highlightOpacity} />

          {/* 2. Oval Mitre left specular curve */}
          <path
            d="M 39 26 C 37.5 30 38.5 35 41.5 39 C 40 35 39 30 40.5 26 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* 3. Collar highlight */}
          <path
            d="M 40 47.5 C 45 46.8 55 46.8 60 47.5 C 55 48.2 45 48.2 40 47.5 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.85}
          />

          {/* 4. Stem left reflection streak */}
          <path
            d="M 43.5 53 C 42.2 60 41.5 67 38 72 C 39.5 65 40.5 58 44.5 53 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* 5. Torus highlight */}
          <path
            d="M 36 77 C 43 76.2 57 76.2 64 77 C 57 77.8 43 77.8 36 77 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.75}
          />

          {/* 6. Base horizontal reflection */}
          <path
            d="M 27 89 C 38 87.8 53 87.8 65 89.2 C 53 90.5 38 90.5 27 89 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />
        </svg>
      );

    case 'q': // QUEEN
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="94" rx="33" ry="3.5" fill="black" opacity="0.18" />

          {/* Main Queen Silhouette: Finial bead, scalloped 5-point coronet crown, double collar, tapered stem, stately base */}
          <path
            d="
              M 50 8.5
              C 48.5 8.5 47.2 9.7 47.2 11.2
              C 47.2 12.2 47.8 13 48.6 13.5
              C 46 16.5 42 20 39.5 17.5
              C 38 16 35 22 31.5 21
              C 33 26 36 31 41 33.5
              C 37.5 34.8 35 36.5 35 38
              C 35 39.5 37.5 40.8 41.5 41.5
              C 39.5 48 38 56 34.5 73.5
              C 32 74.2 30.5 75.3 30.5 76.5
              C 30.5 77.8 32.5 78.8 35.2 79.4
              C 32 81 23 84.5 21 88
              L 20 92.5
              C 20 93.5 21 94 22.5 94
              L 77.5 94
              C 79 94 80 93.5 80 92.5
              L 79 88
              C 77 84.5 68 81 64.8 79.4
              C 67.5 78.8 69.5 77.8 69.5 76.5
              C 69.5 75.3 68 74.2 65.5 73.5
              C 62 56 60.5 48 58.5 41.5
              C 62.5 40.8 65 39.5 65 38
              C 65 36.5 62.5 34.8 59 33.5
              C 64 31 67 26 68.5 21
              C 65 22 62 16 60.5 17.5
              C 58 20 54 16.5 51.4 13.5
              C 52.2 13 52.8 12.2 52.8 11.2
              C 52.8 9.7 51.5 8.5 50 8.5
              Z
            "
            fill={mainFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Coronet Inner Scallop Shadow/Structure */}
          <path
            d="
              M 31.5 21
              C 35 25 43 27 50 27
              C 57 27 65 25 68.5 21
              C 66 26 59 31 50 31
              C 41 31 34 26 31.5 21
              Z
            "
            fill={isWhite ? shadowFill : '#0A0E15'}
            opacity={isWhite ? 0.35 : 0.85}
          />

          {/* Highlights */}
          {/* 1. Finial bead highlight */}
          <circle cx="49" cy="10.5" r="1" fill={highlightFill} opacity={highlightOpacity} />

          {/* 2. Crown Left Crest Reflection */}
          <path
            d="M 33 22 C 34.5 26 37 29 41 32 C 38.5 29 36 26 34.5 22 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* 3. Upper Collar Rim */}
          <path
            d="M 38 38 C 43 37.2 57 37.2 62 38 C 57 38.8 43 38.8 38 38 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.85}
          />

          {/* 4. Long Stem Specular Highlight */}
          <path
            d="M 42 43 C 40.5 51 39.5 60 36 71.5 C 37.5 60 38.5 51 43.2 43 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* 5. Torus Highlight */}
          <path
            d="M 34 77 C 42 76.2 58 76.2 66 77 C 58 77.8 42 77.8 34 77 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.75}
          />

          {/* 6. Base Reflection */}
          <path
            d="M 25 89 C 36 87.8 54 87.8 67 89.2 C 54 90.5 36 90.5 25 89 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />
        </svg>
      );

    case 'k': // KING
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="94" rx="34" ry="3.5" fill="black" opacity="0.18" />

          {/* Main King Silhouette: Latin Cross Pattee on apex, domed royal crown cap, flared rim, thick neck collar, tapered shaft, grand stepped base */}
          <path
            d="
              M 48 4
              L 52 4
              L 52 7
              L 56.5 7
              L 56.5 10.5
              L 52 10.5
              L 52 13.5
              C 57 14.5 63 17 64.5 21.5
              C 66 25 68 26.5 69.5 28
              C 67 29.5 62 30.5 58 31
              C 62 32.2 64.5 33.8 64.5 35.5
              C 64.5 37.2 61.5 38.8 57 39.5
              C 60 48 61.5 57 65.5 73.5
              C 68 74.2 70 75.3 70 76.5
              C 70 77.8 68 78.8 65 79.4
              C 68 81 77 84.5 79 88
              L 80 92.5
              C 80 93.5 79 94 77.5 94
              L 22.5 94
              C 21 94 20 93.5 20 92.5
              L 21 88
              C 23 84.5 32 81 35 79.4
              C 32 78.8 30 77.8 30 76.5
              C 30 75.3 32 74.2 34.5 73.5
              C 38.5 57 40 48 43 39.5
              C 38.5 38.8 35.5 37.2 35.5 35.5
              C 35.5 33.8 38 32.2 42 31
              C 38 30.5 33 29.5 30.5 28
              C 32 26.5 34 25 35.5 21.5
              C 37 17 43 14.5 48 13.5
              L 48 10.5
              L 43.5 10.5
              L 43.5 7
              L 48 7
              L 48 4
              Z
            "
            fill={mainFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Highlights */}
          {/* 1. Latin Cross Specular Highlight */}
          <path
            d="M 48.5 5.5 H 51.5 V 7.5 H 55.5 V 9.5 H 51.5 V 13"
            stroke={highlightFill}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={highlightOpacity}
          />

          {/* 2. Crown Dome Left Contour */}
          <path
            d="M 46 15 C 41 17 37 21 36 26 C 38 22 42 18 47 16 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* 3. Crown Rim Highlight */}
          <path
            d="M 33 28.5 C 41 27.5 59 27.5 67 28.5 C 59 29.5 41 29.5 33 28.5 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.9}
          />

          {/* 4. Neck Collar Highlight */}
          <path
            d="M 38 35.5 C 44 34.8 56 34.8 62 35.5 C 56 36.2 44 36.2 38 35.5 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.85}
          />

          {/* 5. Majestic Stem Specular Highlight */}
          <path
            d="M 43 41 C 41.5 50 40 60 36 71.5 C 37.8 60 39.5 50 44.5 41 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />

          {/* 6. Torus Highlight */}
          <path
            d="M 34 77 C 42 76.2 58 76.2 66 77 C 58 77.8 42 77.8 34 77 Z"
            fill={highlightFill}
            opacity={highlightOpacity * 0.75}
          />

          {/* 7. Stately Grand Base Reflection */}
          <path
            d="M 24 89 C 36 87.8 54 87.8 68 89.2 C 54 90.5 36 90.5 24 89 Z"
            fill={highlightFill}
            opacity={highlightOpacity}
          />
        </svg>
      );

    default:
      return null;
  }
});
