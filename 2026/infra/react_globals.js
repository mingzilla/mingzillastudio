const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToId = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); };
