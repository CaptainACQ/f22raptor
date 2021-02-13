class HudAttitudeIndicator extends HTMLElement {
    constructor() {
        super();
        //this.bankSizeRatio = -24;
        this.bankSizeRatio = -20;
        this.backgroundVisible = true;
        this.flightDirectorActive = false;
        this.flightDirectorPitch = 0;
        this.flightDirectorBank = 0;
        this.aspectRatio = 1.0;
        this.isBackup = false;
        this.horizonTopColor = "#00569d";
        this.horizonBottomColor = "#48432e";
    }
    static get observedAttributes() {
        return [
            "pitch",
            "bank",
            "slip_skid",
            "aoa",
            "background",
            "flight_director-active",
            "flight_director-pitch",
            "flight_director-bank",
            "bank_size_ratio",
            "aspect-ratio",
            "is-backup",
        ];
    }
    connectedCallback() {
        this.construct();
    }
    buildGraduations() {
        if (!this.attitude_pitch)
            return;
        this.attitude_pitch.innerHTML = "";
        let maxDash = 80;
        let fullPrecisionLowerLimit = -20;
        let fullPrecisionUpperLimit = 20;
        let halfPrecisionLowerLimit = -30;
        let halfPrecisionUpperLimit = 45;
        let unusualAttitudeLowerLimit = -30;
        let unusualAttitudeUpperLimit = 50;
        let bigWidth = 60;
        let bigHeight = 3;
        let mediumWidth = 30;
        let mediumHeight = 3;
        let smallWidth = 20;
        let smallHeight = 2;
        let fontSize = 20;
        let angle = -maxDash;
        let nextAngle;
        let width;
        let height;
        let text;
        while (angle <= maxDash) {
            if (angle % 10 == 0) {
                width = bigWidth;
                height = bigHeight;
                text = true;
                if (angle >= fullPrecisionLowerLimit && angle < fullPrecisionUpperLimit) {
                    nextAngle = angle + 2.5;
                }
                else if (angle >= halfPrecisionLowerLimit && angle < halfPrecisionUpperLimit) {
                    nextAngle = angle + 5;
                }
                else {
                    nextAngle = angle + 10;
                }
            }
            else {
                if (angle % 5 == 0) {
                    width = mediumWidth;
                    height = mediumHeight;
                    text = true;
                    if (angle >= fullPrecisionLowerLimit && angle < fullPrecisionUpperLimit) {
                        nextAngle = angle + 2.5;
                    }
                    else {
                        nextAngle = angle + 5;
                    }
                }
                else {
                    width = smallWidth;
                    height = smallHeight;
                    nextAngle = angle + 2.5;
                    text = false;
                }
            }
            if (angle != 0) {
                let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                rect.setAttribute("fill", "white");
                rect.setAttribute("x", (-width / 2).toString());
                rect.setAttribute("y", (this.bankSizeRatio * angle - height / 2).toString());
                rect.setAttribute("width", width.toString());
                rect.setAttribute("height", height.toString());
                this.attitude_pitch.appendChild(rect);
                if (text) {
                    let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                    leftText.textContent = Math.abs(angle).toString();
                    leftText.setAttribute("x", ((-width / 2) - 5).toString());
                    leftText.setAttribute("y", (this.bankSizeRatio * angle - height / 2 + fontSize / 2).toString());
                    leftText.setAttribute("text-anchor", "end");
                    leftText.setAttribute("font-size", fontSize.toString());
                    leftText.setAttribute("font-family", "Roboto-Bold");
                    leftText.setAttribute("fill", "white");
                    this.attitude_pitch.appendChild(leftText);
                    let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                    rightText.textContent = Math.abs(angle).toString();
                    rightText.setAttribute("x", ((width / 2) + 5).toString());
                    rightText.setAttribute("y", (this.bankSizeRatio * angle - height / 2 + fontSize / 2).toString());
                    rightText.setAttribute("text-anchor", "start");
                    rightText.setAttribute("font-size", fontSize.toString());
                    rightText.setAttribute("font-family", "Roboto-Bold");
                    rightText.setAttribute("fill", "white");
                    this.attitude_pitch.appendChild(rightText);
                }
                if (angle < unusualAttitudeLowerLimit) {
                    let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                    let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * nextAngle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                    path += "L" + bigWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 ";
                    path += "L0 " + (this.bankSizeRatio * nextAngle + 20) + " ";
                    path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                    chevron.setAttribute("d", path);
                    chevron.setAttribute("fill", "red");
                    this.attitude_pitch.appendChild(chevron);
                }
                if (angle >= unusualAttitudeUpperLimit && nextAngle <= maxDash) {
                    let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                    let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                    path += "L" + (bigWidth / 2) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 ";
                    path += "L0 " + (this.bankSizeRatio * angle - 20) + " ";
                    path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                    chevron.setAttribute("d", path);
                    chevron.setAttribute("fill", "red");
                    this.attitude_pitch.appendChild(chevron);
                }
            }
            angle = nextAngle;
        }
    }
    construct() {
        Utils.RemoveAllChildren(this);
        {
            this.horizon = document.createElementNS(Avionics.SVG.NS, "svg");
            this.horizon.setAttribute("width", "100%");
            this.horizon.setAttribute("height", "100%");
            this.horizon.setAttribute("viewBox", "-200 -200 400 300");
            this.horizon.setAttribute("x", "-100");
            this.horizon.setAttribute("y", "-100");
            this.horizon.setAttribute("overflow", "visible");
            this.horizon.setAttribute("style", "position:absolute; z-index: -2; width: 100%; height:100%;");
            this.appendChild(this.horizon);
            this.horizonTop = document.createElementNS(Avionics.SVG.NS, "rect");
            this.horizonTop.setAttribute("fill", (this.backgroundVisible) ? this.horizonTopColor : "transparent");
            this.horizonTop.setAttribute("x", "-1000");
            this.horizonTop.setAttribute("y", "-1000");
            this.horizonTop.setAttribute("width", "2000");
            this.horizonTop.setAttribute("height", "2000");
            this.horizon.appendChild(this.horizonTop);
            this.bottomPart = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon.appendChild(this.bottomPart);
            this.horizonBottom = document.createElementNS(Avionics.SVG.NS, "rect");
            this.horizonBottom.setAttribute("fill", (this.backgroundVisible) ? this.horizonBottomColor : "transparent");
            this.horizonBottom.setAttribute("x", "-1500");
            this.horizonBottom.setAttribute("y", "0");
            this.horizonBottom.setAttribute("width", "3000");
            this.horizonBottom.setAttribute("height", "3000");
            this.bottomPart.appendChild(this.horizonBottom);
            let separator = document.createElementNS(Avionics.SVG.NS, "rect");
            separator.setAttribute("fill", "#e0e0e0");
            separator.setAttribute("x", "-1500");
            separator.setAttribute("y", "-1");
            separator.setAttribute("width", "3000");
            separator.setAttribute("height", "2");
            this.bottomPart.appendChild(separator);
        }
        let attitudeContainer = document.createElement("div");
        attitudeContainer.setAttribute("id", "Attitude");
        attitudeContainer.style.width = "100%";
        attitudeContainer.style.height = "100%";
        attitudeContainer.style.position = "absolute";
        this.appendChild(attitudeContainer);
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "-200 -200 400 300");
        this.root.setAttribute("overflow", "visible");
        this.root.setAttribute("style", "position:absolute");
        attitudeContainer.appendChild(this.root);
        var refHeight = (this.isBackup) ? 330 : 230;
        let attitude_pitch_container = document.createElementNS(Avionics.SVG.NS, "svg");
        attitude_pitch_container.setAttribute("width", "230");
        attitude_pitch_container.setAttribute("height", refHeight.toString());
        attitude_pitch_container.setAttribute("x", "-115");
        attitude_pitch_container.setAttribute("y", "-130");
        attitude_pitch_container.setAttribute("viewBox", "-115 -130 230 " + refHeight.toString());
        attitude_pitch_container.setAttribute("overflow", "hidden");
        this.root.appendChild(attitude_pitch_container);
        this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
        attitude_pitch_container.appendChild(this.attitude_pitch);
        this.buildGraduations();
        this.flightDirector = document.createElementNS(Avionics.SVG.NS, "g");
        attitude_pitch_container.appendChild(this.flightDirector);
        let fdCursor = document.createElementNS(Avionics.SVG.NS, "path");
        fdCursor.setAttribute("d", "M 0 0 l 15 -10 h 20 v -4 h -20 l -15 10 l -15 -10 h -20 v 4 h 20 Z");
        fdCursor.setAttribute("fill", "#00ff00");
        this.flightDirector.appendChild(fdCursor);

        //let triangleOuterLeft = document.createElementNS(Avionics.SVG.NS, "path");
        //triangleOuterLeft.setAttribute("d", "M-70 15 l25 0 L0 0 Z");
        //triangleOuterLeft.setAttribute("fill", "#d12bc7");
        //this.flightDirector.appendChild(triangleOuterLeft);
        //let triangleOuterRight = document.createElementNS(Avionics.SVG.NS, "path");
        //triangleOuterRight.setAttribute("d", "M70 15 l-25 0 L0 0 Z");
        //triangleOuterRight.setAttribute("fill", "#d12bc7");
        //this.flightDirector.appendChild(triangleOuterRight);
        {
            let attitude_bank_container = document.createElementNS(Avionics.SVG.NS, "svg");
            attitude_bank_container.setAttribute("width", "230");
            attitude_bank_container.setAttribute("height", "230");
            attitude_bank_container.setAttribute("x", "-115");
            attitude_bank_container.setAttribute("y", "-245");
            attitude_bank_container.setAttribute("viewBox", "-100 -53 200 106");
            this.root.appendChild(attitude_bank_container);

            let clippath = document.createElementNS(Avionics.SVG.NS, "clipPath");
            clippath.setAttributeNS(null, "id", "clip");
            attitude_bank_container.appendChild(clippath);

            let cliprect = document.createElementNS(Avionics.SVG.NS, "rect");
            cliprect.setAttribute("x", "-31");
            cliprect.setAttribute("y", "-54");
            cliprect.setAttribute("width", "62");
            cliprect.setAttribute("height", "12");
            //cliprect.setAttribute("stroke", "#00ff00");
            //cliprect.setAttribute("stroke-width", "1");
            clippath.appendChild(cliprect);
            attitude_bank_container.setAttribute("clip-path", "url(#clip)");

            this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
            attitude_bank_container.appendChild(this.attitude_bank);
            let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
            topTriangle.setAttribute("d", "M0 -50 l-2 -3 l4 0 Z");
            topTriangle.setAttribute("stroke", "#00ff00");
            topTriangle.setAttribute("stroke-width", "1");
            this.attitude_bank.appendChild(topTriangle);

            let bottomTriangle = document.createElementNS(Avionics.SVG.NS, "path");
            bottomTriangle.setAttribute("d", "M 0 -50 l -2 3 l 4 0 Z");
            bottomTriangle.setAttribute("stroke", "#00ff00");
            bottomTriangle.setAttribute("stroke-width", "1");
            attitude_bank_container.appendChild(bottomTriangle);
            let bigDashes = [-60, -30, 30, 60];
            let smallDashes = [-45, -20, -10, 10, 20, 45];
            let radius = 50;
            let width = 1;
            let height = 6;
            for (let i = 0; i < bigDashes.length; i++) {
                let dash = document.createElementNS(Avionics.SVG.NS, "rect");
                dash.setAttribute("x", (-width / 2).toString());
                dash.setAttribute("y", (-radius - height).toString());
                dash.setAttribute("height", height.toString());
                dash.setAttribute("width", width.toString());
                dash.setAttribute("stroke", "#00ff00");
                dash.setAttribute("stroke-width", "1");
                dash.setAttribute("transform", "rotate(" + bigDashes[i] + ",0,0)");
                this.attitude_bank.appendChild(dash);
            }
            width = 1;
            height = 3;
            for (let i = 0; i < smallDashes.length; i++) {
                let dash = document.createElementNS(Avionics.SVG.NS, "rect");
                dash.setAttribute("x", (-width / 2).toString());
                dash.setAttribute("y", (-radius - height).toString());
                dash.setAttribute("height", height.toString());
                dash.setAttribute("width", width.toString());
                dash.setAttribute("fill", "#00ff00");
                dash.setAttribute("transform", "rotate(" + smallDashes[i] + ",0,0)");
                this.attitude_bank.appendChild(dash);
            }
        }
        {

            this.movableCursor = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(this.movableCursor);

            this.cursorCircle = document.createElementNS(Avionics.SVG.NS, "path");
            this.cursorCircle.setAttribute("d", "M -0 -10 A 10 10 0 1 1 -1 -10 Z");
            this.cursorCircle.setAttribute("fill", "none");
            this.cursorCircle.setAttribute("stroke", "#00ff00");
            this.cursorCircle.setAttribute("stroke-width", "2");
            this.movableCursor.appendChild(this.cursorCircle);
            let cursorLines = [-90, 0, 90];
            let radius = 10;
            let width = 1;
            let height = 15;
            for(let i = 0; i < cursorLines.length; i++){
                let dash = document.createElementNS(Avionics.SVG.NS, "rect");
                dash.setAttribute("x", (-width / 2).toString());
                dash.setAttribute("y", (-radius - height).toString());
                dash.setAttribute("height", height.toString());
                dash.setAttribute("width", width.toString());
                dash.setAttribute("fill", "#00ff00");
                dash.setAttribute("transform", "rotate(" + cursorLines[i] + ",0,0)");
                this.movableCursor.appendChild(dash);
            }
            let cursors = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(cursors);
            let centerCursor = document.createElementNS(Avionics.SVG.NS, "path");
            centerCursor.setAttribute("d", "M 0 0 l 15 -10 h 20 v 4 h -20 l -15 10 l -15 -10 h -20 v -4 h 20 Z");
            //centerCursor = setAttribute("d", "M-45 15 l15 0 L0 0 Z");
            //centerCursor.setAttribute("fill", "#00ff00");
            centerCursor.setAttribute("stroke", "#00ff00");
            centerCursor.setAttribute("stroke-width", "1");
            cursors.appendChild(centerCursor);
            //let triangleInnerLeft = document.createElementNS(Avionics.SVG.NS, "path");
            //triangleInnerLeft.setAttribute("d", "M-45 15 l15 0 L0 0 Z");
            //triangleInnerLeft.setAttribute("fill", "#00ff00");
            //cursors.appendChild(triangleInnerLeft);
            //let triangleInnerRight = document.createElementNS(Avionics.SVG.NS, "path");
            //triangleInnerRight.setAttribute("d", "M45 15 l-15 0 L0 0 Z");
            //triangleInnerRight.setAttribute("fill", "#00ff00");
            //cursors.appendChild(triangleInnerRight);
            this.slipSkid = document.createElementNS(Avionics.SVG.NS, "path");
            this.slipSkid.setAttribute("d", "M-20 -140 L-16 -146 L16 -146 L20 -140 Z");
            this.slipSkid.setAttribute("fill", "white");
            this.root.appendChild(this.slipSkid);
        }
        this.applyAttributes();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "is-backup":
                this.isBackup = newValue == "true";
                break;
            case "aspect-ratio":
                this.aspectRatio = parseFloat(newValue);
                this.construct();
                break;
            case "pitch":
                this.pitch = parseFloat(newValue);
                break;
            case "bank":
                this.bank = parseFloat(newValue);
                break;
            case "slip_skid":
                this.slipSkidValue = parseFloat(newValue);
                break;
            case "aoa":
                this.aoa = parseFloat(newValue);
                break;
            case "background":
                if (newValue == "false")
                    this.backgroundVisible = false;
                else
                    this.backgroundVisible = true;
                break;
            case "flight_director-active":
                this.flightDirectorActive = newValue == "true";
                break;
            case "flight_director-pitch":
                this.flightDirectorPitch = parseFloat(newValue);
                break;
            case "flight_director-bank":
                this.flightDirectorBank = parseFloat(newValue);
                break;
            case "bank_size_ratio":
                this.bankSizeRatio = parseFloat(newValue);
                this.buildGraduations();
                break;
            default:
                return;
        }
        this.applyAttributes();
    }
    applyAttributes() {
        if (this.bottomPart)
            this.bottomPart.setAttribute("transform", "rotate(" + this.bank + ", 0, 0) translate(0," + (this.pitch * this.bankSizeRatio) + ")");
        if (this.attitude_pitch)
            this.attitude_pitch.setAttribute("transform", "rotate(" + this.bank + ", 0, 0) translate(0," + (this.pitch * this.bankSizeRatio) + ")");
        if (this.attitude_bank)
            this.attitude_bank.setAttribute("transform", "rotate(" + this.bank + ", 0, 0)");
        //if (this.slipSkid)
            //this.slipSkid.setAttribute("transform", "translate(" + (this.slipSkidValue * 40) + ", 0)");
        //    this.movableCursor.setAttribute("transform", "translate(" + (this.slipSkidValue * 40) + " " + (-1 * this.aoa * this.bankSizeRatio) + ")");
        if (this.aoa){
            this.movableCursor.setAttribute("transform", "translate(" + (this.slipSkidValue * 40) + " " + (-1 * this.aoa * this.bankSizeRatio) + ")");
        }
        if (this.horizonTop) {
            if (this.backgroundVisible) {
                this.horizonTop.setAttribute("fill", this.horizonTopColor);
                this.horizonBottom.setAttribute("fill", this.horizonBottomColor);
            }
            else {
                this.horizonTop.setAttribute("fill", "transparent");
                this.horizonBottom.setAttribute("fill", "transparent");
            }
        }
        if (this.flightDirector) {
            if (this.flightDirectorActive) {
                this.flightDirector.setAttribute("transform", "rotate(" + (this.bank - this.flightDirectorBank) + ") translate(0 " + ((this.pitch - this.flightDirectorPitch) * this.bankSizeRatio) + ")");
                this.flightDirector.setAttribute("display", "");
            }
            else {
                this.flightDirector.setAttribute("display", "none");
            }
        }
    }
}
customElements.define('glasscockpit-hud-attitude-indicator', HudAttitudeIndicator);
//# sourceMappingURL=AttitudeIndicator.js.map