import React from 'react';
import { PieceSymbol, Color } from 'chess.js';

interface WikimediaChessPieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
  size?: number; // optional size override
}

export const WikimediaChessPiece: React.FC<WikimediaChessPieceProps> = ({
  type,
  color,
  className = 'w-full h-full',
  size = 45
}) => {
  const isWhite = color === 'w';
  const pieceMap: Record<PieceSymbol, string> = {
    p: 'p', // pawn
    n: 'n', // knight
    b: 'b', // bishop
    r: 'r', // rook
    q: 'q', // queen
    k: 'k'  // king
  };

  const colorPrefix = isWhite ? 'w' : 'b';
  const pieceLetter = pieceMap[type];
  const filename = `${colorPrefix}_${pieceLetter}.svg`;

  return (
    <div className={className}>
      <img
        src={`/chess-pieces/${filename}`}
        alt={`${isWhite ? 'white' : 'black'} ${type}`}
        width={size}
        height={size}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};