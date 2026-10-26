function AppRootComp({ context }) {
    return html`<div className="app">
        <${TopBarComp} context=${context} />
        <${ShapeBarComp} context=${context} />
        <main className="app__body"><${WorkspacePageComp} context=${context} /></main>
        <${CreateTaskDialogComp} context=${context} />
        <${NoticesComp} context=${context} />
        <${FooterBreadcrumbComp} context=${context} />
    </div>`;
}

function startApp() {
    PrototypeWorld.seed();
    const store = new CentralStore(AppCentralStoreData.create());
    const load = new PrototypeLoadService(store);
    const notices = new NoticeService(store);
    const navigation = new NavigationService(store, load);
    const selection = new SelectionService(store);
    const task = new TaskService(store, navigation, selection, notices, load);
    const services = {
        load, notices, navigation, selection, task,
        newTask: new NewTaskService(store, navigation, task, notices, load),
        note: new NoteService(store, navigation, task, notices, load),
        voiceTypo: new VoiceTypoService(),
        topic: new TopicService(notices),
        layout: new LayoutService(store),
        settings: new SettingsService(store),
    };
    const context = { store, services };
    ReactDOM.createRoot(document.getElementById('root')).render(html`<${AppRootComp} context=${context} />`);
    load.start();
}

startApp();
