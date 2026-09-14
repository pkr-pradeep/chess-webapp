import React from 'react';
import { PieceSymbol, Color } from 'chess.js';

interface IndianChessPieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

/**
 * INDIAN ROYAL CHESS SET
 *
 * Designed specifically for a chessboard UI.
 *
 * IMPORTANT:
 * - These are NOT generic Staunton pieces.
 * - King / Queen / Bishop / Pawn are human royal-guard figures.
 * - Knight is a ceremonial Indian horse.
 * - Rook is an Indian fort/palace.
 * - Every piece has Indian jewelry.
 * - King has a prominent kalgi feather.
 * - White and black use the same silhouettes so the two armies match.
 *
 * Keep the viewBox at 0 0 100 100. This makes the pieces occupy the board
 * cell much better than the previous 100x160 artwork.
 */
export const IndianChessPiece: React.FC<IndianChessPieceProps> = React.memo(({
  type,
  color,
  className = 'w-full h-full',
}) => {
  const white = color === 'w';

  const outline = white ? '#24170d' : '#050403';
  const skin = white ? '#f7e4bd' : '#17100c';
  const cloth = white ? '#fff4d7' : '#15100d';
  const cloth2 = white ? '#ead09a' : '#241914';
  const gold = '#d39a22';
  const goldLight = '#f6d86c';
  const ruby = '#c51f2d';
  const emerald = '#15905f';
  const redCloth = '#9d1824';

  const id = `${white ? 'w' : 'b'}_${type}`;

  const defs = (
    <defs>
      <linearGradient id={`${id}_cloth`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={white ? '#fffdf3' : '#30221b'} />
        <stop offset=".5" stopColor={cloth} />
        <stop offset="1" stopColor={cloth2} />
      </linearGradient>

      <linearGradient id={`${id}_gold`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={goldLight} />
        <stop offset=".5" stopColor={gold} />
        <stop offset="1" stopColor="#80500d" />
      </linearGradient>

      <radialGradient id={`${id}_ruby`} cx=".3" cy=".25">
        <stop offset="0" stopColor="#ff8e82" />
        <stop offset=".4" stopColor={ruby} />
        <stop offset="1" stopColor="#630a12" />
      </radialGradient>

      <radialGradient id={`${id}_emerald`} cx=".3" cy=".25">
        <stop offset="0" stopColor="#8af0b8" />
        <stop offset=".4" stopColor={emerald} />
        <stop offset="1" stopColor="#06462f" />
      </radialGradient>
    </defs>
  );

  const Jewel = ({
    x, y, r = 2.1, green = false,
  }: { x: number; y: number; r?: number; green?: boolean }) => (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={`url(#${id}_${green ? 'emerald' : 'ruby'})`}
      stroke={outline}
      strokeWidth="0.8"
    />
  );

  const Base = ({ wide = 30 }: { wide?: number }) => (
    <g>
      <ellipse
        cx="50" cy="93" rx={wide} ry="4.2"
        fill={`url(#${id}_gold)`}
        stroke={outline} strokeWidth="1.7"
      />
      <path
        d={`M${50 - wide + 2} 91
            Q${50 - wide + 3} 84 38 81
            Q50 78 62 81
            Q${50 + wide - 3} 84 ${50 + wide - 2} 91 Z`}
        fill={`url(#${id}_cloth)`}
        stroke={outline} strokeWidth="1.7"
      />
      <path
        d={`M${50 - wide + 5} 84 Q50 88 ${50 + wide - 5} 84`}
        fill="none" stroke={gold} strokeWidth="1.4"
      />
      <Jewel x={38} y={85} r={1.35} green />
      <Jewel x={44} y={86.5} r={1.35} />
      <Jewel x={50} y={87} r={1.5} green />
      <Jewel x={56} y={86.5} r={1.35} />
      <Jewel x={62} y={85} r={1.35} green />
    </g>
  );

  const Turban = ({
    cx = 50,
    cy = 29,
    scale = 1,
    gem = true,
  }: {
    cx?: number;
    cy?: number;
    scale?: number;
    gem?: boolean;
  }) => (
    <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(-${cx} -${cy})`}>
      <path
        d={`M39 ${cy + 3}
            Q37 ${cy - 5} 42 ${cy - 9}
            Q46 ${cy - 13} 50 ${cy - 13}
            Q54 ${cy - 13} 58 ${cy - 9}
            Q63 ${cy - 5} 61 ${cy + 3}
            Q50 ${cy + 7} 39 ${cy + 3} Z`}
        fill={`url(#${id}_cloth)`}
        stroke={outline} strokeWidth="1.6"
      />
      <path d={`M40 ${cy - 2} Q50 ${cy + 4} 60 ${cy - 2}`}
            fill="none" stroke={gold} strokeWidth="2" />
      <path d={`M43 ${cy - 6} Q50 ${cy} 57 ${cy - 6}`}
            fill="none" stroke={goldLight} strokeWidth="1.5" />
      {gem && <Jewel x={50} y={cy - 4} r={2.5} />}
    </g>
  );

  const RoyalNecklace = ({ y = 56 }: { y?: number }) => (
    <g>
      <path
        d={`M38 ${y} Q50 ${y + 6} 62 ${y}`}
        fill="none" stroke={`url(#${id}_gold)`} strokeWidth="2.2"
      />
      <Jewel x={42} y={y + 1.5} r={1.5} green />
      <Jewel x={50} y={y + 4} r={2.1} />
      <Jewel x={58} y={y + 1.5} r={1.5} green />
    </g>
  );

  const Kalgi = () => (
    <g>
      <path
        d="M50 17
           Q45 12 47 5
           Q51 8 52 12
           Q55 7 61 6
           Q59 12 54 16
           Q58 14 62 16
           Q57 20 51 20 Z"
        fill={`url(#${id}_gold)`}
        stroke={outline} strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M51 18 Q50 11 48 7" fill="none"
            stroke={outline} strokeWidth=".7" />
      <Jewel x={50} y={19} r={1.5} green />
    </g>
  );

  const HumanBody = ({
    skirt = false,
    wide = false,
  }: { skirt?: boolean; wide?: boolean }) => (
    <g>
      {/* shoulders / torso */}
      <path
        d={wide
          ? "M34 82 Q35 65 40 57 Q50 52 60 57 Q65 65 66 82 L61 85 L39 85 Z"
          : "M37 82 Q38 65 42 57 Q50 53 58 57 Q62 65 63 82 Z"}
        fill={`url(#${id}_cloth)`}
        stroke={outline} strokeWidth="1.8"
      />

      {/* sash */}
      <path
        d="M57 56 Q51 64 43 82 L49 85 Q56 69 63 60 Z"
        fill={redCloth}
        stroke={outline} strokeWidth="1"
      />
      <path d="M59 58 Q52 69 47 82"
            fill="none" stroke={goldLight} strokeWidth="1.2" />
      <path d="M61 60 Q54 70 50 83"
            fill="none" stroke={gold} strokeWidth=".9" />

      {/* waist jewel belt */}
      <path d="M36 81 Q50 86 64 81 L64 85 Q50 90 36 85 Z"
            fill={`url(#${id}_gold)`}
            stroke={outline} strokeWidth="1" />
      <Jewel x={50} y={85} r={1.8} green />

      {/* arms */}
      <path d="M40 60 Q34 67 35 77 Q36 80 39 79 L43 68"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.7" />
      <path d="M60 60 Q66 67 65 77 Q64 80 61 79 L57 68"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.7" />

      {/* bracelets */}
      <path d="M35.5 74 Q38 75 40 74" fill="none" stroke={gold} strokeWidth="1.5" />
      <path d="M60 74 Q62 75 64.5 74" fill="none" stroke={gold} strokeWidth="1.5" />

      {/* lower robe */}
      {skirt ? (
        <path
          d="M38 84 Q37 88 35 91 L65 91 Q63 87 62 84 Z"
          fill={`url(#${id}_cloth)`}
          stroke={outline} strokeWidth="1.7"
        />
      ) : (
        <path
          d="M42 84 L44 91 L49 91 L50 84 L51 91 L56 91 L58 84 Z"
          fill={`url(#${id}_cloth)`}
          stroke={outline} strokeWidth="1.4"
        />
      )}
    </g>
  );

  switch (type) {
    // -------------------------------------------------------------------------
    // KING — Indian Maharaja: pagdi, kalgi, necklace, royal robe and jewels.
    // -------------------------------------------------------------------------
    case 'k':
      return (
        <svg viewBox="0 0 100 100" className={className}
             xmlns="http://www.w3.org/2000/svg">
          {defs}
          <Base wide={31} />

          <HumanBody wide />

          {/* head */}
          <ellipse cx="50" cy="38" rx="9" ry="11"
                   fill={skin} stroke={outline} strokeWidth="1.6" />

          <Turban cy={29} scale={1.08} />
          <Kalgi />

          {/* royal necklace */}
          <RoyalNecklace y={56} />

          {/* central royal medallion */}
          <path d="M46 61 L50 58 L54 61 L50 66 Z"
                fill={`url(#${id}_gold)`}
                stroke={outline} strokeWidth="1" />
          <Jewel x={50} y={62} r={1.5} green />

          {/* scepter */}
          <path d="M29 82 L29 55" stroke={gold} strokeWidth="1.6" />
          <path d="M29 53 L26.5 57 L29 59.5 L31.5 57 Z"
                fill={`url(#${id}_gold)`}
                stroke={outline} strokeWidth="1" />
          <Jewel x={29} y={56.5} r={1.1} />

          {/* shoes */}
          <path d="M43 90 Q40 92 43 93 L48 93"
                fill={outline} stroke={outline} strokeWidth="1" />
          <path d="M57 90 Q60 92 57 93 L52 93"
                fill={outline} stroke={outline} strokeWidth="1" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // QUEEN — Indian Maharani: lotus crown, veil, sari, jewelry.
    // -------------------------------------------------------------------------
    case 'q':
      return (
        <svg viewBox="0 0 100 100" className={className}
             xmlns="http://www.w3.org/2000/svg">
          {defs}
          <Base wide={31} />

          {/* sari / body */}
          <path
            d="M35 84 Q35 68 41 57 Q50 52 59 57
               Q65 68 65 84 L59 89 L41 89 Z"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.8"
          />
          {/* sari sash */}
          <path d="M58 55 Q49 65 41 85 L48 88 Q55 70 63 61 Z"
                fill={redCloth} stroke={outline} strokeWidth="1" />
          <path d="M59 57 Q51 70 45 85"
                fill="none" stroke={goldLight} strokeWidth="1.2" />

          {/* arms */}
          <path d="M41 60 Q35 68 37 77 Q39 79 41 77 L45 68"
                fill={`url(#${id}_cloth)`}
                stroke={outline} strokeWidth="1.7" />
          <path d="M59 60 Q65 68 63 77 Q61 79 59 77 L55 68"
                fill={`url(#${id}_cloth)`}
                stroke={outline} strokeWidth="1.7" />

          {/* bangles */}
          <path d="M37 73 Q39 74 41 73" fill="none" stroke={gold} strokeWidth="1.5" />
          <path d="M59 73 Q61 74 63 73" fill="none" stroke={gold} strokeWidth="1.5" />

          {/* head and long veil */}
          <ellipse cx="50" cy="39" rx="8.5" ry="10.5"
                   fill={skin} stroke={outline} strokeWidth="1.5" />
          <path
            d="M39 39 Q39 25 50 22 Q61 25 61 39
               L64 61 L59 67 L56 43 Q50 37 44 43 L41 67 L36 61 Z"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.4"
            opacity=".98"
          />

          {/* lotus crown */}
          <path
            d="M37 31
               Q40 22 45 27
               Q46 18 50 26
               Q54 18 55 27
               Q60 22 63 31
               Q57 34 50 33
               Q43 34 37 31 Z"
            fill={`url(#${id}_gold)`}
            stroke={outline} strokeWidth="1.3"
          />
          <Jewel x={45} y={28} r={1.7} green />
          <Jewel x={50} y={24} r={2.7} />
          <Jewel x={55} y={28} r={1.7} green />

          {/* maang tikka */}
          <path d="M50 31 L50 36" stroke={gold} strokeWidth="1.2" />
          <Jewel x={50} y={37} r={1.8} />

          <RoyalNecklace y={54} />
          <Jewel x={50} y={63} r={1.8} green />
        </svg>
      );

    // -------------------------------------------------------------------------
    // BISHOP — Indian royal priest / court scholar with pagdi and tilak.
    // -------------------------------------------------------------------------
    case 'b':
      return (
        <svg viewBox="0 0 100 100" className={className}
             xmlns="http://www.w3.org/2000/svg">
          {defs}
          <Base wide={29} />

          {/* INDIAN BISHOP = COURT PRIEST / SCHOLAR
              Deliberately tall and narrow so it cannot be confused with the pawn. */}
          <path
            d="M39 84
               Q37 72 40 62
               Q43 55 45 51
               L55 51
               Q57 55 60 62
               Q63 72 61 84 Z"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.8"
          />

          {/* Long ceremonial stole */}
          <path
            d="M43 53 Q39 66 40 82 L46 84
               Q46 68 50 58
               Q54 68 54 84 L60 82
               Q61 66 57 53 Z"
            fill={redCloth}
            stroke={outline} strokeWidth="1"
          />
          <path d="M44 55 Q42 69 43 81"
                fill="none" stroke={goldLight} strokeWidth="1.1" />
          <path d="M56 55 Q58 69 57 81"
                fill="none" stroke={goldLight} strokeWidth="1.1" />

          {/* Head: clearly larger than pawn */}
          <ellipse cx="50" cy="39" rx="8.5" ry="10"
                   fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Tall priest's pagdi / ceremonial headwrap */}
          <path
            d="M40 35
               Q39 25 44 21
               Q47 18 50 21
               Q53 18 56 21
               Q61 25 60 35
               Q55 32 50 34
               Q45 32 40 35 Z"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.6"
          />
          <path d="M42 28 Q50 33 58 28"
                fill="none" stroke={gold} strokeWidth="1.9" />
          <path d="M44 24 Q50 29 56 24"
                fill="none" stroke={goldLight} strokeWidth="1.4" />

          {/* Prominent vertical tilak — bishop identifier */}
          <path
            d="M48.4 35 L50 41 L51.6 35"
            fill="none" stroke={ruby} strokeWidth="1.7"
            strokeLinecap="round"
          />
          <Jewel x={50} y={25} r={2.8} green />

          {/* Large scholar necklace */}
          <path
            d="M39 54 Q50 62 61 54"
            fill="none" stroke={`url(#${id}_gold)`} strokeWidth="2.5"
          />
          <Jewel x={43} y={56} r={1.7} green />
          <Jewel x={50} y={59} r={2.3} />
          <Jewel x={57} y={56} r={1.7} green />

          {/* Sacred manuscript held in both hands — unique bishop cue */}
          <path
            d="M42 63 Q50 60 58 63
               L57 75 Q50 78 43 75 Z"
            fill={`url(#${id}_gold)`}
            stroke={outline} strokeWidth="1.4"
          />
          <path d="M45 65 L55 65 M45 68 L55 68 M46 71 L54 71"
                stroke={outline} strokeWidth=".75" />
          <path d="M50 62 L50 76"
                stroke={outline} strokeWidth=".8" />

          {/* Beaded lower robe */}
          <Jewel x={40} y={82} r={1.4} />
          <Jewel x={50} y={83} r={1.7} green />
          <Jewel x={60} y={82} r={1.4} />
        </svg>
      );

    // -------------------------------------------------------------------------
    // KNIGHT — ceremonial Indian Ashva, with pagdi-like head ornament,
    // jeweled bridle, ear, mane and red royal cloth.
    // -------------------------------------------------------------------------
    case 'n':
      return (
        <svg viewBox="0 0 100 100" className={className}
             xmlns="http://www.w3.org/2000/svg">
          {defs}
          <Base wide={31} />

          {/* neck + horse head */}
          <path
            d="M66 84
               Q68 73 66 62
               Q64 50 58 43
               Q53 37 48 35
               L42 39 L34 48
               L24 53 L17 61
               Q15 64 18 66
               L28 64 L37 59
               L44 62
               Q48 69 51 84 Z"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.9"
            strokeLinejoin="round"
          />

          {/* ears */}
          <path d="M48 39 L46 28 L53 36 Z"
                fill={`url(#${id}_cloth)`}
                stroke={outline} strokeWidth="1.4" />
          <path d="M53 38 L57 28 L61 41 Z"
                fill={`url(#${id}_cloth)`}
                stroke={outline} strokeWidth="1.4" />

          {/* flowing mane */}
          <path
            d="M57 38 L65 42 L60 47 L68 51 L62 56
               L69 60 L63 65 L70 69 L65 74"
            fill="none" stroke={`url(#${id}_gold)`}
            strokeWidth="2.5" strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ceremonial forehead jewel */}
          <path d="M45 38 Q51 33 57 39"
                fill="none" stroke={gold} strokeWidth="2.2" />
          <Jewel x={51} y={37} r={2.5} green />

          {/* bridle */}
          <path d="M18 57 Q29 51 39 55 Q48 58 52 66"
                fill="none" stroke={`url(#${id}_gold)`}
                strokeWidth="2.5" />
          <Jewel x={29} y={53} r={2} />
          <Jewel x={40} y={55} r={1.8} green />
          <Jewel x={51} y={64} r={1.8} />

          {/* eye + nostril */}
          <circle cx="38" cy="48" r="1.35" fill={outline} />
          <circle cx="18.5" cy="62" r="1.1" fill={outline} />

          {/* royal saddle cloth */}
          <path
            d="M57 57 Q68 59 71 67 L68 80 Q62 77 55 75 Z"
            fill={redCloth} stroke={outline} strokeWidth="1.4"
          />
          <path d="M59 60 Q65 62 69 66"
                fill="none" stroke={goldLight} strokeWidth="1.4" />
          <path d="M57 74 Q63 77 68 78"
                fill="none" stroke={gold} strokeWidth="1.5" />
          <Jewel x={64} y={68} r={2} green />
        </svg>
      );

    // -------------------------------------------------------------------------
    // ROOK — Indian palace / fort tower, not a European crenellated rook.
    // -------------------------------------------------------------------------
    case 'r':
      return (
        <svg viewBox="0 0 100 100" className={className}
             xmlns="http://www.w3.org/2000/svg">
          {defs}
          <Base wide={31} />

          {/* palace body */}
          <path
            d="M30 84 L31 50 L69 50 L70 84 Z"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.8"
          />

          {/* palace bands */}
          <path d="M29 52 L71 52 L71 46 L29 46 Z"
                fill={`url(#${id}_gold)`}
                stroke={outline} strokeWidth="1.5" />

          {/* Indian fort battlement */}
          <path
            d="M30 46 L30 37 L36 37 L36 41 L43 41
               L43 35 L50 35 L50 41 L57 41 L57 35
               L64 35 L64 41 L70 41 L70 37 L70 46 Z"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* dome + kalash */}
          <path d="M39 35 Q50 22 61 35 Z"
                fill={`url(#${id}_gold)`}
                stroke={outline} strokeWidth="1.5" />
          <path d="M50 22 L50 18"
                stroke={outline} strokeWidth="1.2" />
          <path d="M47.5 18 Q50 15 52.5 18 L50 20 Z"
                fill={`url(#${id}_gold)`}
                stroke={outline} strokeWidth="1" />

          {/* arched doorway */}
          <path
            d="M41 84 L41 68 Q41 59 50 55 Q59 59 59 68 L59 84 Z"
            fill={white ? '#fff7df' : '#080605'}
            stroke={outline} strokeWidth="1.6"
          />
          <path d="M44 67 Q50 61 56 67"
                fill="none" stroke={gold} strokeWidth="1.4" />

          {/* lotus emblem */}
          <path
            d="M43 53 Q46 48 50 53 Q54 48 57 53
               Q54 58 50 59 Q46 58 43 53 Z"
            fill={redCloth} stroke={outline} strokeWidth=".9"
          />
          <Jewel x={50} y={54} r={1.7} green />

          <Jewel x={36} y={72} r={1.3} />
          <Jewel x={64} y={72} r={1.3} green />
        </svg>
      );

    // -------------------------------------------------------------------------
    // PAWN — Indian royal guard / sipahi with pagdi, shield and spear.
    // -------------------------------------------------------------------------
    case 'p':
      return (
        <svg viewBox="0 0 100 100" className={className}
             xmlns="http://www.w3.org/2000/svg">
          {defs}
          <Base wide={28} />

          {/* INDIAN PAWN = SIPAHI / ROYAL GUARD
              Shorter body + large shield + spear = immediately distinct from bishop. */}
          <path
            d="M39 84
               Q39 74 42 65
               Q45 59 50 58
               Q55 59 58 65
               Q61 74 61 84 Z"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.8"
          />

          {/* Short red sash */}
          <path
            d="M55 61 Q51 69 47 84 L53 84
               Q56 72 59 66 Z"
            fill={redCloth}
            stroke={outline} strokeWidth=".9"
          />
          <path d="M57 63 Q53 73 51 82"
                fill="none" stroke={goldLight} strokeWidth="1" />

          {/* Smaller, rounder guard head */}
          <ellipse cx="50" cy="45" rx="7.2" ry="8"
                   fill={skin} stroke={outline} strokeWidth="1.4" />

          {/* Compact soldier pagdi */}
          <path
            d="M42 43
               Q41 36 45 33
               Q50 30 55 33
               Q59 36 58 43
               Q50 46 42 43 Z"
            fill={`url(#${id}_cloth)`}
            stroke={outline} strokeWidth="1.5"
          />
          <path d="M43 39 Q50 44 57 39"
                fill="none" stroke={gold} strokeWidth="1.7" />
          <Jewel x={50} y={36} r={2.1} />

          {/* Small guard necklace */}
          <path d="M42 56 Q50 60 58 56"
                fill="none" stroke={gold} strokeWidth="1.8" />
          <Jewel x={50} y={59} r={1.7} green />

          {/* LEFT HAND + LARGE ROUND SHIELD */}
          <path d="M42 65 Q36 69 37 75 Q39 78 42 75 L46 69"
                fill={`url(#${id}_cloth)`}
                stroke={outline} strokeWidth="1.5" />

          <circle cx="68" cy="70" r="10"
                  fill={`url(#${id}_gold)`}
                  stroke={outline} strokeWidth="1.6" />
          <circle cx="68" cy="70" r="6.5"
                  fill={white ? '#f5dfae' : '#17100c'}
                  stroke={outline} strokeWidth="1.1" />
          <path d="M64 66 L72 74 M72 66 L64 74"
                stroke={gold} strokeWidth="1" />
          <Jewel x={68} y={70} r={2.2} green />

          {/* RIGHT HAND / SPEAR */}
          <path d="M27 86 L27 48"
                stroke={`url(#${id}_gold)`} strokeWidth="1.7" />

          {/* unmistakable spearhead */}
          <path
            d="M27 45 L23.5 52 L27 57 L30.5 52 Z"
            fill={`url(#${id}_gold)`}
            stroke={outline} strokeWidth="1.2"
          />
          <path d="M27 57 L27 63"
                stroke={redCloth} strokeWidth="2.1" />

          {/* Small guard belt */}
          <path d="M40 80 Q50 83 60 80"
                fill="none" stroke={gold} strokeWidth="1.8" />
          <Jewel x={50} y={82} r={1.5} />

          {/* boots — reinforces soldier identity */}
          <path d="M43 83 Q40 87 44 88 L48 88"
                fill={outline} />
          <path d="M57 83 Q60 87 56 88 L52 88"
                fill={outline} />
        </svg>
      );

    default:
      return null;
  }
});

IndianChessPiece.displayName = 'IndianChessPiece';
