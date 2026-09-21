/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── Paleta Faro Energético (tokens Stitch) ───────────────────────────
      colors: {
        // Primarios
        'primary':                  '#000f22',
        'on-primary':               '#ffffff',
        'primary-container':        '#0a2540',
        'on-primary-container':     '#768dad',
        'primary-fixed':            '#d2e4ff',
        'primary-fixed-dim':        '#b0c8eb',
        'on-primary-fixed':         '#001c37',
        'on-primary-fixed-variant': '#314865',
        'inverse-primary':          '#b0c8eb',
        // Secundarios
        'secondary':                '#904d00',
        'on-secondary':             '#ffffff',
        'secondary-container':      '#fe932c',
        'on-secondary-container':   '#663500',
        'secondary-fixed':          '#ffdcc3',
        'secondary-fixed-dim':      '#ffb77d',
        'on-secondary-fixed':       '#2f1500',
        'on-secondary-fixed-variant': '#6e3900',
        // Terciarios
        'tertiary':                 '#280005',
        'on-tertiary':              '#ffffff',
        'tertiary-container':       '#500012',
        'on-tertiary-container':    '#ff405f',
        'tertiary-fixed':           '#ffdada',
        'tertiary-fixed-dim':       '#ffb3b6',
        'on-tertiary-fixed':        '#40000c',
        'on-tertiary-fixed-variant': '#920028',
        // Error
        'error':                    '#ba1a1a',
        'on-error':                 '#ffffff',
        'error-container':          '#ffdad6',
        'on-error-container':       '#93000a',
        // Superficies
        'surface':                  '#f8f9ff',
        'surface-dim':              '#cbdbf5',
        'surface-bright':           '#f8f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low':    '#eff4ff',
        'surface-container':        '#e5eeff',
        'surface-container-high':   '#dce9ff',
        'surface-container-highest':'#d3e4fe',
        'surface-variant':          '#d3e4fe',
        'surface-tint':             '#49607e',
        'on-surface':               '#0b1c30',
        'on-surface-variant':       '#43474d',
        'inverse-surface':          '#213145',
        'inverse-on-surface':       '#eaf1ff',
        'background':               '#f8f9ff',
        'on-background':            '#0b1c30',
        // Contorno
        'outline':                  '#74777e',
        'outline-variant':          '#c4c6ce',
      },

      // ─── Border Radius ────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '0.25rem',
        sm:      '0.125rem',
        md:      '0.375rem',
        lg:      '0.5rem',
        xl:      '0.75rem',
        full:    '9999px',
      },

      // ─── Espaciado ────────────────────────────────────────────────────────
      spacing: {
        'space-xs':       '0.25rem',
        'space-sm':       '0.5rem',
        'space-md':       '1rem',
        'space-lg':       '1.5rem',
        'space-xl':       '2.5rem',
        'gutter':         '1.5rem',
        'gutter-mobile':  '1rem',
        'margin':         '2rem',
        'margin-mobile':  '1rem',
      },

      // ─── Tipografía ───────────────────────────────────────────────────────
      fontFamily: {
        'sans':               ['"Source Sans 3"', 'Oswald', 'sans-serif'],
        'display':            ['Oswald', 'sans-serif'],
        'headline-lg':        ['Oswald', 'sans-serif'],
        'headline-md':        ['Oswald', 'sans-serif'],
        'headline-sm':        ['Oswald', 'sans-serif'],
        'title-editorial':    ['Oswald', 'sans-serif'],
        'label-ticker':       ['Oswald', 'sans-serif'],
        'body-lead':          ['"Source Sans 3"', 'sans-serif'],
        'body-md':            ['"Source Sans 3"', 'sans-serif'],
        'body-sm':            ['"Source Sans 3"', 'sans-serif'],
        'label-caption':      ['"Source Sans 3"', 'sans-serif'],
      },

      fontSize: {
        'display':            ['56px', { lineHeight: '60px',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-mobile':     ['38px', { lineHeight: '42px',  letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg':        ['36px', { lineHeight: '40px',  letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg-mobile': ['28px', { lineHeight: '32px',  letterSpacing: '0em',     fontWeight: '600' }],
        'headline-md':        ['26px', { lineHeight: '30px',  fontWeight: '600' }],
        'headline-sm':        ['20px', { lineHeight: '24px',  fontWeight: '500' }],
        'title-editorial':    ['17px', { lineHeight: '22px',  letterSpacing: '0.02em',  fontWeight: '600' }],
        'body-lead':          ['19px', { lineHeight: '28px',  fontWeight: '400' }],
        'body-md':            ['16px', { lineHeight: '24px',  fontWeight: '400' }],
        'body-sm':            ['14px', { lineHeight: '20px',  fontWeight: '400' }],
        'label-ticker':       ['13px', { lineHeight: '16px',  letterSpacing: '0.05em',  fontWeight: '600' }],
        'label-caption':      ['12px', { lineHeight: '16px',  letterSpacing: '0.03em',  fontWeight: '600' }],
      },

      // ─── Ancho máximo editorial ───────────────────────────────────────────
      maxWidth: {
        prose: '720px',
      },
    },
  },
  plugins: [],
};
