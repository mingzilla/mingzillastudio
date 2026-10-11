// name -> widget. Resolved lazily (functions), so load order does not matter.
// Every widget exposes draw(host, { theme, themeName, reduceMotion, ...props }) -> { setTheme(theme), destroy() }.
const WidgetRegistry = {
  get(name) {
    const m = {
      map: () => ({ draw: (el, o) => MapWidget.draw(el, o.data, { ...o, theme: MapWidget.themes[o.themeName] }), setThemeAdapter: (w, o) => w.setTheme(MapWidget.themes[o.themeName]) }),
      team: () => TeamWidget, isolation: () => IsolationWidget, search: () => SearchWidget, race: () => RaceWidget, wall: () => WallWidget,
      skills: () => typeof SkillsWidget !== 'undefined' && SkillsWidget, optimise: () => typeof OptimiseWidget !== 'undefined' && OptimiseWidget,
      domain: () => typeof DomainWidget !== 'undefined' && DomainWidget, discovery: () => typeof DiscoveryWidget !== 'undefined' && DiscoveryWidget,
      uiauto: () => typeof UiAutoWidget !== 'undefined' && UiAutoWidget, video: () => typeof VideoWidget !== 'undefined' && VideoWidget,
      tax: () => typeof TaxWidget !== 'undefined' && TaxWidget, vectors: () => typeof VectorsWidget !== 'undefined' && VectorsWidget,
      changes: () => typeof ChangesWidget !== 'undefined' && ChangesWidget,
      permissions: () => typeof PermissionsWidget !== 'undefined' && PermissionsWidget,
    };
    return m[name] ? m[name]() : null;
  },
};
