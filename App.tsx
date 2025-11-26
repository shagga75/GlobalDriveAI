import React, { useState, useEffect } from 'react';
import { Map, Car, ArrowRightLeft, Info, CheckCircle2, AlertTriangle, Search, Loader2, Plane, Home as HomeIcon, Globe2, Github } from 'lucide-react';
import CountrySelector from './components/CountrySelector';
import ResultsRenderer from './components/ResultsRenderer';
import InteractiveMap from './components/InteractiveMap';
import LegalModal from './components/LegalModal';
import { fetchDrivingRegulations } from './services/geminiService';
import { SearchResult, SearchType } from './types';
import { SUGGESTED_QUERIES } from './constants';

const App: React.FC = () => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('TOURIST');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'origin' | 'destination'>('origin');
  
  // Legal Acceptance State
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage on load
    const accepted = localStorage.getItem('globaldrive_terms_accepted');
    if (accepted === 'true') {
      setHasAcceptedTerms(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    setHasAcceptedTerms(true);
    localStorage.setItem('globaldrive_terms_accepted', 'true');
  };

  const handleSearch = async () => {
    if (!origin || !destination) return;
    if (origin === destination) {
      setError("Origin and destination cannot be the same.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchDrivingRegulations(origin, destination, searchType);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (o: string, d: string, t: SearchType) => {
    setOrigin(o);
    setDestination(d);
    setSearchType(t);
    manualSearch(o, d, t);
  };

  const manualSearch = async (o: string, d: string, t: SearchType) => {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const data = await fetchDrivingRegulations(o, d, t);
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
  }

  const handleMapSelect = (countryName: string) => {
      if (mapMode === 'origin') {
          if (countryName === destination) {
              setError("Origin cannot be the same as destination");
              return;
          }
          setOrigin(countryName);
          setMapMode('destination'); // Auto-switch for better UX
          setError(null);
      } else {
          if (countryName === origin) {
              setError("Destination cannot be the same as origin");
              return;
          }
          setDestination(countryName);
          setError(null);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Legal Modal Overlay */}
      {!hasAcceptedTerms && <LegalModal onAccept={handleAcceptTerms} />}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 cursor-pointer" onClick={() => window.location.reload()}>
            <Car size={28} strokeWidth={2} />
            <span className="font-bold text-xl tracking-tight text-slate-900">GlobalDrive<span className="text-indigo-600">AI</span></span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <button className="hover:text-indigo-600 transition-colors">About IDP</button>
            <button className="hover:text-indigo-600 transition-colors">Exchange Agreements</button>
            <a href="https://www.fia.com/international-driving-permits" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">FIA Resources</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Driving Abroad? <br />
            <span className="text-indigo-600">Know Your Rights & Requirements</span>
          </h1>
          <p className="text-slate-600 text-lg">
            Instantly check International Driving Permit (IDP) rules and license exchange agreements.
          </p>
        </div>

        {/* App Container */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => { setSearchType('TOURIST'); setResult(null); }}
              className={`flex-1 py-4 text-center font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2
                ${searchType === 'TOURIST' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Plane size={18} />
              Tourist / Short Term
            </button>
            <button
              onClick={() => { setSearchType('RESIDENT'); setResult(null); }}
              className={`flex-1 py-4 text-center font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2
                ${searchType === 'RESIDENT' 
                  ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600' 
                  : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <HomeIcon size={18} />
              Resident / Moving
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Map Section */}
            <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Globe2 size={16} className="text-indigo-500"/>
                        Interactive Map
                    </h3>
                    <span className="text-xs text-slate-400 hidden sm:block">Click countries to select</span>
                </div>
                <InteractiveMap 
                    onSelect={handleMapSelect} 
                    selectedOrigin={origin}
                    selectedDestination={destination}
                    mode={mapMode}
                    setMode={setMapMode}
                />
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-1/2 p-6 md:p-8 bg-white flex flex-col justify-center">
                <div className="space-y-6">
                    {/* Input Group: Origin */}
                    <div 
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${mapMode === 'origin' ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-200' : 'border-slate-200 hover:border-indigo-200'}`}
                        onClick={() => setMapMode('origin')}
                    >
                        <CountrySelector
                            label="My License is from (Origin)"
                            value={origin}
                            onChange={(val) => { setOrigin(val); setMapMode('origin'); }}
                            exclude={destination}
                            icon={<Map className={`w-4 h-4 ${mapMode === 'origin' ? 'text-indigo-600' : 'text-slate-400'}`} />}
                        />
                    </div>

                    {/* Input Group: Destination */}
                    <div 
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${mapMode === 'destination' ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-200' : 'border-slate-200 hover:border-emerald-200'}`}
                        onClick={() => setMapMode('destination')}
                    >
                        <CountrySelector
                            label={searchType === 'TOURIST' ? "I am visiting (Destination)" : "I am moving to (Destination)"}
                            value={destination}
                            onChange={(val) => { setDestination(val); setMapMode('destination'); }}
                            exclude={origin}
                            icon={<ArrowRightLeft className={`w-4 h-4 ${mapMode === 'destination' ? 'text-emerald-600' : 'text-slate-400'}`} />}
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={loading || !origin || !destination}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        {loading ? 'Analyzing Regulations...' : 'Check Requirements'}
                    </button>
                </div>
            </div>
          </div>

          {/* Results Area */}
          {(result || loading || error) && (
            <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-200 min-h-[300px]">
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-4 animate-fade-in">
                   <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
                     <AlertTriangle size={20} />
                     Error
                   </div>
                   <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
                  <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
                  <p className="text-lg font-medium text-slate-600">Consulting international databases...</p>
                  <p className="text-sm">This uses live Google Search grounding for accuracy.</p>
                </div>
              )}

              {!loading && result && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="text-green-500" />
                      Analysis Result
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white ${searchType === 'TOURIST' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                      {searchType}
                    </span>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 print:shadow-none print:border-none">
                    <ResultsRenderer result={result} origin={origin} destination={destination} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Presets */}
        {!result && !loading && (
            <div className="max-w-4xl mx-auto mt-12">
              <h3 className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-4">Popular Checks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SUGGESTED_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePreset(q.origin, q.dest, q.type as SearchType)}
                    className="flex flex-col items-start p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left group"
                  >
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mb-2">{q.type}</span>
                    <span className="font-medium text-slate-800 group-hover:text-indigo-700">{q.label}</span>
                    <span className="text-slate-400 text-sm mt-1">{q.origin} → {q.dest}</span>
                  </button>
                ))}
              </div>
            </div>
        )}

        {/* Information Section */}
        {!result && !loading && (
          <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                 <Info size={20} />
               </div>
               <h3 className="font-bold text-slate-800 mb-2">What is an IDP?</h3>
               <p className="text-slate-600 text-sm leading-relaxed">
                 An International Driving Permit (IDP) translates your domestic driver's license into 10 languages. It is valid in 150+ countries but only when accompanied by your valid home license.
               </p>
            </div>
             <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
               <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                 <ArrowRightLeft size={20} />
               </div>
               <h3 className="font-bold text-slate-800 mb-2">License Exchange?</h3>
               <p className="text-slate-600 text-sm leading-relaxed">
                 If you become a resident of another country, your IDP or tourist privileges usually expire after 3-6 months. Many countries have reciprocal agreements to swap licenses without a test.
               </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 no-print">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} GlobalDrive AI.</p>
          <p>Information provided is for reference only. Always verify with official local authorities.</p>
          <div className="flex justify-center gap-4 mt-4">
            <button className="text-xs hover:text-indigo-600">Privacy Policy</button>
            <button className="text-xs hover:text-indigo-600">Terms of Service</button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs hover:text-indigo-600">
               <Github size={12} /> View on GitHub
            </a>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <span className="flex items-center gap-1 text-xs"><div className="w-2 h-2 rounded-full bg-green-500"></div> Gemini AI Powered</span>
            <span className="flex items-center gap-1 text-xs"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Google Search Grounded</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;