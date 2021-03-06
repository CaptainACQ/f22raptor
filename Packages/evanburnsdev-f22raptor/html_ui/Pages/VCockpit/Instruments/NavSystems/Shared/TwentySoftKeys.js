class TwentySoftKeys extends NavSystemElement {
    constructor(_softKeyHTMLClass = SoftKeyHtmlElement) {
        super();
        this.softKeys = [];
        this.softKeyHTMLClass = _softKeyHTMLClass;
    }
    init(root) {
        for (var i = 1; i <= 20; i++) {
            var name = "Key" + i.toString();
            var child = this.gps.getChildById(name);
            if (child) {
                var e = new this.softKeyHTMLClass(child);
                this.softKeys.push(e);
            }
        }
        this.isInitialized = true;
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var currentPage = this.gps.getCurrentPage();
        if (currentPage) {
            this.currentMenu = currentPage.getSoftKeyMenu();
            if (this.currentMenu && this.currentMenu.elements && this.currentMenu.elements.length > 0) {
                for (var i = 0; i < this.currentMenu.elements.length; i++) {
                    this.softKeys[i].fillFromElement(this.currentMenu.elements[i]);
                }
            }
        }
    }
    onExit() {
    }
    onEvent(_event) {
		for(var i = 0; i < 20; i++)
		{
			if( _event == "SOFTKEYS_" + (i+1).toString() ) {
				this.activeSoftKey(i);
				break;
			}
		}
    }
    activeSoftKey(_number) {
        if (this.currentMenu.elements[_number].callback) {
            this.currentMenu.elements[_number].callback();
        }
    }
}
class CurrentSoftKeys extends NavSystemPage {
    constructor(_page = String) {
        super();
        this.page = _page;
        this.rootMenu = new SoftKeysMenu();
        this.pfdMenu = new SoftKeysMenu();
    }
    init(_gps) {
        super.init();
		this.gps = _gps;
        this.rootMenu.elements = [
            new SMFD_SoftKeyElement("Map Range-", this.gps.computeEvent.bind(this.gps, "RANGE_DEC")),
            new SMFD_SoftKeyElement("Map Range+", this.gps.computeEvent.bind(this.gps, "RANGE_INC")),
            new SMFD_SoftKeyElement("PFD Map Settings"),
            new SMFD_SoftKeyElement("Traffic Inset"),
            new SMFD_SoftKeyElement("PFD Settings", this.switchToMenu.bind(this, this.pfdMenu)),
            new SMFD_SoftKeyElement("OBS"),
            //new SMFD_SoftKeyElement("Active&nbsp;NAV", this.gps.computeEvent.bind(this.gps, "SoftKey_CDI"), null, this.navStatus.bind(this)),
            new SMFD_SoftKeyElement("Active\n&nbsp;NAV"),
            new SMFD_SoftKeyElement("Sensors"),
            new SMFD_SoftKeyElement("WX Radar Controls"),
            new SMFD_SoftKeyElement("")
        ];
        this.pfdMenu.elements = [
            new SMFD_SoftKeyElement("Attitude Overlays"),
            new SMFD_SoftKeyElement("PFD Mode"),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement("Bearing 1"),
            new SMFD_SoftKeyElement("Bearing 2"),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement("Other PFD Settings", this.switchToMenu.bind(this, this.otherPfdMenu)),
            new SMFD_SoftKeyElement("Back", this.switchToMenu.bind(this, this.rootMenu))
        ];
		/*
        this.otherPfdMenu.elements = [
            new SMFD_SoftKeyElement("Wind", this.switchToMenu.bind(this, this.windMenu)),
            new SMFD_SoftKeyElement("AOA", this.gps.computeEvent.bind(this.gps, "SoftKey_PFD_AoAMode"), null, this.aoaStatus.bind(this)),
            new SMFD_SoftKeyElement("Altitude Units"),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement("COM1 121.5", null, this.constElement.bind(this, false)),
            new SMFD_SoftKeyElement("Back", this.switchToMenu.bind(this, this.rootMenu)),
            new SMFD_SoftKeyElement("")
        ];
        this.windMenu.elements = [
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement("Option 1", this.gps.computeEvent.bind(this.gps, "SoftKeys_Wind_O1"), this.windModeCompare.bind(this, "1")),
            new SMFD_SoftKeyElement("Option 2", this.gps.computeEvent.bind(this.gps, "SoftKeys_Wind_O2"), this.windModeCompare.bind(this, "2")),
            new SMFD_SoftKeyElement("Option 3", this.gps.computeEvent.bind(this.gps, "SoftKeys_Wind_O3"), this.windModeCompare.bind(this, "3")),
            new SMFD_SoftKeyElement("Off", this.gps.computeEvent.bind(this.gps, "SoftKeys_Wind_Off"), this.windModeCompare.bind(this, "0")),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement(""),
            new SMFD_SoftKeyElement("Back", this.switchToMenu.bind(this, this.otherPfdMenu)),
            new SMFD_SoftKeyElement("")
        ];
		*/
        this.softKeys = this.rootMenu;
    }
    switchToMenu(_menu) {
        this.softKeys = _menu;
    }
    constElement(_elem) {
        return _elem;
    }
	get currentMenu() {
		return this.softKeys;
	}
}
class SMFD_SoftKeyElement extends SoftKeyElement {
    constructor(_name = "", _callback = null, _statusCB = null, _valueCB = null) {
        super(_name, _callback);
        this.statusBarCallback = _statusCB;
        this.valueCallback = _valueCB;
    }
}