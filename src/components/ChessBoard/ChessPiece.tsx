import React from 'react';
import { PieceSymbol, Color } from 'chess.js';
import { IndianChessPiece } from './IndianChessPiece';
import { StauntonChessPiece } from './StauntonChessPiece';
import { WikimediaChessPiece } from './WikimediaChessPiece';

export type ChessPieceTheme = 'indian' | 'classic' | 'wikimedia';

interface ChessPieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
  theme?: ChessPieceTheme;
}

export const ChessPiece: React.FC<ChessPieceProps> = React.memo(({
  type,
  color,
  className = 'w-full h-full',
  theme = 'indian'
}) => {
  if (theme === 'indian') {
    return <IndianChessPiece type={type} color={color} className={className} />;
  }

  if (theme === 'wikimedia') {
    return <WikimediaChessPiece type={type} color={color} className={className} />;
  }

  // Classic / Staunton theme exactly matching Adobe Stock #249534780
  return <StauntonChessPiece type={type} color={color} className={className} />;
});