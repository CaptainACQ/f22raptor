class PMFD extends NavSystem {
    constructor() {
        super();
        this.handleReversionaryMode = false;
        this.initDuration = 7000;
    }
    get IsGlassCockpit() { return true; }
    get templateID() { return "PMFD"; }
    connectedCallback() {
        super.connectedCallback();
        this.mainPage = new PMFD_MainPage();
        this.pageGroups = [
            new NavSystemPageGroup("Main", this, [
                this.mainPage
            ]),
        ];
        this.warnings = new PFD_Warnings();
        this.addIndependentElementContainer(new NavSystemElementContainer("WindData", "WindData", new PFD_WindData()));
        this.addIndependentElementContainer(new NavSystemElementContainer("Warnings", "Warnings", this.warnings));
        this.addIndependentElementContainer(new NavSystemElementContainer("SoftKeys", "SoftKeys", new SoftKeys(PMFD_SoftKeyHtmlElement)));
        this.maxUpdateBudget = 12;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    parseXMLConfig() {
        super.parseXMLConfig();
        let syntheticVision = null;
        let reversionaryMode = null;
        if (this.instrumentXmlConfig) {
            syntheticVision = this.instrumentXmlConfig.getElementsByTagName("SyntheticVision")[0];
            reversionaryMode = this.instrumentXmlConfig.getElementsByTagName("ReversionaryMode")[0];
        }
        if (!syntheticVision || syntheticVision.textContent == "True") {
            if (this.mainPage.attitude.svg) {
                this.mainPage.attitude.svg.setAttribute("background", "false");
            }
            this.getChildById("SyntheticVision").style.display = "block";
            this.mainPage.syntheticVision = true;
        }
        else {
            if (this.mainPage.attitude.svg) {
                this.mainPage.attitude.svg.setAttribute("background", "true");
            }
            this.getChildById("SyntheticVision").style.display = "none";
            this.mainPage.syntheticVision = false;
        }
        if (reversionaryMode && reversionaryMode.textContent == "True") {
            this.handleReversionaryMode = true;
        }
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        if (this.handleReversionaryMode) {
            this.reversionaryMode = false;
            if (document.body.hasAttribute("reversionary")) {
                var attr = document.body.getAttribute("reversionary");
                if (attr == "true") {
                    this.reversionaryMode = true;
                }
            }
        }
    }
    reboot() {
        super.reboot();
        if (this.warnings)
            this.warnings.reset();
        if (this.mainPage)
            this.mainPage.reset();
    }
}
class PMFD_SoftKeyElement extends SoftKeyElement {
    constructor(_name = "", _callback = null, _statusCB = null, _valueCB = null) {
        super(_name, _callback);
        this.statusBarCallback = _statusCB;
        this.valueCallback = _valueCB;
    }
}
class PMFD_SoftKeyHtmlElement extends SoftKeyHtmlElement {
    constructor(_elem) {
        super(_elem);
        this.Element = _elem.getElementsByClassName("Title")[0];
        this.ValueElement = _elem.getElementsByClassName("Value")[0];
        this.StatusBar = _elem.getElementsByClassName("Status")[0];
    }
    fillFromElement(_elem) {
        super.fillFromElement(_elem);
        if (_elem.statusBarCallback == null) {
            Avionics.Utils.diffAndSetAttribute(this.StatusBar, "state", "None");
        }
        else {
            if (_elem.statusBarCallback()) {
                Avionics.Utils.diffAndSetAttribute(this.StatusBar, "state", "Active");
            }
            else {
                Avionics.Utils.diffAndSetAttribute(this.StatusBar, "state", "Inactive");
            }
        }
        if (_elem.valueCallback == null) {
            Avionics.Utils.diffAndSet(this.ValueElement, "");
        }
        else {
            Avionics.Utils.diffAndSet(this.ValueElement, _elem.valueCallback());
        }
    }
}
class PMFD_MainPage extends NavSystemPage {
    constructor() {
        super("Main", "Mainframe", new PMFD_MainElement());
        this.syntheticVision = false;
        this.rootMenu = new SoftKeysMenu();
        this.pfdMenu = new SoftKeysMenu();
        this.otherPfdMenu = new SoftKeysMenu();
        this.windMenu = new SoftKeysMenu();
        this.annunciations = new PFD_Annunciations();
        this.attitude = new PFD_Attitude();
        this.mapInstrument = new MapInstrumentElement();
        this.aoaIndicator = new PMFD_AngleOfAttackIndicator();
		this.pfd_airspeed = new PFD_Airspeed();
		this.pfd_airspeed.alwaysDisplaySpeed = true;
        this.element = new NavSystemElementGroup([
            this.attitude,
            this.pfd_airspeed,
            new PFD_Altimeter(),
            this.annunciations,
            new PFD_Compass(),
            new PFD_NavStatus(),
            new PMFD_BottomInfos(),
            new PMFD_ActiveCom(),
            new PMFD_ActiveNav(),
            new PMFD_NavStatus(),
            this.aoaIndicator,
            this.mapInstrument,
            new PFD_AutopilotDisplay(),
            new PFD_Minimums(),
            new PFD_RadarAltitude(),
            new PFD_MarkerBeacon()
        ]);
    }
    init() {
        super.init();
		//console.log("InstrumendID: " + this.gps.instrumentIdentifier);
        this.hsi = this.gps.getChildById("Compass");
        this.wind = this.gps.getChildById("WindData");
        this.mapInstrument.setGPS(this.gps);
        if (this.syntheticVision) {
            this.attitude.svg.setAttribute("background", "false");
        }
        else {
            this.attitude.svg.setAttribute("background", "true");
        }
        this.rootMenu.elements = [
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
			
            new PMFD_SoftKeyElement("Active&nbsp;NAV", this.gps.computeEvent.bind(this.gps, "SoftKey_CDI"), null, this.navStatus.bind(this)),
            new PMFD_SoftKeyElement("Traffic Inset", null, this.constElement.bind(this, false)),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement("PFD Settings", this.switchToMenu.bind(this, this.pfdMenu))
        ];
        this.pfdMenu.elements = [
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
			
            new PMFD_SoftKeyElement("PFD Mode", null, null, this.constElement.bind(this, "FULL")),
            new PMFD_SoftKeyElement("Other PFD Settings", this.switchToMenu.bind(this, this.otherPfdMenu)),
            new PMFD_SoftKeyElement("Bearing 1", this.gps.computeEvent.bind(this.gps, "SoftKeys_PFD_BRG1"), null, this.bearing1Status.bind(this)),
            new PMFD_SoftKeyElement("Bearing 2", this.gps.computeEvent.bind(this.gps, "SoftKeys_PFD_BRG2"), null, this.bearing2Status.bind(this)),
            new PMFD_SoftKeyElement("Back", this.switchToMenu.bind(this, this.rootMenu))
        ];
        this.otherPfdMenu.elements = [
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
			
            new PMFD_SoftKeyElement("Wind", this.switchToMenu.bind(this, this.windMenu)),
            new PMFD_SoftKeyElement("AOA", this.gps.computeEvent.bind(this.gps, "SoftKey_PFD_AoAMode"), null, this.aoaStatus.bind(this)),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement("COM1 121.5", null, this.constElement.bind(this, false)),
            new PMFD_SoftKeyElement("Back", this.switchToMenu.bind(this, this.rootMenu))
        ];
        this.windMenu.elements = [
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
            new PMFD_SoftKeyElement(""),
			
            new PMFD_SoftKeyElement("Off", this.gps.computeEvent.bind(this.gps, "SoftKeys_Wind_Off"), this.windModeCompare.bind(this, "0")),
            new PMFD_SoftKeyElement("Option 1", this.gps.computeEvent.bind(this.gps, "SoftKeys_Wind_O1"), this.windModeCompare.bind(this, "1")),
            new PMFD_SoftKeyElement("Option 2", this.gps.computeEvent.bind(this.gps, "SoftKeys_Wind_O2"), this.windModeCompare.bind(this, "2")),
            new PMFD_SoftKeyElement("Option 3", this.gps.computeEvent.bind(this.gps, "SoftKeys_Wind_O3"), this.windModeCompare.bind(this, "3")),
            new PMFD_SoftKeyElement("Back", this.switchToMenu.bind(this, this.otherPfdMenu))
        ];
        this.softKeys = this.rootMenu;
    }
    reset() {
        if (this.annunciations)
            this.annunciations.reset();
    }
    switchToMenu(_menu) {
        this.softKeys = _menu;
    }
    constElement(_elem) {
        return _elem;
    }
    bearing1Status() {
        if (this.hsi && this.hsi.getAttribute("show_bearing1") == "true") {
            return this.hsi.getAttribute("bearing1_source");
        }
        else {
            return "OFF";
        }
    }
    bearing2Status() {
        if (this.hsi && this.hsi.getAttribute("show_bearing2") == "true") {
            return this.hsi.getAttribute("bearing2_source");
        }
        else {
            return "OFF";
        }
    }
    navStatus() {
        return this.hsi.getAttribute("nav_source");
    }
    windModeCompare(_comparison) {
        return this.wind.getAttribute("wind-mode") == _comparison;
    }
    aoaStatus() {
        switch (this.aoaIndicator.AoaMode) {
            case 0:
                return "OFF";
                break;
            case 1:
                return "ON";
                break;
            case 2:
                return "AUTO";
                break;
        }
    }
}
class PMFD_MainElement extends NavSystemElement {
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
class PMFD_Compass extends PFD_Compass {
    onEvent(_event) {
        super.onEvent(_event);
    }
}
class PMFD_BottomInfos extends NavSystemElement {
    init(root) {
        this.tas = this.gps.getChildById("TAS_Value");
        this.oat = this.gps.getChildById("OAT_Value");
        this.gs = this.gps.getChildById("GS_Value");
        this.isa = this.gps.getChildById("ISA_Value");
        this.timer = this.gps.getChildById("TMR_Value");
        this.utcTime = this.gps.getChildById("UTC_Value");
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        Avionics.Utils.diffAndSet(this.tas, fastToFixed(Simplane.getTrueSpeed(), 0) + "KT");
        Avionics.Utils.diffAndSet(this.oat, fastToFixed(SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius"), 0) + "°C");
        Avionics.Utils.diffAndSet(this.gs, fastToFixed(SimVar.GetSimVarValue("GPS GROUND SPEED", "knots"), 0) + "KT");
        Avionics.Utils.diffAndSet(this.isa, fastToFixed(SimVar.GetSimVarValue("STANDARD ATM TEMPERATURE", "celsius"), 0) + "°C");
        Avionics.Utils.diffAndSet(this.utcTime, Utils.SecondsToDisplayTime(SimVar.GetGlobalVarValue("ZULU TIME", "seconds"), true, true, false));
        Avionics.Utils.diffAndSet(this.timer, Utils.SecondsToDisplayTime(SimVar.GetSimVarValue("L:AS3000_" + this.gps.urlConfig.index + "_Timer_Value", "number") / 1000, true, true, false));
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class PMFD_ActiveCom extends NavSystemElement {
    init(root) {
        this.activeCom = this.gps.getChildById("ActiveCom");
        this.activeComFreq = this.gps.getChildById("ActiveComFreq");
        this.activeComName = this.gps.getChildById("ActiveComName");
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        Avionics.Utils.diffAndSet(this.activeComFreq, this.gps.frequencyFormat(SimVar.GetSimVarValue("COM ACTIVE FREQUENCY:1", "MHz"), SimVar.GetSimVarValue("COM SPACING MODE:1", "Enum") == 0 ? 2 : 3));
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class PMFD_ActiveNav extends NavSystemElement {
    init(root) {
        this.NavInfos = this.gps.getChildById("NavFreqInfos");
        this.ActiveNav = this.gps.getChildById("ActiveNav");
        this.ActiveNavFreq = this.gps.getChildById("ActiveNavFreq");
        this.ActiveNavName = this.gps.getChildById("ActiveNavName");
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        if (!SimVar.GetSimVarValue("GPS DRIVES NAV1", "Boolean")) {
            Avionics.Utils.diffAndSetAttribute(this.NavInfos, "state", "Visible");
            let index = SimVar.GetSimVarValue("AUTOPILOT NAV SELECTED", "number");
            Avionics.Utils.diffAndSet(this.ActiveNav, "NAV" + index);
            Avionics.Utils.diffAndSet(this.ActiveNavFreq, this.gps.frequencyFormat(SimVar.GetSimVarValue("NAV ACTIVE FREQUENCY:" + index, "MHz"), 2));
            Avionics.Utils.diffAndSet(this.ActiveNavName, SimVar.GetSimVarValue("NAV SIGNAL:" + index, "number") > 0 ? SimVar.GetSimVarValue("NAV IDENT:" + index, "string") : "");
        }
        else {
            Avionics.Utils.diffAndSetAttribute(this.NavInfos, "state", "Inactive");
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class PMFD_NavStatus extends PFD_NavStatus {
    init(root) {
        this.currentLegFrom = this.gps.getChildById("FromWP");
        this.currentLegSymbol = this.gps.getChildById("LegSymbol");
        this.currentLegTo = this.gps.getChildById("ToWP");
        this.currentLegDistance = this.gps.getChildById("DisValue");
        this.currentLegBearing = this.gps.getChildById("BrgValue");
    }
}
class PMFD_AngleOfAttackIndicator extends NavSystemElement {
    constructor() {
        super(...arguments);
        this.AoaMode = 1;
    }
    init(root) {
        this.AoaElement = this.gps.getChildById("AoA");
        SimVar.SetSimVarValue("L:Glasscockpit_AOA_Mode", "number", this.AoaMode);
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        this.AoaElement.setAttribute("aoa", Math.min(Math.max(Simplane.getAngleOfAttack(), 0), 16).toString());
    }
    onExit() {
    }
    onEvent(_event) {
        if (_event == "SoftKey_PFD_AoAMode") {
            this.AoaMode = ((this.AoaMode + 1) % 3);
        }
        switch (_event) {
            case "AOA_Off":
                this.AoaMode = 0;
                break;
            case "AOA_On":
                this.AoaMode = 1;
                break;
            case "AOA_Auto":
                this.AoaMode = 2;
                break;
        }
        if (this.AoaMode == 0) {
            this.AoaElement.style.display = "none";
        }
        else {
            this.AoaElement.style.display = "block";
        }
        SimVar.SetSimVarValue("L:Glasscockpit_AOA_Mode", "number", this.AoaMode);
    }
}
registerInstrument("pmfd-element", PMFD);
//# sourceMappingURL=PMFD.js.map
