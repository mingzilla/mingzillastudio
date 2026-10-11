// One topic: title, challenge, what it does, and its d3 widget on an inverted panel.
function Topic({ topic, tone }) {
  const w = TopicWidgets.for(topic.slug);
  return html`
    <article className="topic" id=${topic.slug}>
      <h3>${topic.title}</h3>
      <p className="challenge"><span>Challenge</span> ${topic.challenge}</p>
      ${topic.what.map((x, i) => html`<p className="what" key=${i}><${Rich} text=${x} /></p>`)}
      ${w ? html`<${Panel} label=${w[1]}><${WidgetHost} widget=${w[0]} tone=${tone === 'dark' ? 'light' : 'dark'} /><//>` : null}
    </article>`;
}
