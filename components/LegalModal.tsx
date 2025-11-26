import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';

interface LegalModalProps {
  onAccept: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all scale-100 border border-slate-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert size={28} />
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2">Important Disclaimer</h2>
          
          <div className="text-sm text-slate-600 space-y-3 mb-6 bg-slate-50 p-4 rounded-lg text-left border border-slate-100 max-h-60 overflow-y-auto">
            <p>
              <strong>GlobalDrive AI uses artificial intelligence</strong> to analyze driving regulations. While we strive for accuracy by using real-time grounding, international laws change frequently.
            </p>
            <p>
              This tool is for <strong>informational purposes only</strong> and does NOT constitute legal advice.
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Always verify with the local embassy or consulate.</li>
              <li>We are not responsible for fines, impounded vehicles, or legal issues arising from the use of this data.</li>
              <li>Official government sources take precedence over this AI.</li>
            </ul>
          </div>

          <button
            onClick={onAccept}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;