export function ModuleOne({ getState }) {
    return {
        doSmth() {
            return `YO: module One: I\' deep in=${getState().depth}`;
        },
    };
}
