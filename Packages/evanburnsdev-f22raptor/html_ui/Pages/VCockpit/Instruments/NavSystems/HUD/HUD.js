class HUD extends NavSystem {
    constructor() {
        super();
        this.initDuration = 100;
    }
    get IsGlassCockpit() { return true; }
    get templateID() { return "HUD"; }
    connectedCallback() {
        super.connectedCallback();
		/*
		Include.addScript("/JS/debug.js", function () {
			g_modDebugMgr.AddConsole(null);
		});
		*/
        this.mainPage = new HUD_MainPage();
        this.pageGroups = [
            new NavSystemPageGroup("Main", this, [
                this.mainPage
            ]),
        ];
        this.maxUpdateBudget = 12;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    parseXMLConfig() {
        super.parseXMLConfig();
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
    }
    reboot() {
        super.reboot();
        if (this.mainPage)
            this.mainPage.reset();
    }
}
class HUD_MainPage extends NavSystemPage {
    constructor() {
        super("Main", "Mainframe", new HUD_MainElement());
        this.attitude = new PFD_Attitude();
        this.element = new NavSystemElementGroup([
            this.attitude,
            new PFD_Airspeed(),
            new PFD_Altimeter(),
            new PFD_Minimums(),
            new PFD_RadarAltitude()
        ]);
    }
    init() {
        super.init();
    }
    reset() {
    }
    constElement(_elem) {
        return _elem;
    }
}
class HUD_MainElement extends NavSystemElement {
    init(root) {
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
registerInstrument("hud-element", HUD);
//# sourceMappingURL=HUD.js.map