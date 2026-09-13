import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square, Move, PieceSymbol } from 'chess.js';
import { ChessBoard } from '../ChessBoard/ChessBoard';
import { CoachPanel } from '../CoachPanel/CoachPanel';
import { MoveHistoryPanel } from './MoveHistoryPanel';
import { PgnModal } from './PgnModal';
import { ErrorBoundary } from '../ErrorBoundary';
import { chessEngine } from '../../services/chessEngine';
import { stockfishService, StockfishInfo } from '../../services/stockfishService';
import { chessAudio } from '../../utils/chessAudio';
import { 
  BotDifficulty, 
  GameRecord, 
  MoveAnalysis, 
  PieceColor 
} from '../../types/chess';
import { 
  RotateCcw, 
  Flag, 
  Handshake, 
  Swords, 
  Settings2, 
  Brain, 
  Eye, 
  Sparkles,
  Award,
  ChevronRight,
  ShieldAlert,
  Cpu,
  Activity,
  Undo2,
  FileText,
  SlidersHorizontal,
  ChevronLeft,
  History,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react';

const BOT_DIFFICULTIES: BotDifficulty[] = [
  { id: 'novice', name: 'Novice Bot', rating: 800, depth: 1, randomness: 45, description: 'Casual beginner, makes periodic tactical blunders', avatar: '♟️' },
  { id: 'casual', name: 'Casual Bot', rating: 1200, depth: 3, randomness: 18, description: 'Solid fundamentals, misses deep tactical sequences', avatar: '♞' },
  { id: 'club', name: 'Stockfish Club', rating: 1750, depth: 8, randomness: 0, description: 'Stockfish Level 8, sharp tactical calculation & defense', avatar: '⚡' },
  { id: 'master', name: 'Stockfish Grandmaster', rating: 2600, depth: 14, randomness: 0, description: 'Stockfish Level 20, world-class positional mastery', avatar: '👑' },
];

export type EngineMode = 'stockfish' | 'minimax';

interface PlayMatchProps {
  onGameCompleted: (game: GameRecord) => void;
  onSaveBlunderAsPuzzle: (move: MoveAnalysis) => void;
  onNavigateToReview: (game: GameRecord) => void;
  userRating: number;
}

export const PlayMatch: React.FC<PlayMatchProps> = ({
  onGameCompleted,
  onSaveBlunderAsPuzzle,
  onNavigateToReview,
  userRating,
}) => {
  const [chess, setChess] = useState<Chess>(() => new Chess());
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [selectedBot, setSelectedBot] = useState<BotDifficulty>(BOT_DIFFICULTIES[1]); // Casual default
  const [engineMode, setEngineMode] = useState<EngineMode>('stockfish');
  const [stockfishInfo, setStockfishInfo] = useState<StockfishInfo | null>(null);
  const [movesHistory, setMovesHistory] = useState<MoveAnalysis[]>([]);
  const movesHistoryRef = useRef<MoveAnalysis[]>([]);
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square; classification?: any } | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [currentEval, setCurrentEval] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [terminationText, setTerminationText] = useState<string>('');
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [savedPuzzleIds, setSavedPuzzleIds] = useState<Set<string>>(new Set());
  
  // User preferences & features
  const [showLiveAnalysis, setShowLiveAnalysis] = useState<boolean>(false); // Default: false (user request)
  const [activeMoveIndex, setActiveMoveIndex] = useState<number>(-1); // -1 = start or previewing moves
  const [isPgnModalOpen, setIsPgnModalOpen] = useState<boolean>(false);
  const [rightPanelTab, setRightPanelTab] = useState<'history' | 'coach'>('history');

  const botTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep movesHistoryRef in sync with movesHistory
  useEffect(() => {
    movesHistoryRef.current = movesHistory;
  }, [movesHistory]);

  // Safe move stepping with sound feedback
  const handleStepMoveIndex = (idx: number) => {
    const clamped = Math.max(-1, Math.min(movesHistory.length - 1, idx));
    setSelectedSquare(null);
    setActiveMoveIndex(clamped);
    if (clamped >= 0) {
      chessAudio.playMove();
    }
  };

  // Autoplay match replay loop
  useEffect(() => {
    if (!isReplaying) return;
    if (activeMoveIndex >= movesHistory.length - 1) {
      setIsReplaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setActiveMoveIndex((prev) => {
        const next = prev + 1;
        chessAudio.playMove();
        if (next >= movesHistory.length - 1) {
          setIsReplaying(false);
        }
        return next;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isReplaying, activeMoveIndex, movesHistory.length]);

  // Subscribe to Stockfish real-time engine telemetry
  useEffect(() => {
    const unsubscribe = stockfishService.subscribe((info) => {
      setStockfishInfo(info);
      if (info.scoreCp !== undefined) {
        // Perspective of current player
        setCurrentEval(info.scoreCp);
      }
    });

    // Warm up Stockfish worker in background
    stockfishService.initWorker();

    return () => {
      unsubscribe();
      stockfishService.stop();
    };
  }, []);

  // Initialize new match
  const startNewGame = (color: PieceColor = playerColor, bot: BotDifficulty = selectedBot) => {
    if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    stockfishService.stop();
    const newChess = new Chess();
    setChess(newChess);
    setPlayerColor(color);
    setSelectedBot(bot);
    movesHistoryRef.current = [];
    setMovesHistory([]);
    setActiveMoveIndex(-1);
    setIsReplaying(false);
    setLastMove(null);
    setSelectedSquare(null);
    setCurrentEval(0);
    setGameResult(null);
    setTerminationText('');
    setIsBotThinking(false);

    // If player is Black, bot plays first move as White
    if (color === 'b') {
      botTimeoutRef.current = setTimeout(() => {
        triggerBotMove(newChess, bot, engineMode);
      }, 300);
    }
  };

  const triggerBotMove = async (
    currentChessInstance: Chess,
    bot: BotDifficulty,
    mode: EngineMode = engineMode
  ) => {
    setIsBotThinking(true);

    try {
      if (currentChessInstance.isGameOver()) {
        setIsBotThinking(false);
        return;
      }

      let moveSan = '';
      let from: Square;
      let to: Square;
      let promotion: PieceSymbol | undefined;

      if (mode === 'stockfish') {
        // Map bot rating to Stockfish skill level (0 - 20) with fast, responsive movetime budget
        let skillLevel = 5;
        let searchDepth = 4;
        let movetimeMs = 100;

        if (bot.id === 'novice') {
          skillLevel = 1;
          searchDepth = 2;
          movetimeMs = 70;
        } else if (bot.id === 'casual') {
          skillLevel = 5;
          searchDepth = 4;
          movetimeMs = 100;
        } else if (bot.id === 'club') {
          skillLevel = 10;
          searchDepth = 6;
          movetimeMs = 120;
        } else if (bot.id === 'master') {
          skillLevel = 20;
          searchDepth = 8;
          movetimeMs = 160;
        }

        const bestMoveResult = await stockfishService.getBestMove(
          currentChessInstance.fen(),
          skillLevel,
          searchDepth,
          movetimeMs
        );

        from = bestMoveResult.from;
        to = bestMoveResult.to;
        promotion = (bestMoveResult.promotion as PieceSymbol) || undefined;

        const fenBefore = currentChessInstance.fen();
        const appliedMove = currentChessInstance.move({
          from,
          to,
          promotion: promotion || 'q',
        });

        if (appliedMove) {
          moveSan = appliedMove.san;
          const nextChess = new Chess(currentChessInstance.fen());
          setChess(nextChess);

          if (appliedMove.captured) {
            chessAudio.playCapture();
          } else if (nextChess.inCheck()) {
            chessAudio.playCheck();
          } else {
            chessAudio.playMove();
          }

          let analysis: MoveAnalysis;
          if (showLiveAnalysis) {
            analysis = chessEngine.analyzeMove(
              fenBefore,
              moveSan,
              from,
              to,
              nextChess.turn() === 'w' ? 'b' : 'w'
            );
          } else {
            // Instant, lightweight record (<0.005ms) for buttery smooth free-flow gameplay
            const evalBefore = currentEval;
            const evalAfter = bestMoveResult.evalCp ?? chessEngine.evaluatePosition(nextChess);
            analysis = {
              san: moveSan,
              from,
              to,
              color: nextChess.turn() === 'w' ? 'b' : 'w',
              fenBefore,
              fenAfter: nextChess.fen(),
              evalBefore,
              evalAfter,
              evalDelta: 0,
              classification: 'good',
              explanation: '',
            };
          }

          setLastMove({
            from,
            to,
            classification: showLiveAnalysis ? analysis.classification : undefined,
          });

          setCurrentEval(bestMoveResult.evalCp || analysis.evalAfter);
          const updatedMoves = [...movesHistoryRef.current, analysis];
          movesHistoryRef.current = updatedMoves;
          setMovesHistory(updatedMoves);
          setActiveMoveIndex(updatedMoves.length - 1);
          checkGameOver(nextChess, updatedMoves);
        }
      } else {
        // Minimax heuristic engine (snappy & non-blocking)
        const botMove = chessEngine.getBotMove(currentChessInstance, bot);
        if (botMove) {
          const fenBefore = currentChessInstance.fen();
          from = botMove.from;
          to = botMove.to;
          moveSan = botMove.san;

          currentChessInstance.move(botMove);
          const nextChess = new Chess(currentChessInstance.fen());
          setChess(nextChess);

          if (botMove.captured) {
            chessAudio.playCapture();
          } else if (nextChess.inCheck()) {
            chessAudio.playCheck();
          } else {
            chessAudio.playMove();
          }

          let analysis: MoveAnalysis;
          if (showLiveAnalysis) {
            analysis = chessEngine.analyzeMove(
              fenBefore,
              moveSan,
              from,
              to,
              nextChess.turn() === 'w' ? 'b' : 'w'
            );
          } else {
            const evalBefore = currentEval;
            const evalAfter = chessEngine.evaluatePosition(nextChess);
            analysis = {
              san: moveSan,
              from,
              to,
              color: nextChess.turn() === 'w' ? 'b' : 'w',
              fenBefore,
              fenAfter: nextChess.fen(),
              evalBefore,
              evalAfter,
              evalDelta: 0,
              classification: 'good',
              explanation: '',
            };
          }

          setLastMove({
            from,
            to,
            classification: showLiveAnalysis ? analysis.classification : undefined,
          });

          setCurrentEval(analysis.evalAfter);
          const updatedMoves = [...movesHistoryRef.current, analysis];
          movesHistoryRef.current = updatedMoves;
          setMovesHistory(updatedMoves);
          setActiveMoveIndex(updatedMoves.length - 1);
          checkGameOver(nextChess, updatedMoves);
        }
      }
    } catch (err) {
      console.error('[Bot Move Error]:', err);
      // Fallback
      const legalMoves = currentChessInstance.moves({ verbose: true });
      if (legalMoves.length > 0) {
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        currentChessInstance.move(randomMove);
        const nextChess = new Chess(currentChessInstance.fen());
        setChess(nextChess);
        chessAudio.playMove();
      }
    } finally {
      setIsBotThinking(false);
    }
  };

  // Check checkmate / draw
  const checkGameOver = (currentChessInstance: Chess, allMoves: MoveAnalysis[]) => {
    if (currentChessInstance.isCheckmate()) {
      const winner = currentChessInstance.turn() === 'w' ? 'Black' : 'White';
      const result = winner === 'White' ? '1-0' : '0-1';
      const text = `Checkmate! ${winner} wins.`;
      setGameResult(result);
      setTerminationText(text);
      finishGame(result, text, allMoves, currentChessInstance);
    } else if (currentChessInstance.isDraw()) {
      let reason = 'Draw by agreement or 50-move rule';
      if (currentChessInstance.isStalemate()) reason = 'Stalemate';
      if (currentChessInstance.isThreefoldRepetition()) reason = 'Threefold repetition';
      if (currentChessInstance.isInsufficientMaterial()) reason = 'Insufficient material';
      setGameResult('1/2-1/2');
      setTerminationText(reason);
      finishGame('1/2-1/2', reason, allMoves, currentChessInstance);
    }
  };

  const finishGame = (
    result: '1-0' | '0-1' | '1/2-1/2', 
    reason: string, 
    moves: MoveAnalysis[],
    currentChessInstance?: Chess
  ) => {
    setIsReplaying(false);
    const movesToSave = moves.length > 0 ? moves : (movesHistoryRef.current.length > 0 ? movesHistoryRef.current : movesHistory);
    const endChess = currentChessInstance || chess;
    const whiteAcc = chessEngine.calculateAccuracy(movesToSave, 'w');
    const blackAcc = chessEngine.calculateAccuracy(movesToSave, 'b');

    let whiteB = 0, blackB = 0, whiteM = 0, blackM = 0, whiteI = 0, blackI = 0;
    movesToSave.forEach((m) => {
      if (m.color === 'w') {
        if (m.classification === 'blunder') whiteB++;
        if (m.classification === 'mistake') whiteM++;
        if (m.classification === 'inaccuracy') whiteI++;
      } else {
        if (m.classification === 'blunder') blackB++;
        if (m.classification === 'mistake') blackM++;
        if (m.classification === 'inaccuracy') blackI++;
      }
    });

    const isPlayerWhite = playerColor === 'w';
    const playerWon = (result === '1-0' && isPlayerWhite) || (result === '0-1' && !isPlayerWhite);
    const isDraw = result === '1/2-1/2';
    const ratingDelta = isDraw ? 0 : playerWon ? 15 : -10;

    const gameRecord: GameRecord = {
      id: `game-${Date.now()}`,
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      whitePlayer: isPlayerWhite ? `You (${userRating})` : `${selectedBot.name} (${selectedBot.rating})`,
      blackPlayer: !isPlayerWhite ? `You (${userRating})` : `${selectedBot.name} (${selectedBot.rating})`,
      playerColor,
      botLevel: selectedBot.name,
      result,
      terminationReason: reason,
      pgn: endChess.pgn(),
      moves: movesToSave,
      whiteAccuracy: whiteAcc,
      blackAccuracy: blackAcc,
      whiteBlunders: whiteB,
      blackBlunders: blackB,
      whiteMistakes: whiteM,
      blackMistakes: blackM,
      whiteInaccuracies: whiteI,
      blackInaccuracies: blackI,
      ratingBefore: userRating,
      ratingAfter: userRating + ratingDelta,
    };

    onGameCompleted(gameRecord);
  };

  // Handle Player move on board with instantaneous optimistic execution
  const handlePlayerMove = ({ from, to, promotion }: { from: Square; to: Square; promotion?: PieceSymbol }): boolean => {
    if (gameResult || isBotThinking) return false;
    if (chess.turn() !== playerColor) return false;

    const fenBefore = chess.fen();
    
    // 1. Instantly apply move to chess instance
    const moveResult = chess.move({ from, to, promotion: promotion || 'q' });
    if (!moveResult) return false;

    // 2. Immediately update state so the piece moves with ZERO perceptible delay
    const nextChessInstance = new Chess(chess.fen());
    setChess(nextChessInstance);
    setSelectedSquare(null);
    setLastMove({ from, to });

    // Immediate tactile sound feedback
    if (moveResult.captured) {
      chessAudio.playCapture();
    } else if (nextChessInstance.inCheck()) {
      chessAudio.playCheck();
    } else {
      chessAudio.playMove();
    }

    // 3. Perform move classification & schedule bot reaction non-blockingly
    setTimeout(() => {
      let analysis: MoveAnalysis;
      if (showLiveAnalysis) {
        analysis = chessEngine.analyzeMove(
          fenBefore,
          moveResult.san,
          from,
          to,
          playerColor
        );

        if (analysis.classification === 'blunder') {
          chessAudio.playBlunder();
        }
      } else {
        // Zero-overhead instantaneous move handling (<0.005ms) for free flow
        const evalBefore = currentEval;
        const evalAfter = chessEngine.evaluatePosition(nextChessInstance);
        analysis = {
          san: moveResult.san,
          from,
          to,
          color: playerColor,
          fenBefore,
          fenAfter: nextChessInstance.fen(),
          evalBefore,
          evalAfter,
          evalDelta: (playerColor === 'w' ? 1 : -1) * (evalAfter - evalBefore),
          classification: 'good',
          explanation: '',
        };
      }

      setLastMove({
        from,
        to,
        classification: showLiveAnalysis ? analysis.classification : undefined,
      });

      setCurrentEval(analysis.evalAfter);
      const updatedMoves = [...movesHistoryRef.current, analysis];
      movesHistoryRef.current = updatedMoves;
      setMovesHistory(updatedMoves);
      setActiveMoveIndex(updatedMoves.length - 1);

      // Check if player's move ended game
      if (nextChessInstance.isGameOver()) {
        checkGameOver(nextChessInstance, updatedMoves);
      } else {
        // Natural, ultra-snappy response delay (80ms) so gameplay is fast and fluid
        if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
        botTimeoutRef.current = setTimeout(() => {
          triggerBotMove(nextChessInstance, selectedBot, engineMode);
        }, 80);
      }
    }, 0);

    return true;
  };

  const handleResign = () => {
    if (gameResult) return;
    const result = playerColor === 'w' ? '0-1' : '1-0';
    const reason = 'Resignation';
    setGameResult(result);
    setTerminationText(reason);
    finishGame(result, reason, movesHistory);
  };

  const handleDraw = () => {
    if (gameResult) return;
    const result = '1/2-1/2';
    const reason = 'Draw by mutual agreement';
    setGameResult(result);
    setTerminationText(reason);
    finishGame(result, reason, movesHistory);
  };

  const handleSaveBlunder = (move: MoveAnalysis) => {
    onSaveBlunderAsPuzzle(move);
    setSavedPuzzleIds((prev) => new Set([...prev, move.san]));
  };

  // Rewind last move (Take Back)
  const handleRewindMove = () => {
    if (isBotThinking) {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
      stockfishService.stop();
      setIsBotThinking(false);
    }

    if (movesHistory.length === 0) return;

    // Against bot:
    // If it's player's turn and at least 2 moves were played, undo 2 moves (bot move + player move)
    // Otherwise undo 1 move
    const undoCount = (chess.turn() === playerColor && movesHistory.length >= 2) ? 2 : 1;
    const remainingMoves = movesHistory.slice(0, Math.max(0, movesHistory.length - undoCount));

    let newChess: Chess;
    if (remainingMoves.length === 0) {
      newChess = new Chess();
    } else {
      const last = remainingMoves[remainingMoves.length - 1];
      if (last?.fenAfter) {
        try {
          newChess = new Chess(last.fenAfter);
        } catch {
          newChess = new Chess();
          for (const m of remainingMoves) {
            try { newChess.move(m.san); } catch {}
          }
        }
      } else {
        newChess = new Chess();
        for (const m of remainingMoves) {
          try { newChess.move(m.san); } catch {}
        }
      }
    }

    setChess(newChess);
    movesHistoryRef.current = remainingMoves;
    setMovesHistory(remainingMoves);
    setActiveMoveIndex(remainingMoves.length - 1);
    setSelectedSquare(null);
    setGameResult(null);
    setTerminationText('');

    if (remainingMoves.length > 0) {
      const last = remainingMoves[remainingMoves.length - 1];
      setLastMove({
        from: last.from as Square,
        to: last.to as Square,
        classification: showLiveAnalysis ? last.classification : undefined,
      });
      setCurrentEval(last.evalAfter ?? 0);
    } else {
      setLastMove(null);
      setCurrentEval(0);
    }

    chessAudio.playMove();
  };

  // Rewind game to currently previewed history position
  const handleRewindToPreview = () => {
    if (activeMoveIndex < -1 || activeMoveIndex >= movesHistory.length - 1) return;
    if (isBotThinking) {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
      stockfishService.stop();
      setIsBotThinking(false);
    }

    const remainingMoves = activeMoveIndex === -1 ? [] : movesHistory.slice(0, activeMoveIndex + 1);
    let newChess: Chess;
    if (remainingMoves.length === 0) {
      newChess = new Chess();
    } else {
      const last = remainingMoves[remainingMoves.length - 1];
      if (last?.fenAfter) {
        try {
          newChess = new Chess(last.fenAfter);
        } catch {
          newChess = new Chess();
          for (const m of remainingMoves) {
            try { newChess.move(m.san); } catch {}
          }
        }
      } else {
        newChess = new Chess();
        for (const m of remainingMoves) {
          try { newChess.move(m.san); } catch {}
        }
      }
    }

    setChess(newChess);
    movesHistoryRef.current = remainingMoves;
    setMovesHistory(remainingMoves);
    setActiveMoveIndex(remainingMoves.length - 1);
    setSelectedSquare(null);
    setGameResult(null);
    setTerminationText('');

    if (remainingMoves.length > 0) {
      const last = remainingMoves[remainingMoves.length - 1];
      setLastMove({
        from: last.from as Square,
        to: last.to as Square,
        classification: showLiveAnalysis ? last.classification : undefined,
      });
      setCurrentEval(last.evalAfter ?? 0);
    } else {
      setLastMove(null);
      setCurrentEval(0);
    }

    chessAudio.playMove();
  };

  // Import PGN game and resume/play
  const handleImportPgn = (pgnString: string): boolean => {
    try {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
      stockfishService.stop();
      setIsBotThinking(false);

      const importedChess = new Chess();
      importedChess.loadPgn(pgnString);

      const historyMoves = importedChess.history({ verbose: true });
      const newHistory: MoveAnalysis[] = [];
      const stepChess = new Chess();

      for (const m of historyMoves) {
        const fenBefore = stepChess.fen();
        const evalBefore = chessEngine.evaluatePosition(stepChess);
        stepChess.move(m);
        const fenAfter = stepChess.fen();
        const evalAfter = chessEngine.evaluatePosition(stepChess);

        newHistory.push({
          san: m.san,
          from: m.from,
          to: m.to,
          color: m.color,
          fenBefore,
          fenAfter,
          evalBefore,
          evalAfter,
          evalDelta: (m.color === 'w' ? 1 : -1) * (evalAfter - evalBefore),
          classification: 'good',
          explanation: '',
        });
      }

      setChess(importedChess);
      movesHistoryRef.current = newHistory;
      setMovesHistory(newHistory);
      setActiveMoveIndex(newHistory.length - 1);
      setSelectedSquare(null);
      setGameResult(importedChess.isGameOver() ? (importedChess.turn() === 'w' ? '0-1' : '1-0') : null);

      if (historyMoves.length > 0) {
        const last = historyMoves[historyMoves.length - 1];
        setLastMove({ from: last.from as Square, to: last.to as Square });
        setCurrentEval(chessEngine.evaluatePosition(importedChess));
      } else {
        setLastMove(null);
        setCurrentEval(0);
      }

      chessAudio.playMove();
      return true;
    } catch {
      return false;
    }
  };

  // Preview past move position on board
  const isPreviewingPast = activeMoveIndex >= -1 && movesHistory.length > 0 && activeMoveIndex < movesHistory.length - 1;
  const displayedChess = React.useMemo(() => {
    try {
      if (movesHistory.length === 0) return chess;
      if (activeMoveIndex <= -1) return new Chess();
      if (activeMoveIndex >= movesHistory.length - 1 && !gameResult) return chess;

      const target = movesHistory[activeMoveIndex];
      if (target?.fenAfter) {
        try {
          return new Chess(target.fenAfter);
        } catch (e) {
          console.warn('Error loading FEN for preview:', e);
        }
      }

      const temp = new Chess();
      for (let i = 0; i <= activeMoveIndex && i < movesHistory.length; i++) {
        const m = movesHistory[i];
        if (m?.fenAfter) {
          try {
            temp.load(m.fenAfter);
            continue;
          } catch {}
        }
        if (m) {
          try {
            temp.move(m.san);
          } catch {
            try {
              if (m.from && m.to) {
                temp.move({ from: m.from, to: m.to, promotion: 'q' });
              }
            } catch {
              // ignore step error
            }
          }
        }
      }
      return temp;
    } catch (err) {
      console.error('Critical error in displayedChess:', err);
      return chess;
    }
  }, [chess, activeMoveIndex, movesHistory, gameResult]);

  const displayedLastMove = React.useMemo(() => {
    if (activeMoveIndex < 0) return null;
    if (activeMoveIndex < movesHistory.length && movesHistory[activeMoveIndex]) {
      const m = movesHistory[activeMoveIndex];
      return {
        from: m.from as Square,
        to: m.to as Square,
        classification: showLiveAnalysis ? m.classification : undefined,
      };
    }
    return !isPreviewingPast ? lastMove : null;
  }, [isPreviewingPast, lastMove, activeMoveIndex, movesHistory, showLiveAnalysis]);

  const displayedEval = React.useMemo(() => {
    if (activeMoveIndex >= 0 && activeMoveIndex < movesHistory.length && movesHistory[activeMoveIndex]) {
      return movesHistory[activeMoveIndex].evalAfter ?? 0;
    }
    return !isPreviewingPast ? currentEval : 0;
  }, [isPreviewingPast, currentEval, activeMoveIndex, movesHistory]);

  const latestPlayerMove = [...movesHistory].reverse().find((m) => m.color === playerColor) || null;

  return (
    <div id="play-match-root" className="space-y-6">
      {/* Bot Selector & Difficulty Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700">
            {selectedBot.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-100">{selectedBot.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                Rating {selectedBot.rating}
              </span>
              {engineMode === 'stockfish' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Stockfish 18
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{selectedBot.description}</p>
          </div>
        </div>

        {/* Engine Toggle & Difficulty buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Engine Selector */}
          <div className="inline-flex p-0.5 bg-slate-800 rounded-xl border border-slate-700">
            <button
              onClick={() => setEngineMode('stockfish')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                engineMode === 'stockfish'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Use open-source Stockfish UCI engine"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Stockfish</span>
            </button>
            <button
              onClick={() => setEngineMode('minimax')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                engineMode === 'minimax'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Use lightweight built-in heuristic minimax"
            >
              <span>Minimax</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Difficulty presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {BOT_DIFFICULTIES.map((bot) => (
              <button
                key={bot.id}
                onClick={() => startNewGame(playerColor, bot)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedBot.id === bot.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {bot.name} ({bot.rating})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stockfish Engine Telemetry Bar */}
      {engineMode === 'stockfish' && stockfishInfo && (
        <div className="px-4 py-2 bg-slate-900/90 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Stockfish Engine Active
            </span>
            <span className="text-slate-500">•</span>
            <span>
              Depth: <strong className="text-slate-200 font-mono">{stockfishInfo.depth || 10}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span>
              Evaluation:{' '}
              <strong className="text-amber-400 font-mono">
                {stockfishInfo.mateIn !== undefined
                  ? `M${stockfishInfo.mateIn}`
                  : stockfishInfo.scoreCp !== undefined
                  ? `${(stockfishInfo.scoreCp / 100).toFixed(2)}`
                  : '0.00'}
              </strong>
            </span>
            {stockfishInfo.nps ? (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-mono">
                  {(stockfishInfo.nps / 1000).toFixed(0)}k nodes/s
                </span>
              </>
            ) : null}
          </div>

          {stockfishInfo.bestMove && (
            <div className="text-slate-400 font-mono text-[11px]">
              Engine Suggestion: <span className="text-emerald-400 font-bold">{stockfishInfo.bestMove}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Board & Coach Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Chess Board & Match Controls */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[540px] space-y-3">
            {/* Opponent Info Card */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedBot.avatar}</span>
                <span className="text-xs font-bold text-slate-200">{selectedBot.name}</span>
                {isBotThinking && (
                  <span className="text-[11px] text-amber-400 animate-pulse flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3" /> Calculating...
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-400">
                {playerColor === 'w' ? 'Black' : 'White'}
              </span>
            </div>

            {/* Interactive Chess Board with Error Boundary */}
            <ErrorBoundary
              fallbackTitle="Board Position Recovery"
              onReset={() => {
                setActiveMoveIndex(movesHistory.length - 1);
                setSelectedSquare(null);
              }}
            >
              <ChessBoard
                chess={displayedChess}
                onMove={handlePlayerMove}
                playerColor={playerColor}
                isInteractive={!gameResult && !isBotThinking && !isPreviewingPast}
                lastMove={displayedLastMove}
                evaluation={displayedEval}
                onPieceSelect={(sq) => setSelectedSquare(sq)}
                selectedSquare={selectedSquare}
              />
            </ErrorBoundary>

            {/* Past Move Preview Banner */}
            {isPreviewingPast && (
              <div className="flex items-center justify-between px-3 py-2 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                <div className="flex items-center gap-1.5 font-medium">
                  <span>
                    Viewing move {activeMoveIndex === -1 ? '0 (Start)' : `${activeMoveIndex + 1} of ${movesHistory.length}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRewindToPreview}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/40 transition-colors text-[11px]"
                  >
                    Rewind Game to Here
                  </button>
                  <button
                    onClick={() => setActiveMoveIndex(movesHistory.length - 1)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-colors text-[11px]"
                  >
                    Return to Live
                  </button>
                </div>
              </div>
            )}

            {/* Player Info Card */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-400">
                  You
                </div>
                <span className="text-xs font-bold text-slate-200">Player</span>
                <span className="text-[11px] font-mono text-amber-400 font-semibold">({userRating})</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {playerColor === 'w' ? 'White' : 'Black'}
              </span>
            </div>

            {/* In-Game Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  id="btn-new-game"
                  onClick={() => startNewGame(playerColor, selectedBot)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> New Game
                </button>

                {/* Rewind / Back Button */}
                <button
                  id="btn-rewind-action-bar"
                  onClick={handleRewindMove}
                  disabled={movesHistory.length === 0 || isBotThinking}
                  className="text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-amber-300 px-3 py-2 rounded-xl border border-amber-500/30 font-semibold flex items-center gap-1.5 transition-colors"
                  title="Rewind the previous move (Undo)"
                >
                  <Undo2 className="w-3.5 h-3.5 text-amber-400" /> Rewind
                </button>

                <button
                  id="btn-pgn-action-bar"
                  onClick={() => setIsPgnModalOpen(true)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
                  title="Import or Export PGN"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" /> PGN
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-switch-color"
                  onClick={() => startNewGame(playerColor === 'w' ? 'b' : 'w', selectedBot)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Swords className="w-3.5 h-3.5" /> Play as {playerColor === 'w' ? 'Black' : 'White'}
                </button>
                <button
                  onClick={handleDraw}
                  disabled={Boolean(gameResult)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Handshake className="w-3.5 h-3.5" /> Draw
                </button>
                <button
                  onClick={handleResign}
                  disabled={Boolean(gameResult)}
                  className="text-xs bg-rose-950/40 hover:bg-rose-950/70 disabled:opacity-40 text-rose-300 px-3 py-2 rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" /> Resign
                </button>
              </div>
            </div>

            {/* Game Over Banner */}
            {gameResult && (
              <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl space-y-3 text-center animate-in fade-in">
                <div className="text-base font-bold text-amber-300 flex items-center justify-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Match Finished: {gameResult}
                </div>
                <p className="text-xs text-slate-300">{terminationText}</p>

                {/* Inline Replay / Step Controller after match ends */}
                {movesHistory.length > 0 && (
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2 flex items-center justify-between gap-1.5 max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={() => handleStepMoveIndex(-1)}
                      disabled={activeMoveIndex <= -1}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs transition-colors"
                      title="Start position"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepMoveIndex(activeMoveIndex - 1)}
                      disabled={activeMoveIndex <= -1}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs transition-colors"
                      title="Previous move"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (activeMoveIndex >= movesHistory.length - 1) {
                          setActiveMoveIndex(-1);
                        }
                        setIsReplaying((prev) => !prev);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isReplaying 
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                      }`}
                      title={isReplaying ? "Pause replay" : "Auto replay moves"}
                    >
                      {isReplaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isReplaying ? 'Pause' : 'Replay'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStepMoveIndex(activeMoveIndex + 1)}
                      disabled={activeMoveIndex >= movesHistory.length - 1}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs transition-colors"
                      title="Next move"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepMoveIndex(movesHistory.length - 1)}
                      disabled={activeMoveIndex >= movesHistory.length - 1}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs transition-colors"
                      title="End position"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[11px] font-mono text-slate-400 pl-1">
                      {activeMoveIndex + 1} / {movesHistory.length}
                    </span>
                  </div>
                )}

                <div className="pt-1 flex justify-center gap-3">
                  <button
                    id="btn-launch-review"
                    onClick={() => {
                      const finalRecord: GameRecord = {
                        id: `game-${Date.now()}`,
                        date: new Date().toLocaleDateString(),
                        whitePlayer: playerColor === 'w' ? 'You' : selectedBot.name,
                        blackPlayer: playerColor === 'b' ? 'You' : selectedBot.name,
                        playerColor,
                        botLevel: selectedBot.name,
                        result: gameResult as any,
                        terminationReason: terminationText,
                        pgn: chess.pgn(),
                        moves: movesHistory,
                        whiteAccuracy: chessEngine.calculateAccuracy(movesHistory, 'w'),
                        blackAccuracy: chessEngine.calculateAccuracy(movesHistory, 'b'),
                        whiteBlunders: movesHistory.filter(m => m.color === 'w' && m.classification === 'blunder').length,
                        blackBlunders: movesHistory.filter(m => m.color === 'b' && m.classification === 'blunder').length,
                        whiteMistakes: movesHistory.filter(m => m.color === 'w' && m.classification === 'mistake').length,
                        blackMistakes: movesHistory.filter(m => m.color === 'b' && m.classification === 'mistake').length,
                        whiteInaccuracies: movesHistory.filter(m => m.color === 'w' && m.classification === 'inaccuracy').length,
                        blackInaccuracies: movesHistory.filter(m => m.color === 'b' && m.classification === 'inaccuracy').length,
                        ratingBefore: userRating,
                        ratingAfter: userRating + (gameResult === '1-0' && playerColor === 'w' ? 15 : -10),
                      };
                      onNavigateToReview(finalRecord);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Eye className="w-4 h-4" /> Open Full Game Analysis
                  </button>
                  <button
                    onClick={() => startNewGame(playerColor, selectedBot)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
                  >
                    Rematch
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Move History or Coach Panel */}
        <div className="lg:col-span-5 h-[580px] flex flex-col space-y-2">
          {/* Permanent Master Tab & Live Analysis Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-md">
            <div className="flex gap-1">
              <button
                id="tab-btn-history"
                type="button"
                onClick={() => setRightPanelTab('history')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  rightPanelTab === 'history'
                    ? 'bg-slate-800 text-amber-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Move History ({movesHistory.length})</span>
              </button>
              <button
                id="tab-btn-coach"
                type="button"
                onClick={() => setRightPanelTab('coach')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  rightPanelTab === 'coach'
                    ? 'bg-slate-800 text-amber-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Coach & Tactics</span>
                {showLiveAnalysis && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            </div>

            {/* Prominent Live Coach ON/OFF Switch */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                Live Coach:
              </span>
              <button
                id="btn-master-toggle-live-coach"
                type="button"
                role="switch"
                aria-checked={showLiveAnalysis}
                onClick={() => {
                  const nextState = !showLiveAnalysis;
                  setShowLiveAnalysis(nextState);
                  if (nextState) {
                    setRightPanelTab('coach');
                  }
                }}
                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  showLiveAnalysis ? 'bg-amber-500' : 'bg-slate-700'
                }`}
                title={showLiveAnalysis ? "Live Analysis is ON. Click to STOP." : "Live Analysis is OFF. Click to START."}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-black ${
                    showLiveAnalysis ? 'translate-x-6 text-amber-600' : 'translate-x-0 text-slate-500'
                  }`}
                >
                  {showLiveAnalysis ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 min-h-0">
            {rightPanelTab === 'history' ? (
              <MoveHistoryPanel
                moves={movesHistory}
                activeMoveIndex={activeMoveIndex}
                onSelectMoveIndex={(idx) => {
                  setIsReplaying(false);
                  handleStepMoveIndex(idx);
                }}
                onRewindMove={handleRewindMove}
                canRewind={movesHistory.length > 0 && !isBotThinking}
                showLiveAnalysis={showLiveAnalysis}
                onToggleLiveAnalysis={(enabled) => {
                  setShowLiveAnalysis(enabled);
                  if (enabled) setRightPanelTab('coach');
                }}
                onOpenPgnModal={() => setIsPgnModalOpen(true)}
                whitePlayerName={playerColor === 'w' ? 'You' : selectedBot.name}
                blackPlayerName={playerColor === 'b' ? 'You' : selectedBot.name}
                isBotThinking={isBotThinking}
                isReplaying={isReplaying}
                onToggleReplay={() => {
                  if (movesHistory.length === 0) return;
                  if (activeMoveIndex >= movesHistory.length - 1) {
                    setActiveMoveIndex(-1);
                  }
                  setIsReplaying((prev) => !prev);
                }}
              />
            ) : (
              <CoachPanel
                chess={displayedChess}
                lastMoveAnalysis={latestPlayerMove}
                selectedSquare={selectedSquare}
                onSaveBlunderAsPuzzle={handleSaveBlunder}
                isSavedAsPuzzle={latestPlayerMove ? savedPuzzleIds.has(latestPlayerMove.san) : false}
                showLiveAnalysis={showLiveAnalysis}
                onToggleLiveAnalysis={(enabled) => {
                  setShowLiveAnalysis(enabled);
                  if (!enabled) setRightPanelTab('history');
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* PGN Import / Export Modal */}
      <PgnModal
        isOpen={isPgnModalOpen}
        onClose={() => setIsPgnModalOpen(false)}
        currentPgn={chess.pgn()}
        onImportPgn={handleImportPgn}
        whitePlayerName={playerColor === 'w' ? 'You' : selectedBot.name}
        blackPlayerName={playerColor === 'b' ? 'You' : selectedBot.name}
      />
    </div>
  );
};
