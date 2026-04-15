const dictionary = {
  en: {
    MALE: 'Male',
    FEMALE: 'Female',
    ABP: 'ABP',
    HR: 'HR',
    SPO2: 'SPO2',
    PPV: 'PPV',
    TB: 'TB',

    ELWI: 'ELWI',
    PVPI: 'PVPI',
    tdCI: 'tdCI',
    GEDI: 'GEDI',
    GEF: 'GEF',
    CFI: 'CFI',

    CI: 'CI',
    SVV: 'SVV',
    Eadyn: 'Eadyn',
    CPI: 'CPI',
    dpMx: 'dpMx',
    SVRI: 'SVRI',

    AP: 'AP',
    CVP: 'CVP',
    SVI: 'SVI',
    ScvO2: 'ScvO2',

    'TD Measurement': 'TD Measurement',
    Start: 'Start',
    'Inj Vol.': 'Inj Vol.',
    Settings: 'Settings',
    Stop: 'Stop',
    'Wait...': 'Wait...',
    'Inject ? ml': 'Inject ?ml',
    Injecting: 'Injection',

    PAP: 'PAP',
    SvO2: 'SvO2',
    PAWP: 'PAWP',
    RAP: 'RAP',

    'volume-control': 'VOLUME CONTROL',
    'pressure-control': 'PRESSURE CONTROL',
    'spontaneous-breathing': 'SPONTANEOUS BREATHING',
    'assisted-ventilation': 'ASSISTED VENTILATION',

    PBW: 'PBW',
    'Tidal Volume': 'Tidal Volume',
    PEEP: 'PEEP',
    Ppeak: 'Ppeak',
    etCO2: 'etCO2',
    VTe: 'VTe',
    MVe: 'MVe'
  },
  fr: {
    MALE: 'Masc.',
    FEMALE: 'Fem.',
    ABP: 'PA',
    HR: 'FC',
    SPO2: 'SPO2',
    PPV: 'VPP',
    TB: 'TS',

    ELWI: 'EPEI',
    PVPI: 'PVPI',
    tdCI: 'tdIC',
    GEDI: 'VTDI',
    GEF: 'FEG',
    CFI: 'IFC',

    CI: 'IC',
    SVV: 'VVE',
    Eadyn: 'Eadyn',
    CPI: 'PCI',
    dpMx: 'dpMx',
    SVRI: 'RVSI',

    AP: 'PA',
    CVP: 'PVC',
    SVI: 'VEI',
    ScvO2: 'ScvO2',

    'TD Measurement': 'Mesure TD',
    Start: 'Début',
    'Inj Vol.': 'Vol. Injecté',
    Settings: 'Réglages',
    Stop: 'Arrêt',
    'Wait...': 'Patienter...',
    'Inject ? ml': 'Injecter ?ml',
    Injecting: 'Injection',

    PAP: 'PAP',
    SvO2: 'SvO2',
    PAWP: 'PAPO',
    RAP: 'POD',

    'volume-control': 'Vol. Contrôlé',
    'pressure-control': 'Pression contrôlée',
    'spontaneous-breathing': 'Resp. spontanée',
    'assisted-ventilation': 'Ventil. Assistée',

    PBW: 'PP',
    'Tidal Volume': 'Volume courant',
    PEEP: 'PEEP',
    Ppeak: 'Pcr',
    etCO2: 'etCO2',
    VTe: 'VTe',
    MVe: 'MVe'
  }
}

const getDictionary = () => {
  if (window.location.search.includes('locale=fr')) return dictionary.fr
  return dictionary.en
}

export { getDictionary }
