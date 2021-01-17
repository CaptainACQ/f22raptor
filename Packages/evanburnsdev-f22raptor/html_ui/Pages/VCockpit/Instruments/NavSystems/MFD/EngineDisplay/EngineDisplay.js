class MFD_PistonEngine extends TemplateElement {
    constructor() {
        super();
    }
    get templateID() { return "PistonEngineTemplate"; }
    connectedCallback() {
        super.connectedCallback();
    }
}
customElements.define("mfd-piston-engine", MFD_PistonEngine);
class MFD_TurboEngine extends TemplateElement {
    constructor() {
        super();
    }
    get templateID() { return "TurboEngineTemplate"; }
    connectedCallback() {
        super.connectedCallback();
    }
}
customElements.define("mfd-turbo-engine", MFD_TurboEngine);
class MFD_EngineDisplay extends TemplateElement {
    constructor() {
        super();
    }
    get templateID() { return "EngineDisplayTemplate"; }
    connectedCallback() {
        super.connectedCallback();
    }
}
customElements.define("smfd-engine-display", MFD_EngineDisplay);
//# sourceMappingURL=EngineDisplay.js.map