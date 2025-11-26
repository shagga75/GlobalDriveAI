import React from 'react';
import { COUNTRIES } from '../constants';

interface CountrySelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  exclude?: string;
  icon: React.ReactNode;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ label, value, onChange, exclude, icon }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-slate-300 text-slate-900 text-base rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 pr-8 shadow-sm transition-shadow hover:border-indigo-300"
        >
          <option value="" disabled>Select a country...</option>
          {COUNTRIES.filter(c => c.name !== exclude).map((country) => (
            <option key={country.code} value={country.name}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default CountrySelector;
