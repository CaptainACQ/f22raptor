class HUD extends NavSystem {
    constructor() {
        super();
        this.initDuration = 100;
    }
    get IsGlassCockpit() { return true; }
    get templateID() { return "HUD"; }
    connectedCallback() {
        super.connectedCallback();

        this.mainPage = new HUD_MainPage();
        this.pageGroups = [
            new NavSystemPageGroup("Main", this, [
                this.mainPage
            ]),
        ];
        this.maxUpdateBudget = 12;
        onQualityChanged(Quality.ultra);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }    
    CanUpdate() {
        super.CanUpdate();
        var quality = Quality.ultra;
        if (quality == Quality.ultra) {
            return true;
        }
        else if (quality == Quality.high) {
            if ((this.frameCount % 2) != 0) {
                return false;
            }
        }
        else if (quality == Quality.medium) {
            if ((this.frameCount % 4) != 0) {
                return false;
            }
        }
        else if (quality == Quality.low) {
            if ((this.frameCount % 32) != 0) {
                return false;
            }
        }
        else if (quality == Quality.hidden) {
            if ((this.frameCount % 128) != 0) {
                return false;
            }
        }
        else if (quality == Quality.disabled) {
            return false;
        }
        return true;
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
        this.attitude = new HUD_Attitude();
        this.element = new NavSystemElementGroup([
            this.attitude,
			new HUD_Heading(),
            new HUD_Airspeed(),
            new HUD_Altimeter(),
            new HUD_RadarAltitude()
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
class HUD_Heading extends NavSystemElement {
    constructor() {
        super(...arguments);
    }
    init(root) {
        this.svg = this.gps.getChildById("Heading");
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var heading = SimVar.GetSimVarValue("PLANE HEADING DEGREES TRUE", "degree");
        if (heading) {
            this.svg.setAttribute("heading", heading.toString());
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class HUD_Attitude extends NavSystemElement {
    constructor() {
        super(...arguments);
    }
    init(root) {
        this.svg = this.gps.getChildById("Horizon");
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var xyz = Simplane.getOrientationAxis();
        if (xyz) {
            this.svg.setAttribute("pitch", (xyz.pitch / Math.PI * 180).toString());
            this.svg.setAttribute("bank", (xyz.bank / Math.PI * 180).toString());
            this.svg.setAttribute("slip_skid", Simplane.getInclinometer().toString());
            this.svg.setAttribute("aoa", Simplane.getAngleOfAttack().toString());
            this.svg.setAttribute("flight_director-active", SimVar.GetSimVarValue("AUTOPILOT FLIGHT DIRECTOR ACTIVE", "Bool") ? "true" : "false");
            this.svg.setAttribute("flight_director-pitch", SimVar.GetSimVarValue("AUTOPILOT FLIGHT DIRECTOR PITCH", "degree"));
            this.svg.setAttribute("flight_director-bank", SimVar.GetSimVarValue("AUTOPILOT FLIGHT DIRECTOR BANK", "degree"));
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class HUD_Airspeed extends NavSystemElement {
    constructor() {
        super();
        this.lastIndicatedSpeed = -10000;
        this.lastMachSpeed = -10000;
        this.acceleration = 0;
        this.lastSpeed = null;
        this.alwaysDisplaySpeed = false;
    }
    init(root) {
        this.airspeedElement = this.gps.getChildById("Airspeed");
        var cockpitSettings = SimVar.GetGameVarValue("", "GlassCockpitSettings");
        if (cockpitSettings && cockpitSettings.AirSpeed.Initialized) {
            this.airspeedElement.setAttribute("min-speed", cockpitSettings.AirSpeed.lowLimit.toString());
            this.airspeedElement.setAttribute("green-begin", cockpitSettings.AirSpeed.greenStart.toString());
            this.airspeedElement.setAttribute("green-end", cockpitSettings.AirSpeed.greenEnd.toString());
            this.airspeedElement.setAttribute("flaps-begin", cockpitSettings.AirSpeed.whiteStart.toString());
            this.airspeedElement.setAttribute("flaps-end", cockpitSettings.AirSpeed.whiteEnd.toString());
            this.airspeedElement.setAttribute("yellow-begin", cockpitSettings.AirSpeed.yellowStart.toString());
            this.airspeedElement.setAttribute("yellow-end", cockpitSettings.AirSpeed.yellowEnd.toString());
            this.airspeedElement.setAttribute("red-begin", cockpitSettings.AirSpeed.redStart.toString());
            this.airspeedElement.setAttribute("red-end", cockpitSettings.AirSpeed.redEnd.toString());
            this.airspeedElement.setAttribute("max-speed", cockpitSettings.AirSpeed.highLimit.toString());
            this.maxSpeed = cockpitSettings.AirSpeed.highLimit;
        }
        else {
            var designSpeeds = Simplane.getDesignSpeeds();
            this.airspeedElement.setAttribute("green-begin", designSpeeds.VS1.toString());
            this.airspeedElement.setAttribute("green-end", designSpeeds.VNo.toString());
            this.airspeedElement.setAttribute("flaps-begin", designSpeeds.VS0.toString());
            this.airspeedElement.setAttribute("flaps-end", designSpeeds.VFe.toString());
            this.airspeedElement.setAttribute("yellow-begin", designSpeeds.VNo.toString());
            this.airspeedElement.setAttribute("yellow-end", designSpeeds.VNe.toString());
            this.airspeedElement.setAttribute("red-begin", designSpeeds.VNe.toString());
            this.airspeedElement.setAttribute("red-end", designSpeeds.VMax.toString());
            this.airspeedElement.setAttribute("max-speed", designSpeeds.VNe.toString());
            this.maxSpeed = designSpeeds.VNe;
        }
        if (this.gps.instrumentXmlConfig) {
            let autoThrottleElem = this.gps.instrumentXmlConfig.getElementsByTagName("AutoThrottle");
            if (autoThrottleElem.length > 0) {
                this.alwaysDisplaySpeed = autoThrottleElem[0].textContent == "True";
            }
        }
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var indicatedSpeed = Simplane.getIndicatedSpeed();
        if (indicatedSpeed != this.lastIndicatedSpeed) {
            this.airspeedElement.setAttribute("airspeed", indicatedSpeed.toFixed(1));
            this.lastIndicatedSpeed = indicatedSpeed;
        }
        var machSpeed = Simplane.getMachSpeed();
        if (machSpeed != this.lastMachSpeed) {
            this.airspeedElement.setAttribute("mach-airspeed", machSpeed.toFixed(3));
            this.lastMachSpeed = machSpeed;
        }
        this.airspeedElement.setAttribute("display-ref-speed", "False");
        if (this.acceleration == NaN) {
            this.acceleration = 0;
        }
        if (this.lastSpeed == null) {
            this.lastSpeed = indicatedSpeed;
        }
        let instantAcceleration;
        if (indicatedSpeed < 20) {
            instantAcceleration = 0;
            this.acceleration = 0;
        }
        else {
            instantAcceleration = (indicatedSpeed - this.lastSpeed) / (_deltaTime / 1000);
        }
        let smoothFactor = 2000;
        this.acceleration = ((Math.max((smoothFactor - _deltaTime), 0) * this.acceleration) + (Math.min(_deltaTime, smoothFactor) * instantAcceleration)) / smoothFactor;
        this.lastSpeed = indicatedSpeed;
        this.airspeedElement.setAttribute("airspeed-trend", (this.acceleration).toString());
        let crossSpeed = SimVar.GetGameVarValue("AIRCRAFT CROSSOVER SPEED", "Knots");
        let cruiseMach = SimVar.GetSimVarValue("MACH MAX OPERATE", "mach");
        let crossSpeedFactor = Simplane.getCrossoverSpeedFactor(this.maxSpeed, cruiseMach);
        if (crossSpeed != 0) {
            this.airspeedElement.setAttribute("max-speed", (Math.min(crossSpeedFactor, 1) * this.maxSpeed).toString());
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class HUD_Altimeter extends NavSystemElement {
    constructor() {
        super(...arguments);
        this.lastAltitude = -10000;
        this.lastSelectedAltitude = -10000;
        this.selectedAltWasCaptured = false;
        this.blinkTime = 0;
        this.alertState = 0;
        this.altimeterIndex = 0;
        this.readyToSet = false;
    }
    init(root) {
        this.altimeterElement = this.gps.getChildById("Altimeter");
        if (this.gps.instrumentXmlConfig) {
            let altimeterIndexElems = this.gps.instrumentXmlConfig.getElementsByTagName("AltimeterIndex");
            if (altimeterIndexElems.length > 0) {
                this.altimeterIndex = parseInt(altimeterIndexElems[0].textContent) + 1;
            }
        }
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var altitude = SimVar.GetSimVarValue("INDICATED ALTITUDE:" + this.altimeterIndex, "feet");
        var selectedAltitude = SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR", "feet");
        if (altitude != this.lastAltitude) {
            this.altimeterElement.setAttribute("Altitude", altitude.toFixed(1));
            this.lastAltitude = altitude;
        }
        this.altimeterElement.setAttribute("vspeed", fastToFixed(Simplane.getVerticalSpeed(), 1));
        let cdiSource = SimVar.GetSimVarValue("GPS DRIVES NAV1", "Bool") ? 3 : SimVar.GetSimVarValue("AUTOPILOT NAV SELECTED", "Number");
        switch (cdiSource) {
            case 1:
                if (SimVar.GetSimVarValue("NAV HAS GLIDE SLOPE:1", "Bool")) {
                    this.altimeterElement.setAttribute("vertical-deviation-mode", "GS");
                    this.altimeterElement.setAttribute("vertical-deviation-value", (SimVar.GetSimVarValue("NAV GSI:1", "number") / 127.0).toString());
                }
                else {
                    this.altimeterElement.setAttribute("vertical-deviation-mode", "None");
                }
                break;
            case 2:
                if (SimVar.GetSimVarValue("NAV HAS GLIDE SLOPE:2", "Bool")) {
                    this.altimeterElement.setAttribute("vertical-deviation-mode", "GS");
                    this.altimeterElement.setAttribute("vertical-deviation-value", (SimVar.GetSimVarValue("NAV GSI:2", "number") / 127.0).toString());
                }
                else {
                    this.altimeterElement.setAttribute("vertical-deviation-mode", "None");
                }
                break;
            case 3:
                if (this.gps.currFlightPlanManager.isActiveApproach() && Simplane.getAutoPilotApproachType() == 10) {
                    this.altimeterElement.setAttribute("vertical-deviation-mode", "GP");
                    this.altimeterElement.setAttribute("vertical-deviation-value", (SimVar.GetSimVarValue("GPS VERTICAL ERROR", "meters") / 150).toString());
                }
                else if (SimVar.GetSimVarValue("NAV HAS GLIDE SLOPE:1", "Bool")) {
                    this.altimeterElement.setAttribute("vertical-deviation-mode", "GSPreview");
                    this.altimeterElement.setAttribute("vertical-deviation-value", (SimVar.GetSimVarValue("NAV GSI:1", "number") / 127.0).toString());
                }
                else {
                    if (SimVar.GetSimVarValue("NAV HAS GLIDE SLOPE:2", "Bool")) {
                        this.altimeterElement.setAttribute("vertical-deviation-mode", "GSPreview");
                        this.altimeterElement.setAttribute("vertical-deviation-value", (SimVar.GetSimVarValue("NAV GSI:2", "number") / 127.0).toString());
                    }
                    else {
                        this.altimeterElement.setAttribute("vertical-deviation-mode", "None");
                    }
                }
                break;
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class HUD_RadarAltitude extends NavSystemElement {
    constructor() {
        super(...arguments);
        this.isActive = false;
    }
    init(root) {
        this.window = this.gps.getChildById("RadarAltitude");
        this.altimeter = this.gps.getChildById("Altimeter");
        this.value = this.gps.getChildById("RA_Value");
        if (this.gps.instrumentXmlConfig) {
            let raElem = this.gps.instrumentXmlConfig.getElementsByTagName("RadarAltitude");
            if (raElem.length > 0) {
                this.isActive = raElem[0].textContent == "True";
            }
        }
        if (!this.isActive) {
            this.window.setAttribute("display", "none");
        }
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        if (!this.isActive) {
            return;
        }
        var xyz = Simplane.getOrientationAxis();
        let radarAltitude = SimVar.GetSimVarValue("RADIO HEIGHT", "feet");
        if (radarAltitude > 0 && radarAltitude < 2500 && (Math.abs(xyz.bank) < Math.PI * 0.35)) {
            Avionics.Utils.diffAndSetAttribute(this.altimeter, "radar-altitude", radarAltitude);
            Avionics.Utils.diffAndSet(this.value, fastToFixed(radarAltitude, 0));
            Avionics.Utils.diffAndSetAttribute(this.window, "state", "Active");
        }
        else {
            Avionics.Utils.diffAndSetAttribute(this.altimeter, "radar-altitude", "1000");
            Avionics.Utils.diffAndSetAttribute(this.window, "state", "Inactive");
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
registerInstrument("hud-element", HUD);
//# sourceMappingURL=HUD.js.map
