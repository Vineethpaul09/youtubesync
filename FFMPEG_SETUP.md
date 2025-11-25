# FFmpeg Installation Guide

## Windows Installation

### Option 1: Using Chocolatey (Recommended)

```powershell
choco install ffmpeg
```

### Option 2: Manual Installation

1. Download FFmpeg from https://www.gyan.dev/ffmpeg/builds/
2. Extract the downloaded zip file
3. Add the `bin` folder to your PATH:
   - Open System Properties → Environment Variables
   - Edit PATH variable
   - Add: `C:\path\to\ffmpeg\bin`
4. Verify installation:
   ```powershell
   ffmpeg -version
   ```

## Verify Installation

After installation, run:

```bash
ffmpeg -version
ffprobe -version
```

Both commands should display version information.

## Next Steps

Once FFmpeg is installed:

1. Restart your terminal/PowerShell
2. Restart the worker service: `cd worker && npm run dev`
3. Test file conversion through the UI

## Troubleshooting

If you get "ffmpeg not found" errors:

- Make sure FFmpeg is in your PATH
- Restart your terminal after installation
- On Windows, you may need to restart VS Code

## Alternative: FFmpeg Static Binaries

For development, you can also use ffmpeg-static npm package:

```bash
npm install ffmpeg-static
```

Then update `worker/.env`:

```
FFMPEG_PATH=node_modules/ffmpeg-static/ffmpeg.exe
```
