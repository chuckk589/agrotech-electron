## Prerequisites
- Node.js 20+
- yarn / npm

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
   ```
4. Run postinstall script (cuts unused locales, etc.)
   ```sh
   yarn postpackage
   ```
