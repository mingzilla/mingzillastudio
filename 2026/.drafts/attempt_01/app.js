ReactDOM.createRoot(document.getElementById('root')).render(html`<${ProfilePage} />`);
addEventListener('load', () => { if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView(); });
