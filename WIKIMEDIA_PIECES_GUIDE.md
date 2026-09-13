# Using Wikimedia SVG Chess Pieces

I've added a new "Wikimedia" theme option that uses SVG chess pieces from Wikimedia Commons. Currently, placeholder SVG files are in place, but you can replace them with actual Wikimedia SVG pieces for better quality.

## How to Get Actual Wikimedia SVG Pieces

1. Go to: https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
2. Look for the standard transparent set by User:Cburnett
3. Download the pieces you need (they follow the naming pattern: `Chess_[piece][color][t][size].svg`)

## File Nam Convention

The component expects files named:
- `w_p.svg` = white pawn
- `w_n.svg` = white knight
- `w_b.svg` = white bishop
- `w_r.svg` = white rook
- `w_q.svg` = white queen
- `w_k.svg` = white king
- `b_p.svg` = black pawn
- `b_n.svg` = black knight
- `b_b.svg` = black bishop
- `b_r.svg` = black rook
- `b_q.svg` = black queen
- `b_k.svg` = black king

Where:
- `w` = white pieces
- `b` = black pieces
- `p` = pawn, `n` = knight, `b` = bishop, `r` = rook, `q` = queen, `k` = king

## Replacing the Files

1. Download the SVG files from Wikimedia Commons
2. Rename them according to the convention above (or copy them to match)
3. Place them in: `public/chess-pieces/`
4. Replace the existing placeholder files

## Example: Getting Actual Files

From Wikimedia Commons, you would download files like:
- `Chess_plt45.svg` → rename to `w_p.svg` (white pawn)
- `Chess_pdt45.svg` → rename to `b_p.svg` (black pawn)
- `Chess_nlt45.svg` → rename to `w_n.svg` (white knight)
- `Chess_ndt45.svg` → rename to `b_n.svg` (black knight)
- And so on for each piece type

## Testing the Theme

Once you have the SVG files in place:
1. Start the development server: `npm run dev`
2. Click the theme selector in the top bar of the chess board
3. Select "Wikimedia" to see the standard SVG pieces
4. You can switch between "Ancient Indian", "Staunton", and "Wikimedia" themes

## Notes

- The SVG pieces will scale to fit the square size while maintaining aspect ratio
- Transparent backgrounds work well with the board's wooden theme
- These are the same pieces used on Wikipedia chess articles, so they're immediately recognizable to most players
- The pieces are licensed under multiple free licenses (GFDL, CC-BY-SA 3.0, BSD, GPL) allowing free use with attribution