class PreferenceApi {
    static async load() {
        return PrototypeWorld.preference;
    }

    static async save(preference) {
        PrototypeWorld.preference = preference;
        PrototypeWorld.summaryLaneCapacity = preference.summaryLaneCapacity;
    }
}
