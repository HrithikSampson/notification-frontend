🚀 Next.js App

This is a Next.js application bootstrapped with create-next-app.

🛠 Prerequisites
Ensure you have the following installed:

Node.js (v18 or later)

npm or yarn

Optional: Docker (for containerization)

📦 Install Dependencies
```
npm install
# or
yarn install
```
⚙️ Environment Variables
Create a .env.local file in the root directory:
```
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:4500
```
🔐 Prefix with NEXT_PUBLIC_ to expose to the frontend.

🧪 Run the Dev Server
```
npm run dev
# or
yarn dev
```
By default, the app runs at: http://localhost:3000

🧱 Build for Production
```
npm run build
npm run start
```
