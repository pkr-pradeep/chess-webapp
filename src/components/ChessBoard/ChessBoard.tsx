import React, { useState, useEffect } from 'react';
import { Chess, Square, Move, PieceSymbol } from 'chess.js';
import { ChessPiece, ChessPieceTheme } from './ChessPiece';
import { ChaturangaModal } from './ChaturangaModal';
import { chessAudio } from '../../utils/chessAudio';
import { MoveClassification, PieceColor } from '../../types/chess';
import { AlertCircle, CheckCircle2, Crown, HelpCircle, Palette, Sparkles, Star, Zap } from 'lucide-react';

interface ChessBoardProps {
  chess: Chess;
  onMove: (move: { from: Square; to: Square; promotion?: PieceSymbol }) => boolean;
  playerColor?: PieceColor;
  isInteractive?: boolean;
  lastMove?: { from: Square; to: Square; classification?: MoveClassification } | null;
  highlightSquares?: Square[];
  bestMoveArrow?: { from: Square; to: Square } | null;
  evaluation?: number; // centipawns
  onPieceSelect?: (square: Square) => void;
  selectedSquare?: Square | null;
  pieceTheme?: ChessPieceTheme;
  onPieceThemeChange?: (theme: ChessPieceTheme) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  onMove,
  playerColor = 'w',
  isInteractive = true,
  lastMove,
  highlightSquares = [],
  bestMoveArrow,
  evaluation = 0,
  onPieceSelect,
  selectedSquare: externalSelectedSquare,
  pieceTheme: externalPieceTheme,
  onPieceThemeChange,
}) => {
  const [internalSelected, setInternalSelected] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);
  const [isLoreModalOpen, setIsLoreModalOpen] = useState(false);
  const [internalTheme, setInternalTheme] = useState<ChessPieceTheme>(() => {
    return (localStorage.getItem('chess_piece_theme') as ChessPieceTheme) || 'classic';
  });

  const handleThemeChange = (newTheme: ChessPieceTheme) => {
    setInternalTheme(newTheme);
    localStorage.setItem('chess_piece_theme', newTheme);
    onPieceThemeChange?.(newTheme);
  };

  const selectedSquare = externalSelectedSquare !== undefined ? externalSelectedSquare : internalSelected;

  const board = chess.board();
  const isFlipped = playerColor === 'b';

  // Files and ranks
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  // Keep legal moves in sync when chess position changes
  useEffect(() => {
    if (selectedSquare) {
      try {
        const moves = chess.moves({ square: selectedSquare, verbose: true });
        setLegalMoves(moves);
      } catch {
        setLegalMoves([]);
      }
    } else {
      setLegalMoves([]);
    }
  }, [chess, selectedSquare]);

  const handleSquareClick = (square: Square) => {
    if (!isInteractive) return;

    try {
      if (selectedSquare) {
        // If clicking another piece of the current player, switch selection immediately
        const clickedPiece = chess.get(square);
        if (clickedPiece && clickedPiece.color === chess.turn()) {
          setInternalSelected(square);
          try {
            const moves = chess.moves({ square, verbose: true });
            setLegalMoves(moves);
          } catch {
            setLegalMoves([]);
          }
          onPieceSelect?.(square);
          return;
        }

        // Check if clicking a legal move target
        const legalTarget = legalMoves.find((m) => m.to === square);
        if (legalTarget) {
          // Needs promotion?
          const isPromotion = legalTarget.piece === 'p' && (square[1] === '8' || square[1] === '1');
          const success = onMove({
            from: selectedSquare,
            to: square,
            promotion: isPromotion ? 'q' : undefined,
          });

          if (success) {
            setInternalSelected(null);
            setLegalMoves([]);
            return;
          }
        }
      }

      // Otherwise select clicked piece if it belongs to current player's turn
      const piece = chess.get(square);
      if (piece && piece.color === chess.turn()) {
        setInternalSelected(square);
        try {
          const moves = chess.moves({ square, verbose: true });
          setLegalMoves(moves);
        } catch {
          setLegalMoves([]);
        }
        onPieceSelect?.(square);
      } else {
        setInternalSelected(null);
        setLegalMoves([]);
      }
    } catch {
      setInternalSelected(null);
      setLegalMoves([]);
    }
  };

  const handleDragStart = (e: React.DragEvent, square: Square) => {
    if (!isInteractive) return;
    const piece = chess.get(square);
    if (!piece || piece.color !== chess.turn()) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(square);
    setInternalSelected(square);
    const moves = chess.moves({ square, verbose: true });
    setLegalMoves(moves);
    onPieceSelect?.(square);
    e.dataTransfer.setData('text/plain', square);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (!draggedSquare || !isInteractive) return;

    if (draggedSquare !== targetSquare) {
      const isLegal = legalMoves.some((m) => m.to === targetSquare);
      if (isLegal) {
        const piece = chess.get(draggedSquare);
        const isPromotion = piece?.type === 'p' && (targetSquare[1] === '8' || targetSquare[1] === '1');
        onMove({
          from: draggedSquare,
          to: targetSquare,
          promotion: isPromotion ? 'q' : undefined,
        });
      }
    }

    setDraggedSquare(null);
    setInternalSelected(null);
    setLegalMoves([]);
  };

  // Convert evaluation into percentage for visual bar (-1000cp to +1000cp mapped to 0% to 100%)
  const clampedEval = Math.max(-1000, Math.min(1000, evaluation));
  const whitePercent = 50 + (clampedEval / 1000) * 45;
  const evalDisplay = evaluation >= 0 ? `+${(evaluation / 100).toFixed(1)}` : (evaluation / 100).toFixed(1);

  // Is King in check?
  const isCheck = chess.inCheck();
  let kingInCheckSquare: Square | null = null;
  if (isCheck) {
    const turn = chess.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          kingInCheckSquare = `${files[c]}${8 - r}` as Square;
        }
      }
    }
  }

  // Helper for badge icon
  const getClassificationBadge = (cls?: MoveClassification) => {
    switch (cls) {
      case 'brilliant':
        return <span className="bg-cyan-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">💎 Brilliant</span>;
      case 'best':
        return <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">⭐ Best</span>;
      case 'inaccuracy':
        return <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">?! Inaccuracy</span>;
      case 'mistake':
        return <span className="bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">? Mistake</span>;
      case 'blunder':
        return <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">?? Blunder</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-[580px]">
      {/* Theme and Heritage Bar */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium text-[11px] hidden sm:inline">Theme:</span>
          <div className="inline-flex p-0.5 bg-slate-800/90 rounded-lg border border-slate-700/80">
            <button
              id="btn-theme-indian"
              type="button"
              onClick={() => handleThemeChange('indian')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                internalTheme === 'indian'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Ancient Indian Theme (Cultural motifs)"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Ancient Indian</span>
            </button>
            <button
              id="btn-theme-staunton"
              type="button"
              onClick={() => handleThemeChange('classic')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                internalTheme === 'classic'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Classic Staunton Pieces (matching photo artwork)"
            >
              <span>Staunton</span>
            </button>
            <button
              id="btn-theme-wikimedia"
              type="button"
              onClick={() => handleThemeChange('wikimedia')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                internalTheme === 'wikimedia'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Standard Wikipedia SVG Pieces"
            >
              <span>Wikimedia</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsLoreModalOpen(true)}
          className="px-2.5 py-1 text-[11px] font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Chaturanga Lore</span>
        </button>
      </div>

      <div id="chess-board-container" className="flex items-stretch gap-3 select-none">
        {/* Visual Evaluation Bar */}
        <div
          id="evaluation-bar"
          className="w-4 sm:w-5 bg-slate-800 rounded-lg overflow-hidden flex flex-col justify-between items-center shadow-inner relative border border-slate-700/60"
          title={`Engine Evaluation: ${evalDisplay}`}
        >
          <div
            className="w-full bg-slate-900 transition-all duration-300"
            style={{ height: `${100 - (isFlipped ? 100 - whitePercent : whitePercent)}%` }}
          />
          <div
            className="w-full bg-slate-100 transition-all duration-300"
            style={{ height: `${isFlipped ? 100 - whitePercent : whitePercent}%` }}
          />
          <span className="absolute inset-x-0 bottom-1 text-[9px] font-semibold text-center text-slate-700 mix-blend-difference pointer-events-none">
            {evalDisplay}
          </span>
        </div>

        {/* Main Board Grid */}
        <div
          id="chess-grid"
          className="relative aspect-square w-full max-w-[540px] rounded-xl overflow-hidden shadow-2xl border-4 border-amber-950/20 bg-amber-900/10"
        >
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {displayRanks.map((rankStr, rankIndex) =>
              displayFiles.map((fileStr, fileIndex) => {
                const square = `${fileStr}${rankStr}` as Square;
                const isLight = (fileIndex + rankIndex) % 2 === 0;

                // Actual board piece coords
                const colIndex = fileStr.charCodeAt(0) - 97;
                const rowIndex = 8 - parseInt(rankStr, 10);
                const piece = board[rowIndex][colIndex];

                const isSelected = selectedSquare === square;
                const isLastMoveFrom = lastMove?.from === square;
                const isLastMoveTo = lastMove?.to === square;
                const isLegalTarget = legalMoves.some((m) => m.to === square);
                const isCaptureTarget = isLegalTarget && Boolean(piece);
                const isKingCheck = kingInCheckSquare === square;
                const isHighlighted = highlightSquares.includes(square);

                // Square background colors (Warm Wooden / Tournament Olive Theme)
                let squareBg = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';

                if (isSelected) {
                  squareBg = isLight ? 'bg-[#baca44]' : 'bg-[#a3b137]';
                } else if (isLastMoveTo || isLastMoveFrom) {
                  squareBg = isLight ? 'bg-[#ced26b]' : 'bg-[#aaa23b]';
                } else if (isHighlighted) {
                  squareBg = isLight ? 'bg-amber-200' : 'bg-amber-500/60';
                }

                return (
                  <div
                    key={square}
                    id={`square-${square}`}
                    onClick={() => handleSquareClick(square)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, square)}
                    className={`relative flex items-center justify-center cursor-pointer select-none ${squareBg} ${
                      isKingCheck ? 'ring-4 ring-rose-500 ring-inset animate-pulse' : ''
                    }`}
                  >
                    {/* Rank coordinate label on leftmost col */}
                    {fileIndex === 0 && (
                      <span className={`absolute top-0.5 left-1 text-[10px] font-bold ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'} pointer-events-none`}>
                        {rankStr}
                      </span>
                    )}

                    {/* File coordinate label on bottom row */}
                    {rankIndex === 7 && (
                      <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'} pointer-events-none`}>
                        {fileStr}
                      </span>
                    )}

                    {/* Real-time blunder / best move classification badge on last move to-square */}
                    {isLastMoveTo && lastMove?.classification && (
                      <div className="absolute top-1 right-1 z-20 pointer-events-none">
                        {getClassificationBadge(lastMove.classification)}
                      </div>
                    )}

                    {/* Legal move indicator */}
                    {isLegalTarget && !isCaptureTarget && (
                      <div className="absolute w-3.5 h-3.5 bg-black/25 rounded-full pointer-events-none" />
                    )}

                    {/* Legal capture target indicator */}
                    {isCaptureTarget && (
                      <div className="absolute inset-1 rounded-full border-4 border-black/30 pointer-events-none" />
                    )}

                    {/* Render Piece */}
                    {piece && (
                      <div
                        draggable={isInteractive && piece.color === chess.turn()}
                        onDragStart={(e) => handleDragStart(e, square)}
                        className="w-full h-full p-1 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                      >
                        <ChessPiece type={piece.type} color={piece.color} theme={internalTheme} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Ancient Indian Chaturanga Piece Lore Modal */}
      <ChaturangaModal
        isOpen={isLoreModalOpen}
        onClose={() => setIsLoreModalOpen(false)}
      />
    </div>
  );
};