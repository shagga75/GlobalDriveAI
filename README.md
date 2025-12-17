# 🌍 GlobalDrive AI

**GlobalDrive AI** is an intelligent interactive guide designed to help travelers and expats understand international driving regulations instantly. 

Powered by **Google Gemini 2.5** and **Google Search Grounding**, it provides real-time, verified information about International Driving Permits (IDP) and Reciprocal License Exchange Agreements for 195+ countries.

## 🚀 Features

- **🤖 AI-Powered Analysis**: Uses Gemini 2.5 Flash to analyze complex cross-border regulations.
- **🌐 Real-Time Grounding**: Validates data using Google Search to ensure up-to-date info on laws and treaties.
- **🗺️ Interactive World Map**: Select origin and destination countries visually.
- **📄 PDF Reports & Sharing**: Generate print-ready guides or share natively via mobile.
- **🛡️ Legal Compliance**: Built-in disclaimer modal and user acceptance flow.
- **⚡ Modern Tech Stack**: Built with React 19, Tailwind CSS, and TypeScript.

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/globaldrive-ai.git
   cd globaldrive-ai
   ```

2. **Install dependencies**
   Debido a que usamos React 19, es posible que algunas librerías de mapas requieran el flag de dependencias antiguas:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment (Crucial!)**
   Create a `.env` file in the root directory and add your Google Gemini API Key. 
   **Note:** Never commit this file to GitHub.
   ```env
   API_KEY=your_google_genai_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm start
   ```

## 🧩 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI Integration**: Google GenAI SDK (`gemini-2.5-flash`)
- **Visuals**: React Simple Maps, Lucide React

## 📦 Deployment (Vercel/Netlify)

The project includes a `.npmrc` file configured with `legacy-peer-deps=true` to ensure the build succeeds in CI/CD environments despite React 19 peer dependency warnings from older libraries.

## 📄 License

Distributed under the MIT License.

---

*Note: This application provides information for reference purposes only. Always consult official local embassies for legal driving requirements.*
