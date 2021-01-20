class FlyByWire extends NavSystem {
    constructor() {
        super();
        this.initDuration = 100;
    }
    get IsGlassCockpit() { return true; }
    get templateID() { return "FlyByWire"; }
    connectedCallback() {
        super.connectedCallback();
		Include.addScript("/JS/debug.js", function () {
			g_modDebugMgr.AddConsole(null);
		});
        SimVar.SetSimVarValue(
			"L:XMLVAR_EBD_FBW_PITCH_STAT", 
			"Boolean", 
			1
		);
		//SimVar.SetSimVarValue("A:USER INPUT ENABLED", "Boolean", 0);
        //SimVar.SetSimVarValue("K:AXIS_ELEVATOR_SET", "Bool", 0);
        //SimVar.SetSimVarValue("A:ELEVATOR TRIM POSITION", "Degrees", 1);
        this.maxUpdateBudget = 1;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    parseXMLConfig() {
        super.parseXMLConfig();
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        //SimVar.SetSimVarValue("A:ELEVATOR TRIM POSITION", "Degrees", 1);
    }
    reboot() {
        super.reboot();
    }
}
registerInstrument("flybywire-element", FlyByWire);
//# sourceMappingURL=FlyByWire.js.map