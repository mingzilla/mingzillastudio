// The one place that names every StoreData / EditorData class of the app.
class AppCentralStoreData {
    static create() {
        return CentralStoreData.create({
            groupStoreData: new GroupStoreData(),
            itemStoreData: new ItemStoreData(),
            taskStoreData: new TaskStoreData(),
            voiceTypoStoreData: new VoiceTypoStoreData(),
            topicStoreData: new TopicStoreData(),
            inboxStoreData: new InboxStoreData(),
            userPreferenceStoreData: new UserPreferenceStoreData(),
            workspaceStoreData: new WorkspaceStoreData(),
            taskEditorDataEntries: new TaskEditorDataEntries(),
            systemActiveItems: new SystemActiveItems(),
        });
    }
}
