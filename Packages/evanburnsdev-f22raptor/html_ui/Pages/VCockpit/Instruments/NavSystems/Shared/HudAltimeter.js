class HudAltimeter extends HTMLElement {
    constructor() {
        super();
        this.currentCenterGrad = -10000;
        this.minimumAltitude = NaN;
    }
    static get observedAttributes() {
        return [
            "altitude",
            "radar-altitude",
            //"reference-altitude",
            "minimum-altitude",
            "minimum-altitude-state",
            //"pressure",
            "vspeed",
            "reference-vspeed",
            "vertical-deviation-mode",
            "vertical-deviation-value",
            //"selected-altitude-alert"
        ];
    }
    connectedCallback() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "-50 -100 380 700");
        this.appendChild(this.root);
        {
            this.verticalDeviationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.verticalDeviationGroup.setAttribute("visibility", "hidden");
            this.root.appendChild(this.verticalDeviationGroup);
            let background = document.createElementNS(Avionics.SVG.NS, "rect");
            background.setAttribute("x", "-50");
            background.setAttribute("y", "50");
            background.setAttribute("width", "50");
            background.setAttribute("height", "400");
            background.setAttribute("fill", "#1a1d21");
            background.setAttribute("fill-opacity", "0.25");
            this.verticalDeviationGroup.appendChild(background);
            let topBackground = document.createElementNS(Avionics.SVG.NS, "rect");
            topBackground.setAttribute("x", "-50");
            topBackground.setAttribute("y", "0");
            topBackground.setAttribute("width", "50");
            topBackground.setAttribute("height", "50");
            topBackground.setAttribute("fill", "#1a1d21");
            this.verticalDeviationGroup.appendChild(topBackground);
            this.verticalDeviationText = document.createElementNS(Avionics.SVG.NS, "text");
            this.verticalDeviationText.setAttribute("x", "-25");
            this.verticalDeviationText.setAttribute("y", "40");
            this.verticalDeviationText.setAttribute("fill", "#d12bc7");
            this.verticalDeviationText.setAttribute("font-size", "45");
            this.verticalDeviationText.setAttribute("font-family", "Roboto-Bold");
            this.verticalDeviationText.setAttribute("text-anchor", "middle");
            this.verticalDeviationText.textContent = "V";
            this.verticalDeviationGroup.appendChild(this.verticalDeviationText);
            for (let i = -2; i <= 2; i++) {
                if (i != 0) {
                    let grad = document.createElementNS(Avionics.SVG.NS, "circle");
                    grad.setAttribute("cx", "-25");
                    grad.setAttribute("cy", (250 + 66 * i).toString());
                    grad.setAttribute("r", "6");
                    grad.setAttribute("stroke", "white");
                    grad.setAttribute("stroke-width", "3");
                    grad.setAttribute("fill-opacity", "0");
                    this.verticalDeviationGroup.appendChild(grad);
                }
            }
            this.chevronBug = document.createElementNS(Avionics.SVG.NS, "polygon");
            this.chevronBug.setAttribute("points", "-45,250 -10,230 -10,240 -25,250 -10,260 -10,270");
            this.chevronBug.setAttribute("fill", "#d12bc7");
            this.verticalDeviationGroup.appendChild(this.chevronBug);
            this.diamondBug = document.createElementNS(Avionics.SVG.NS, "polygon");
            this.diamondBug.setAttribute("points", "-40,250 -25,235 -10,250 -25,265");
            this.diamondBug.setAttribute("fill", "#10c210");
            this.verticalDeviationGroup.appendChild(this.diamondBug);
            this.hollowDiamondBug = document.createElementNS(Avionics.SVG.NS, "polygon");
            this.hollowDiamondBug.setAttribute("points", "-40,250 -25,235 -10,250 -25,265 -25,255 -20,250 -25,245 -30,250 -25,255 -25,265");
            this.hollowDiamondBug.setAttribute("fill", "#DFDFDF");
            this.verticalDeviationGroup.appendChild(this.hollowDiamondBug);
        }
        {
            let background = document.createElementNS(Avionics.SVG.NS, "rect");
            background.setAttribute("x", "0");
            background.setAttribute("y", "-50");
            background.setAttribute("width", "200");
            background.setAttribute("height", "600");
            background.setAttribute("fill", "#1a1d21");
            background.setAttribute("fill-opacity", "0.25");
            this.root.appendChild(background);
            let graduationSvg = document.createElementNS(Avionics.SVG.NS, "svg");
            graduationSvg.setAttribute("x", "0");
            graduationSvg.setAttribute("y", "-50");
            graduationSvg.setAttribute("width", "200");
            graduationSvg.setAttribute("height", "600");
            graduationSvg.setAttribute("viewBox", "0 0 200 600");
            this.root.appendChild(graduationSvg);
            let center = 300;
            this.graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            graduationSvg.appendChild(this.graduationGroup);
            {
                let graduationSize = 160;
                this.graduationTexts = [];
                for (let i = -3; i <= 3; i++) {
                    let mainGrad = document.createElementNS(Avionics.SVG.NS, "rect");
                    mainGrad.setAttribute("x", "0");
                    mainGrad.setAttribute("y", fastToFixed(center - 2 + i * graduationSize, 0));
                    mainGrad.setAttribute("height", "4");
                    mainGrad.setAttribute("width", "40");
                    mainGrad.setAttribute("fill", "white");
                    this.graduationGroup.appendChild(mainGrad);
                    let gradText = document.createElementNS(Avionics.SVG.NS, "text");
                    gradText.setAttribute("x", "50");
                    gradText.setAttribute("y", fastToFixed(center + 16 + i * graduationSize, 0));
                    gradText.setAttribute("fill", "white");
                    gradText.setAttribute("font-size", "45");
                    gradText.setAttribute("font-family", "Roboto-Bold");
                    gradText.textContent = "XXXX";
                    this.graduationGroup.appendChild(gradText);
                    this.graduationTexts.push(gradText);
                    for (let j = 1; j < 5; j++) {
                        let grad = document.createElementNS(Avionics.SVG.NS, "rect");
                        grad.setAttribute("x", "0");
                        grad.setAttribute("y", fastToFixed(center - 2 + i * graduationSize + j * (graduationSize / 5), 0));
                        grad.setAttribute("height", "4");
                        grad.setAttribute("width", "15");
                        grad.setAttribute("fill", "white");
                        this.graduationGroup.appendChild(grad);
                    }
                }
            }
            this.trendElement = document.createElementNS(Avionics.SVG.NS, "rect");
            this.trendElement.setAttribute("x", "0");
            this.trendElement.setAttribute("y", "-50");
            this.trendElement.setAttribute("width", "8");
            this.trendElement.setAttribute("height", "0");
            this.trendElement.setAttribute("fill", "#d12bc7");
            this.root.appendChild(this.trendElement);
            this.groundLine = document.createElementNS(Avionics.SVG.NS, "g");
            this.groundLine.setAttribute("transform", "translate(0, 700)");
            graduationSvg.appendChild(this.groundLine);
            {
                let background = document.createElementNS(Avionics.SVG.NS, "rect");
                background.setAttribute("fill", "#654222");
                background.setAttribute("stroke", "white");
                background.setAttribute("stroke-width", "4");
                background.setAttribute("x", "0");
                background.setAttribute("y", "0");
                background.setAttribute("width", "196");
                background.setAttribute("height", "600");
                this.groundLine.appendChild(background);
                let groundLineSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                groundLineSvg.setAttribute("x", "0");
                groundLineSvg.setAttribute("y", "0");
                groundLineSvg.setAttribute("width", "200");
                groundLineSvg.setAttribute("height", "600");
                groundLineSvg.setAttribute("viewBox", "0 0 200 600");
                this.groundLine.appendChild(groundLineSvg);
                for (let i = -5; i <= 25; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    line.setAttribute("fill", "white");
                    line.setAttribute("x", "0");
                    line.setAttribute("y", (-50 + i * 30).toString());
                    line.setAttribute("width", "200");
                    line.setAttribute("height", "4");
                    line.setAttribute("transform", "skewY(-30)");
                    groundLineSvg.appendChild(line);
                }
            }
            let cursor = document.createElementNS(Avionics.SVG.NS, "path");
            cursor.setAttribute("d", "M0 " + center + " L30 " + (center - 40) + " L130 " + (center - 40) + " L130 " + (center - 60) + " L200 " + (center - 60) + " L200 " + (center + 60) + " L130 " + (center + 60) + " L130 " + (center + 40) + " L30 " + (center + 40) + "Z");
            cursor.setAttribute("fill", "#1a1d21");
            graduationSvg.appendChild(cursor);
            let cursorBaseSvg = document.createElementNS(Avionics.SVG.NS, "svg");
            cursorBaseSvg.setAttribute("x", "30");
            cursorBaseSvg.setAttribute("y", (center - 40).toString());
            cursorBaseSvg.setAttribute("width", "100");
            cursorBaseSvg.setAttribute("height", "80");
            cursorBaseSvg.setAttribute("viewBox", "0 0 100 80");
            graduationSvg.appendChild(cursorBaseSvg);
            {
                this.digit1Top = document.createElementNS(Avionics.SVG.NS, "text");
                this.digit1Top.setAttribute("x", "16");
                this.digit1Top.setAttribute("y", "-1");
                this.digit1Top.setAttribute("fill", "white");
                this.digit1Top.setAttribute("font-size", "50");
                this.digit1Top.setAttribute("font-family", "Roboto-Bold");
                this.digit1Top.textContent = "X";
                cursorBaseSvg.appendChild(this.digit1Top);
                this.digit1Bot = document.createElementNS(Avionics.SVG.NS, "text");
                this.digit1Bot.setAttribute("x", "16");
                this.digit1Bot.setAttribute("y", "57");
                this.digit1Bot.setAttribute("fill", "white");
                this.digit1Bot.setAttribute("font-size", "50");
                this.digit1Bot.setAttribute("font-family", "Roboto-Bold");
                this.digit1Bot.textContent = "X";
                cursorBaseSvg.appendChild(this.digit1Bot);
                this.digit2Top = document.createElementNS(Avionics.SVG.NS, "text");
                this.digit2Top.setAttribute("x", "44");
                this.digit2Top.setAttribute("y", "-1");
                this.digit2Top.setAttribute("fill", "white");
                this.digit2Top.setAttribute("font-size", "50");
                this.digit2Top.setAttribute("font-family", "Roboto-Bold");
                this.digit2Top.textContent = "X";
                cursorBaseSvg.appendChild(this.digit2Top);
                this.digit2Bot = document.createElementNS(Avionics.SVG.NS, "text");
                this.digit2Bot.setAttribute("x", "44");
                this.digit2Bot.setAttribute("y", "57");
                this.digit2Bot.setAttribute("fill", "white");
                this.digit2Bot.setAttribute("font-size", "50");
                this.digit2Bot.setAttribute("font-family", "Roboto-Bold");
                this.digit2Bot.textContent = "X";
                cursorBaseSvg.appendChild(this.digit2Bot);
                this.digit3Top = document.createElementNS(Avionics.SVG.NS, "text");
                this.digit3Top.setAttribute("x", "72");
                this.digit3Top.setAttribute("y", "-1");
                this.digit3Top.setAttribute("fill", "white");
                this.digit3Top.setAttribute("font-size", "50");
                this.digit3Top.setAttribute("font-family", "Roboto-Bold");
                this.digit3Top.textContent = "X";
                cursorBaseSvg.appendChild(this.digit3Top);
                this.digit3Bot = document.createElementNS(Avionics.SVG.NS, "text");
                this.digit3Bot.setAttribute("x", "72");
                this.digit3Bot.setAttribute("y", "57");
                this.digit3Bot.setAttribute("fill", "white");
                this.digit3Bot.setAttribute("font-size", "50");
                this.digit3Bot.setAttribute("font-family", "Roboto-Bold");
                this.digit3Bot.textContent = "X";
                cursorBaseSvg.appendChild(this.digit3Bot);
            }
            let cursorRotatingSvg = document.createElementNS(Avionics.SVG.NS, "svg");
            cursorRotatingSvg.setAttribute("x", "130");
            cursorRotatingSvg.setAttribute("y", (center - 60).toString());
            cursorRotatingSvg.setAttribute("width", "70");
            cursorRotatingSvg.setAttribute("height", "120");
            cursorRotatingSvg.setAttribute("viewBox", "0 -50 70 120");
            graduationSvg.appendChild(cursorRotatingSvg);
            {
                this.endDigitsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                cursorRotatingSvg.appendChild(this.endDigitsGroup);
                this.endDigits = [];
                for (let i = -2; i <= 2; i++) {
                    let digit = document.createElementNS(Avionics.SVG.NS, "text");
                    digit.setAttribute("x", "7");
                    digit.setAttribute("y", (27 + 45 * i).toString());
                    digit.setAttribute("fill", "white");
                    digit.setAttribute("font-size", "50");
                    digit.setAttribute("font-family", "Roboto-Bold");
                    digit.textContent = "XX";
                    this.endDigits.push(digit);
                    this.endDigitsGroup.appendChild(digit);
                }
            }
        }
        {
			let verticalSpeedGroup = document.createElementNS(Avionics.SVG.NS, "g");
			verticalSpeedGroup.setAttribute("id", "VerticalSpeed");
			this.root.appendChild(verticalSpeedGroup);
			let background = document.createElementNS(Avionics.SVG.NS, "path");
			background.setAttribute("d", "M200 0 L200 500 L275 500 L275 300 L210 250 L275 200 L275 0 Z");
			background.setAttribute("fill", "#1a1d21");
			background.setAttribute("fill-opacity", "0.25");
			verticalSpeedGroup.appendChild(background);
			let dashes = [-200, -150, -100, -50, 50, 100, 150, 200];
			let height = 3;
			let width = 10;
			let fontSize = 30;
			for (let i = 0; i < dashes.length; i++) {
				let rect = document.createElementNS(Avionics.SVG.NS, "rect");
				rect.setAttribute("x", "200");
				rect.setAttribute("y", (250 - dashes[i] - height / 2).toString());
				rect.setAttribute("height", height.toString());
				rect.setAttribute("width", ((dashes[i] % 100) == 0 ? 2 * width : width).toString());
				rect.setAttribute("fill", "white");
				verticalSpeedGroup.appendChild(rect);
				if ((dashes[i] % 100) == 0) {
					let text = document.createElementNS(Avionics.SVG.NS, "text");
					text.textContent = (dashes[i] / 100).toString();
					text.setAttribute("y", ((250 - dashes[i] - height / 2) + fontSize / 3).toString());
					text.setAttribute("x", (200 + 3 * width).toString());
					text.setAttribute("fill", "white");
					text.setAttribute("font-size", fontSize.toString());
					text.setAttribute("font-family", "Roboto-Bold");
					verticalSpeedGroup.appendChild(text);
				}
			}
			{
				this.indicator = document.createElementNS(Avionics.SVG.NS, "g");
				verticalSpeedGroup.appendChild(this.indicator);
				let indicatorBackground = document.createElementNS(Avionics.SVG.NS, "path");
				indicatorBackground.setAttribute("d", "M210 250 L235 275 L330 275 L330 225 L235 225 Z");
				indicatorBackground.setAttribute("fill", "#FFFFFF");
				this.indicator.appendChild(indicatorBackground);
			}
		}
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "altitude":
                let value = parseFloat(newValue);
                this.altitude = value;
                let center = Math.round(value / 100) * 100;
                this.graduationGroup.setAttribute("transform", "translate(0, " + ((value - center) * 160 / 100) + ")");
                if (this.currentCenterGrad != center) {
                    this.currentCenterGrad = center;
                    for (let i = 0; i < this.graduationTexts.length; i++) {
                        this.graduationTexts[i].textContent = fastToFixed(((3 - i) * 100) + center, 0);
                    }
                }
                let endValue = value % 100;
                let endCenter = Math.round(endValue / 10) * 10;
                this.endDigitsGroup.setAttribute("transform", "translate(0, " + ((endValue - endCenter) * 45 / 10) + ")");
                for (let i = 0; i < this.endDigits.length; i++) {
                    let digitValue = Math.round((((2 - i) * 10) + value) % 100 / 10) * 10;
                    this.endDigits[i].textContent = fastToFixed(Math.abs((digitValue % 100) / 10), 0) + "0";
                }
                if (Math.abs(value) >= 90) {
                    let d3Value = (Math.abs(value) % 1000) / 100;
                    this.digit3Bot.textContent = Math.abs(value) < 100 ? "" : fastToFixed(Math.floor(d3Value), 0);
                    this.digit3Top.textContent = fastToFixed((Math.floor(d3Value) + 1) % 10, 0);
                    if (endValue > 90 || endValue < -90) {
                        if (endValue < 0) {
                            this.digit3Bot.textContent = fastToFixed((Math.floor(d3Value) + 1) % 10, 0);
                            this.digit3Top.textContent = Math.abs(value) < 100 ? "" : fastToFixed(Math.floor(d3Value), 0);
                        }
                        let translate = (endValue > 0 ? (endValue - 90) : (endValue + 100)) * 5.7;
                        this.digit3Bot.setAttribute("transform", "translate(0, " + translate + ")");
                        this.digit3Top.setAttribute("transform", "translate(0, " + translate + ")");
                    }
                    else {
                        this.digit3Bot.setAttribute("transform", "");
                        this.digit3Top.setAttribute("transform", "");
                    }
                    if (Math.abs(value) >= 990) {
                        let d2Value = (Math.abs(value) % 10000) / 1000;
                        this.digit2Bot.textContent = Math.abs(value) < 1000 ? "" : fastToFixed(Math.floor(d2Value), 0);
                        this.digit2Top.textContent = fastToFixed((Math.floor(d2Value) + 1) % 10, 0);
                        if ((endValue > 90 || endValue < -90) && d3Value > 9) {
                            if (endValue < 0) {
                                this.digit2Bot.textContent = fastToFixed((Math.floor(d2Value) + 1) % 10, 0);
                                this.digit2Top.textContent = Math.abs(value) < 1000 ? "" : fastToFixed(Math.floor(d2Value), 0);
                            }
                            let translate = (endValue > 0 ? (endValue - 90) : (endValue + 100)) * 5.7;
                            this.digit2Bot.setAttribute("transform", "translate(0, " + translate + ")");
                            this.digit2Top.setAttribute("transform", "translate(0, " + translate + ")");
                        }
                        else {
                            this.digit2Bot.setAttribute("transform", "");
                            this.digit2Top.setAttribute("transform", "");
                        }
                        if (Math.abs(value) >= 9990) {
                            let d1Value = (Math.abs(value) % 100000) / 10000;
                            this.digit1Bot.textContent = Math.abs(value) < 10000 ? "" : fastToFixed(Math.floor(d1Value), 0);
                            this.digit1Top.textContent = fastToFixed((Math.floor(d1Value) + 1) % 10, 0);
                            if ((endValue > 90 || endValue < -90) && d3Value > 9 && d2Value > 9) {
                                if (endValue < 0) {
                                    this.digit1Bot.textContent = fastToFixed((Math.floor(d2Value) + 1) % 10, 0);
                                    this.digit1Top.textContent = Math.abs(value) < 10000 ? "" : fastToFixed(Math.floor(d2Value), 0);
                                }
                                let translate = (endValue > 0 ? (endValue - 90) : (endValue + 100)) * 5.7;
                                this.digit1Bot.setAttribute("transform", "translate(0, " + translate + ")");
                                this.digit1Top.setAttribute("transform", "translate(0, " + translate + ")");
                            }
                            else {
                                this.digit1Bot.setAttribute("transform", "");
                                this.digit1Top.setAttribute("transform", "");
                            }
                        }
                        else {
                            this.digit1Bot.setAttribute("transform", "");
                            this.digit1Top.setAttribute("transform", "");
                            if (value < 0) {
                                this.digit1Bot.textContent = "-";
                            }
                            else {
                                this.digit1Bot.textContent = "";
                            }
                            this.digit1Top.textContent = "";
                        }
                    }
                    else {
                        this.digit2Bot.setAttribute("transform", "");
                        this.digit2Top.setAttribute("transform", "");
                        if (value < 0) {
                            this.digit2Bot.textContent = "-";
                        }
                        else {
                            this.digit2Bot.textContent = "";
                        }
                        this.digit1Bot.textContent = "";
                        this.digit1Top.textContent = "";
                        this.digit2Top.textContent = "";
                    }
                }
                else {
                    if (value < 0) {
                        this.digit3Bot.textContent = "-";
                    }
                    else {
                        this.digit3Bot.textContent = "";
                    }
                    this.digit2Bot.textContent = "";
                    this.digit1Bot.textContent = "";
                    this.digit2Top.textContent = "";
                    this.digit1Top.textContent = "";
                    this.digit3Bot.setAttribute("transform", "");
                    this.digit3Top.setAttribute("transform", "");
                }
                break;
            case "radar-altitude":
                this.groundLine.setAttribute("transform", "translate(0," + Math.min(300 + parseFloat(newValue) * 160 / 100, 700) + ")");
                break;
            case "vspeed":
                let vSpeed = parseFloat(newValue);
				this.indicator.setAttribute("transform", "translate(0, " + -Math.max(Math.min(vSpeed, 2500), -2500) / 10 + ")");
				//this.indicatorText.textContent = Math.abs(vSpeed) >= 100 ? fastToFixed(Math.round(vSpeed / 50) * 50, 0) : "";
                let trendValue = Math.min(Math.max(250 + (vSpeed / 10) * -1.5, -50), 550);
                this.trendElement.setAttribute("y", Math.min(trendValue, 250).toString());
                this.trendElement.setAttribute("height", Math.abs(trendValue - 250).toString());
                break;
            case "vertical-deviation-mode":
                switch (newValue) {
                    case "VDI":
                        this.currentMode = 1;
                        this.verticalDeviationText.textContent = "V";
                        this.verticalDeviationText.setAttribute("fill", "#d12bc7");
                        this.diamondBug.setAttribute("visibility", "hidden");
                        this.chevronBug.setAttribute("visibility", "inherit");
                        this.hollowDiamondBug.setAttribute("visibility", "hidden");
                        this.verticalDeviationGroup.setAttribute("visibility", "inherit");
                        break;
                    case "GS":
                        this.currentMode = 2;
                        this.verticalDeviationText.textContent = "G";
                        this.verticalDeviationText.setAttribute("fill", "#10c210");
                        this.diamondBug.setAttribute("visibility", "inherit");
                        this.diamondBug.setAttribute("fill", "#10c210");
                        this.chevronBug.setAttribute("visibility", "hidden");
                        this.hollowDiamondBug.setAttribute("visibility", "hidden");
                        this.verticalDeviationGroup.setAttribute("visibility", "inherit");
                        break;
                    case "GSPreview":
                        this.currentMode = 4;
                        this.verticalDeviationText.textContent = "G";
                        this.verticalDeviationText.setAttribute("fill", "#DFDFDF");
                        this.diamondBug.setAttribute("visibility", "hidden");
                        this.chevronBug.setAttribute("visibility", "hidden");
                        this.hollowDiamondBug.setAttribute("visibility", "inherit");
                        this.verticalDeviationGroup.setAttribute("visibility", "inherit");
                        break;
                    case "GP":
                        this.currentMode = 3;
                        this.verticalDeviationText.textContent = "G";
                        this.verticalDeviationText.setAttribute("fill", "#d12bc7");
                        this.diamondBug.setAttribute("visibility", "inherit");
                        this.diamondBug.setAttribute("fill", "#d12bc7");
                        this.chevronBug.setAttribute("visibility", "hidden");
                        this.hollowDiamondBug.setAttribute("visibility", "hidden");
                        this.verticalDeviationGroup.setAttribute("visibility", "inherit");
                        break;
                    default:
                        this.currentMode = 0;
                        this.verticalDeviationGroup.setAttribute("visibility", "hidden");
                        break;
                }
                break;
            case "vertical-deviation-value":
                let pos = (Math.min(Math.max(parseFloat(newValue), -1), 1) * 200);
                this.chevronBug.setAttribute("transform", "translate(0," + pos + ")");
                this.diamondBug.setAttribute("transform", "translate(0," + pos + ")");
                this.hollowDiamondBug.setAttribute("transform", "translate(0," + pos + ")");
                break;
        }
    }
}
customElements.define('glasscockpit-hud-altimeter', HudAltimeter);
//# sourceMappingURL=Altimeter.js.map