import React, { useState, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { COUNTRIES } from '../constants';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

interface InteractiveMapProps {
  onSelect: (countryName: string) => void;
  selectedOrigin: string;
  selectedDestination: string;
  mode: 'origin' | 'destination';
  setMode: (mode: 'origin' | 'destination') => void;
}

// Memoize the map to prevent unnecessary re-renders
const MapContent = memo(({ onSelect, selectedOrigin, selectedDestination, mode, setTooltipContent }: any) => {
  
  // Helper to normalize names for matching
  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

  // Manual mapping for common discrepancies between GeoJSON and our constants
  const nameAliases: {[key: string]: string} = {
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Korea, Republic of": "South Korea",
    "Dem. People's Rep. of Korea": "North Korea",
    "United Kingdom": "United Kingdom",
    "Great Britain": "United Kingdom",
    "Viet Nam": "Vietnam",
    "Iran (Islamic Republic of)": "Iran",
    "Taiwan": "Taiwan",
    "Bolivia (Plurinational State of)": "Bolivia",
    "Venezuela (Bolivarian Republic of)": "Venezuela",
    "Syrian Arab Republic": "Syria",
    "Tanzania": "Tanzania",
    "Congo": "Congo (Republic)",
    "Democratic Republic of the Congo": "Congo (DRC)"
  };

  const getCountryByName = (geoName: string) => {
    // 1. Check alias
    if (nameAliases[geoName]) {
        return COUNTRIES.find(c => c.name === nameAliases[geoName]);
    }

    // 2. Fuzzy match
    const nGeo = normalize(geoName);
    return COUNTRIES.find(c => {
        const nC = normalize(c.name);
        return nC === nGeo || nC.includes(nGeo) || nGeo.includes(nC);
    });
  };

  return (
    <Geographies geography={geoUrl}>
      {({ geographies }) =>
        geographies.map((geo) => {
          const countryName = geo.properties.name;
          const matchedCountry = getCountryByName(countryName);
          
          let fill = "#E2E8F0"; // slate-200
          let hoverFill = "#94A3B8"; // slate-400
          let stroke = "#CBD5E1"; // slate-300

          const isOrigin = matchedCountry && matchedCountry.name === selectedOrigin;
          const isDest = matchedCountry && matchedCountry.name === selectedDestination;

          if (isOrigin) {
              fill = "#4F46E5"; // indigo-600
              stroke = "#312E81";
              hoverFill = "#4338CA";
          } else if (isDest) {
              fill = "#10B981"; // emerald-500
              stroke = "#065F46";
              hoverFill = "#059669";
          } else if (mode === 'origin') {
              hoverFill = "#818CF8"; // indigo-400
          } else {
              hoverFill = "#34D399"; // emerald-400
          }

          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onMouseEnter={() => {
                setTooltipContent(matchedCountry ? matchedCountry.name : countryName);
              }}
              onMouseLeave={() => {
                setTooltipContent("");
              }}
              onClick={() => {
                if (matchedCountry) {
                    onSelect(matchedCountry.name);
                }
              }}
              style={{
                default: {
                  fill: fill,
                  stroke: stroke,
                  strokeWidth: 0.5,
                  outline: "none",
                  transition: "all 250ms"
                },
                hover: {
                  fill: hoverFill,
                  stroke: stroke,
                  strokeWidth: 0.75,
                  outline: "none",
                  cursor: matchedCountry ? "pointer" : "default"
                },
                pressed: {
                  fill: "#94A3B8",
                  outline: "none"
                }
              }}
            />
          );
        })
      }
    </Geographies>
  );
});

const InteractiveMap: React.FC<InteractiveMapProps> = (props) => {
  const [tooltipContent, setTooltipContent] = useState("");

  return (
    <div className="w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner group">
       {/* Tooltip */}
       {tooltipContent && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none shadow-lg animate-fade-in">
            {tooltipContent}
        </div>
       )}

       {/* Controls Overlay */}
       <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-semibold shadow-sm border border-slate-200 flex flex-col gap-1">
             <span className="text-slate-400 uppercase tracking-wider text-[10px]">Selection Mode</span>
             <div className="flex gap-1">
                 <button 
                    onClick={() => props.setMode('origin')}
                    className={`px-2 py-1 rounded ${props.mode === 'origin' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
                 >
                    Origin
                 </button>
                 <button 
                    onClick={() => props.setMode('destination')}
                    className={`px-2 py-1 rounded ${props.mode === 'destination' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
                 >
                    Dest
                 </button>
             </div>
          </div>
       </div>

       {/* Legend */}
       <div className="absolute bottom-4 left-4 z-10 bg-white/80 backdrop-blur p-2 rounded-lg border border-slate-200 text-[10px] text-slate-600 flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
                <span>Origin</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                <span>Destination</span>
            </div>
       </div>

      <div className="h-[300px] md:h-[400px] w-full bg-slate-100">
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }} className="w-full h-full">
              <ZoomableGroup zoom={1} minZoom={1} maxZoom={4} center={[0, 20]}>
                <MapContent {...props} setTooltipContent={setTooltipContent} />
              </ZoomableGroup>
          </ComposableMap>
      </div>
    </div>
  );
};

export default InteractiveMap;