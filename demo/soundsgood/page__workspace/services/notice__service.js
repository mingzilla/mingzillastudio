class NoticeService {
    constructor(store) {
        this.store = store;
    }

    info(message) {
        this.add('info', message, '');
    }

    error(message, detail = '') {
        this.add('error', message, detail);
    }

    add(kind, message, detail) {
        const id = PrototypeWorld.nextId('notice');
        const notices = [...this.store.current.systemActiveItems.notices, { id, kind, message, detail, temporary: kind === 'info' }];
        this.store.patch('systemActiveItems', { notices });
    }

    dismiss(id) {
        this.store.patch('systemActiveItems', { notices: this.store.current.systemActiveItems.notices.filter((notice) => notice.id !== id) });
    }
}
