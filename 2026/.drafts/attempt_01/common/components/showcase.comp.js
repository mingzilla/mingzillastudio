// children: `.copy` and `.visual` blocks. variant: extra css class, e.g. "featured".
function Showcase({ variant = '', children }) {
  const [ref, visible] = useReveal();
  return html`<article ref=${ref} className=${`showcase ${variant} reveal${visible ? ' visible' : ''}`}>${children}</article>`;
}
