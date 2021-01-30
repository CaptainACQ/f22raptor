I've worked on this for 8-10 hours a day since the day
Flight Simulator released.  This is by no means a finished
product, but a work in progress.  I have no team... just one
person here.

The flight model and engine specs are based on my own research
of the Raptor and similar aircraft like the F-16 and older fighters.
I am not a pilot, so I make no guarantees that this aircraft functions
like the real thing.  It is extremely fun to fly though.  High speeds
close to ground level really taxes my machine, but lowering the graphics
settings usually fixes any dropped frames or stuttering.

Quality of Life Additions:
* Two invisible knobs added.
	* One is directly under the HUD that controls the HUD brightness.
	* One at top-left of dashboard which controls brightness of all other displays.

Known bugs/limitations:
* Panel lights don't initialize to the on position when starting sim during day. This
causes you to have to cycle the knob to off then back up to get panel lights to function
properly(if the sim was started during the day).

* Remember that turbulence becomes a real pain at high speeds.  Per the specs
for the F-22 listed on Wikipedia and the Lockheed Martin pages, keep speeds
within these guidelines for the best performance:
	* Below FL300 - Less than Mach 1.2
	* Between FL300 - Less than Mach 1.8
	* Above FL450 - Between Mach 1.8 and Mach 2.2

* For lower-end graphics cards (Mine's a 1070Ti) you may see artifacts in
the HUD text when moving.  If that's the case, set Anti-Aliasing to anything 
except TAA(which is default).

TODO/Work in progress(Not in order):
* Need to start incorporating more controls into the cockpit and start arranging
everything to match the F-22 correctly.  I plan on keeping the G3000 and
altering it to a design that looks similar to the F-22.  A complete nav system
rework for it is more than a one person job. [In-Progress]

* Quick look cameras need updated for new cockpit. [Partially Complete]

* I have no idea if the flight computer on the real aircraft could process
flight plans for autopilot(most likely not), but I plan on incorporating it into
it for a more enjoyable experience.  [Works but interface (TMFD) is ugly]

* 3D model needs some more rework.  Tires need to be flattened and not look like
balloons.  Creases need to be added to the underside of the wings.  Creases need
to be added for gear bay doors.

* Fly-By-Wire not very responsive, doesn't hold altitude correctly.

* Autothrottle not working as expected. 

* Need to make the high speed tape move with altitude.

* ILS interceptions cause oscillations.  Most likely need rollPID adjustment in ai.cfg

* Fuel system needs worked into MFD's and needs to be easier to understand.

* Fuel burn way too low. (Enjoying the range so fixing it is on backburner for now)

Fixed:
* Autopilot PID values need readjusted for Pitch and Roll.  Pitch shakes the
aircraft like crazy when above Mach 1.2 below FL300 and above Mach 1.8 above
FL300.  Roll oscillates above FL450.  Will be an easy fix, but time-consuming.

* I plan on taking the EFIS from the G3000 and incorporating it into the HUD.
I'll change the color from white to green and shrink it to fit the HUD correctly.
Also need to redesign the HUD to properly resemble the dimensions of the one on
the real aircraft.

* Landing gear - the front wheel turns when turning the aircraft, but the wheels
don't rotate when the aircraft is moving on the ground.  I'm placing that on the
back burner until the more major problems are fixed.

* Textures need created for the underside of the aircraft.  I just copied the one
I created for the top.  I also need to create textures for the inside of the
VTails as I just copied the ones I made for the outsides.
	
* If the roll rate in the flight model is increased to a realistic level for a 
figter, at max roll the jet goes to a 30+ degree AoA and stalls.  Bug seems to 
be MSFS related as I've tried all different combinations of settings and can't 
keep it from loosing control.  I have it set to a lower roll rate to keep it 
manageable.

Changes:
* 12/28 - Further increased pitch and roll stability.
* 12/30 - Added HUD Functionality.
* 12/31 - Cleaned up HUD.
* 12/31-2 - Forgot to clean up debug scripts.
* 1/2 - Added wheel rotation animation.  Made HUD Brighter.  Added True Heading
	  indicator to HUD.
* 1/3 - Changed broken sound files for better ones.  Adjusted max KIAS for more
      realistic settings.  Starting to add warnings and cautions.  Added 
	  Warning/Caution acknowledge pushbutton.
* 1/4 - Exterior model update.
* 1/16 - Revamped cockpit.  Highly customized HTML Gauges, cleaner interfaces and 
overall better performance.
* 1/17 - Bug fix.
* 1/19 - Fly By Wire added.  Cleaned up HTML Gauges.
* 1/24 - Added air traffic tracking to SMFD Map (Real world Traffic only, bug prevents
Offline AI traffic from displaying.  MSFS Bug Report #90082).  Made SMFD Map more MILSPEC.
Increased map range to 600nm.
* 1/24-2  - Added quickview camera definitions.  Lowered HUD Opacity.
* 1/25 - Cleaned up some code.  Fly-by-Wire now off by default.  AP airspeed bug now always 
displayed on PMFD.  Changes to flight model(Last Commit - Forgot to mention)
* 1/27 - CTD Bug Fix.
* 1/28 - Added Landing Gear lever.  Added brightness control for MFD Buttons/Panels
* 1/29 - Page settings are now saved between flights.  Panels are dimmer when sim starts at 
night.  Display knob now controls all screens and screen button brightness.  Added two
invisible knobs(view README for location and use).
* 1/30 - Fly-By-Wire settings save between flights.  Fixed bug where pressing back button
on MFD's locked up the screen.  Wrote custom potentiometer to handle exponential functions 
and handle values less than 1%(HUD now gets MUCH dimmer).  Moved HUD from default AS3000
template to custom screen templates used by the MFD's(should be small improvement to 
performance/framerate).