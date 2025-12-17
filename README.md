# 🌍 GlobalDrive AI

**GlobalDrive AI** is an intelligent interactive guide designed to help travelers and expats understand international driving regulations instantly. 

Powered by **Google Gemini 3 Flash** and **Google Search Grounding**, it provides real-time, verified information about International Driving Permits (IDP) and Reciprocal License Exchange Agreements for 195+ countries.

## 🚀 Features

- **🤖 AI-Powered Analysis**: Uses Gemini 3 Flash to analyze complex cross-border regulations.
- **🌐 Real-Time Grounding**: Validates data using Google Search to ensure up-to-date info on laws and treaties.
- **🗺️ Interactive World Map**: Select origin and destination countries visually.
- **📄 PDF Reports & Sharing**: Generate print-ready guides or share natively via mobile.
- **🛡️ Legal Compliance**: Built-in disclaimer modal and user acceptance flow.
- **⚡ Modern Tech Stack**: Built with React 19, Tailwind CSS, and TypeScript.

## 📦 Deployment (Vercel/Netlify)

Debido a que usamos **React 19** y algunas librerías de mapas aún requieren versiones anteriores de React en sus metadatos (peer dependencies), el proyecto incluye un archivo `.npmrc` con `legacy-peer-deps=true`.

**⚠️ Si el error persiste en Vercel:**
1. Ve a tu proyecto en el Dashboard de Vercel.
2. Entra en **Settings** > **General**.
3. En la sección **Install Command**, activa el "Override" y escribe:
   `npm install --legacy-peer-deps`
4. Redespliega tu aplicación.

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/globaldrive-ai.git
   cd globaldrive-ai
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_google_genai_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm start
   ```

---
*Note: This application provides information for reference purposes only. Always consult official local embassies.*
