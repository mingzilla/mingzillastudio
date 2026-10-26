class NoticesGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.systemActiveItems];
    }

    static fromDeps([systemActiveItems], params) {
        return new NoticesGuard({ notices: systemActiveItems.notices });
    }
}
