## Prerequisites
- Node.js 20+
- yarn / npm
- Python 3.8+ (for `node-gyp`)

## Build
1. Clone the repo
   ```sh
   git clone https://github.com/chuckk589/agrotech-electron
   ```
   ```
   cd agrotech-electron
   ```
2. Create `.env` file and update it with your own values (look at `.env.example` for reference)
   ```sh
   cp .env.example .env
   ```
3. Build
   ```sh
   yarn
   yarn package --platform=linux
   yarn package --platform=win32
   yarn package --platform=darwin # not tested yet
   ```
   
4. Run postinstall script (cuts unused locales, etc.)
   ```sh
   yarn postpackage
   ```
### If you want executables 
   ```sh
   yarn make
   ```