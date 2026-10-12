// Global light/dark swap. Returns [flipped, toggle]. Remembered per browser; storage may be unavailable.
function useFlipTones() {
  const read = () => { try { return localStorage.getItem('flipTones') === '1'; } catch (e) { return false; } };
  const [flip, setFlip] = useState(read);
  const toggle = () => setFlip(f => { try { localStorage.setItem('flipTones', f ? '0' : '1'); } catch (e) {} return !f; });
  return [flip, toggle];
}
