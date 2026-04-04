import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export const COUNTRIES = [
    { code: 'IN', flag: '🇮🇳', name: 'India',          dial: '+91'  },
    { code: 'US', flag: '🇺🇸', name: 'United States',  dial: '+1'   },
    { code: 'CA', flag: '🇨🇦', name: 'Canada',          dial: '+1'   },
    { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', dial: '+44'  },
    { code: 'AE', flag: '🇦🇪', name: 'UAE',             dial: '+971' },
    { code: 'AU', flag: '🇦🇺', name: 'Australia',       dial: '+61'  },
    { code: 'DE', flag: '🇩🇪', name: 'Germany',         dial: '+49'  },
    { code: 'FR', flag: '🇫🇷', name: 'France',          dial: '+33'  },
    { code: 'SG', flag: '🇸🇬', name: 'Singapore',       dial: '+65'  },
    { code: 'JP', flag: '🇯🇵', name: 'Japan',           dial: '+81'  },
    { code: 'CN', flag: '🇨🇳', name: 'China',           dial: '+86'  },
    { code: 'BR', flag: '🇧🇷', name: 'Brazil',          dial: '+55'  },
    { code: 'IT', flag: '🇮🇹', name: 'Italy',           dial: '+39'  },
    { code: 'ES', flag: '🇪🇸', name: 'Spain',           dial: '+34'  },
    { code: 'RU', flag: '🇷🇺', name: 'Russia',          dial: '+7'   },
    { code: 'MY', flag: '🇲🇾', name: 'Malaysia',        dial: '+60'  },
    { code: 'TH', flag: '🇹🇭', name: 'Thailand',        dial: '+66'  },
    { code: 'ZA', flag: '🇿🇦', name: 'South Africa',   dial: '+27'  },
    { code: 'NZ', flag: '🇳🇿', name: 'New Zealand',    dial: '+64'  },
    { code: 'PK', flag: '🇵🇰', name: 'Pakistan',        dial: '+92'  },
    { code: 'BD', flag: '🇧🇩', name: 'Bangladesh',      dial: '+880' },
    { code: 'LK', flag: '🇱🇰', name: 'Sri Lanka',       dial: '+94'  },
    { code: 'NP', flag: '🇳🇵', name: 'Nepal',           dial: '+977' },
    { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia',   dial: '+966' },
    { code: 'KW', flag: '🇰🇼', name: 'Kuwait',          dial: '+965' },
    { code: 'QA', flag: '🇶🇦', name: 'Qatar',           dial: '+974' },
    { code: 'OM', flag: '🇴🇲', name: 'Oman',            dial: '+968' },
    { code: 'BH', flag: '🇧🇭', name: 'Bahrain',         dial: '+973' },
    { code: 'MV', flag: '🇲🇻', name: 'Maldives',        dial: '+960' },
];

/**
 * value  = { countryCode: 'IN', dialCode: '+91', number: '9876543210' }
 * onChange = (value) => void
 * hasError = bool — turns the border red
 */
const PhoneInput = ({ value, onChange, hasError = false, placeholder = 'Phone number' }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = COUNTRIES.find(c => c.code === value.countryCode) || COUNTRIES[0];

    const filtered = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search)
    );

    const handleCountrySelect = (country) => {
        onChange({ countryCode: country.code, dialCode: country.dial, number: value.number });
        setOpen(false);
        setSearch('');
    };

    const handleNumberChange = (e) => {
        onChange({ ...value, number: e.target.value.replace(/\D/g, '') });
    };

    return (
        <div className="relative" ref={ref}>
            {/* Input row */}
            <div className={`flex items-center border-2 rounded-2xl bg-white dark:bg-gray-800 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 ${hasError ? 'border-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}>
                {/* Country code trigger */}
                <button
                    type="button"
                    onClick={() => setOpen(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-3.5 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0 rounded-l-2xl"
                >
                    <span className="text-lg leading-none">{selected.flag}</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 tabular-nums">{selected.dial}</span>
                    <ChevronDown size={13} className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}/>
                </button>

                {/* Number input */}
                <input
                    type="tel"
                    value={value.number}
                    onChange={handleNumberChange}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3.5 bg-transparent outline-none font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-[300] overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search country or code..."
                                autoFocus
                                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 rounded-xl outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-52 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-4 font-medium">No country found.</p>
                        ) : filtered.map(c => (
                            <button
                                key={c.code}
                                type="button"
                                onClick={() => handleCountrySelect(c)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                                    value.countryCode === c.code
                                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                                        : 'text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                <span className="text-lg shrink-0 leading-none">{c.flag}</span>
                                <span className="flex-1 truncate">{c.name}</span>
                                <span className="text-gray-400 dark:text-gray-500 font-mono text-xs shrink-0">{c.dial}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhoneInput;
