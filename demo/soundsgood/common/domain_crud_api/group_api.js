// The only place the frontend asks for groups. Prototype: answers from the fake world. Real: http.
class GroupApi {
    static async list() {
        return PrototypeWorld.groups;
    }
}
