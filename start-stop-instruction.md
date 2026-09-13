# Start and Stop Instructions for Chess Bot

## Starting the Server

### Development Mode
To start the server in development mode (with hot reloading and debug output):

```bash
npm run dev
```

Alternative methods:
```bash
# Directly using tsx binary
./node_modules/.bin/tsx server.ts

# Or with npx
npx tsx server.ts
```

The development server will run on http://0.0.0.0:3000
You can access it in your browser at: http://localhost:3000

### Production Mode
To build and run the production version:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

This will:
1. Build client assets with Vite
2. Bundle the server code with esbuild
3. Start the server from the built files in the `dist/` directory

## Stopping the Server

### Method 1: Using the stop script (Recommended)
Run the provided stop script to terminate the development server:

```bash
node stop-server.js
```

This script finds and kills any process listening on port 3000.

### Method 2: Keyboard Interrupt
If the server is running in the foreground (you started it and can see its output):
- Press `Ctrl + C` in the terminal window

### Method 3: Task Manager
1. Open Windows Task Manager (Ctrl + Shift + Esc)
2. Look for Node.js processes
3. End the task(s) related to your chess bot server

### Method 4: Manual Process Kill (Advanced)
If you need to manually kill the process:

```bash
# Find the process ID using netstat
netstat -ano | findstr :3000

# Kill the process using the PID shown above (replace PID with actual number)
taskkill /PID <PID> /F
```

## Troubleshooting

### Port Already in Use
If you get an error about port 3000 already being in use:
1. Run `node stop-server.js` to clear any existing processes
2. Wait a few seconds and try starting again
3. Or change the port in server.ts if needed

### Module Not Found Errors
If you see errors like "Cannot find module":
1. Make sure you ran `npm install` first
2. Try deleting `node_modules` and `package-lock.json` then run `npm install` again
3. Ensure you're in the correct project directory

## File Summary
- `stop-server.js`: Script to stop the development server
- `start-stop-instruction.md`: This file
- `package.json`: Contains the scripts ("dev", "build", "start", etc.)
- `server.ts`: Main server entry point
- `dist/`: Built production files (created after running `npm run build`)

## Notes
- The development server (`tsx server.ts`) provides better debugging and faster iteration
- The production server (`node dist/server.cjs`) is optimized for deployment
- Always stop the development server before starting production on the same port to avoid conflicts