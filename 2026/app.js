ReactDOM.createRoot(document.getElementById('root')).render(html`<${ProfilePage} />`);
addEventListener('load', () => { if (location.hash) setTimeout(() => scrollToId(location.hash.slice(1)), 300); });
