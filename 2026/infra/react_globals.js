const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
