class SettingsService {
    constructor(store) {
        this.store = store;
    }

    async patch(changes) {
        this.store.patch('userPreferenceStoreData', changes);
        await PreferenceApi.save(this.store.current.userPreferenceStoreData);
    }
}
