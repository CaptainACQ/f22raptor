I've worked on this for 8-10 hours a day since the day
Flight Simulator released.  This is by no means a finished
product, but a work in progress.  I have no team... just one
person here.

The flight model and engine specs are based on my own research
of the Raptor and similar aircraft like the F-16 and older fighters.
I am not a pilot, so I make no guarantees that this aircraft functions
like the real thing.  It is extremely fun to fly though.  High speeds
close to ground level really taxes my machine, but lowering the graphics
settings usually fixes any dropped frames or studdering.

Please don't submit issues yet.  I'm considering this pre-alpha and have
a lot of work to do yet to where I'm happy with it.  At this time, I
decided that it's just too fun to keep it to myself.

Known bugs/limitations:
* Remember that turbulance becomes a real pain at high speeds.  Per the specs
for the F-22 listed on wikipedia and the Lockheed Martin pages, keep speeds
within these guidelines for the best performance:
	* Below FL300 - Less than Mach 1.2
	* Between FL300 - Less than Mach 1.8
	* Above FL450 - Between Mach 1.8 and Mach 2.2
	
* If the roll rate in the flight model is increased to a realistic level for a 
figter, at max roll the jet goes to a 30+ degree AoA and stalls.  Bug seems to 
be MSFS related as I've tried all different combinations of settings and can't 
keep it from loosing control.  I have it set to a lower roll rate to keep it 
managable.

TODO/Work in progress:
* Need to start incorperating more controls into the cockpit and start arranging
everything to match the F-22 correctly.  I plan on keeping the G3000 and
altering it to a design that looks similar to the F-22.  A complete nav system
rework for it is more than a one person job.

* I have no idea if the flight computer on the real aircraft could process
flight plans for autopilot(most likely not), but I plan on incorperating it into
it for a more enjoyable experience.

* I plan on taking the EFIS from the G3000 and incoperating it into the HUD.
I'll change the color from white to green and shrink it to fit the HUD correctly.
Also need to redesign the HUD to properly resemble the dimensions of the one on
the real aircraft.

* Landing gear - the front wheel turns when turning the aircraft, but the wheels
don't rotate when the aircraft is moving on the ground.  I'm placing that on the
backburner until the more major problems are fixed.

* Textures need created for the underside of the aircraft.  I just copied the one
I created for the top.  I also need to create textures for the inside of the
VTails as I just copied the ones I made for the outsides.

* 3D model needs some more rework.  Tires need to be flattened and not look like
baloons.  Creases need to be added to the underside of the wings.  Creases need
to be added for gear bay doors.

Fixed:
* Autopilot PID values need readjusted for Pitch and Roll.  Pitch shakes the
aircraft like crazy when above Mach 1.2 below FL300 and above Mach 1.8 above
FL300.  Roll oscillates above FL450.  Will be an easy fix, but time-consuming.

Changes:
12/28 - Further increased pitch and roll stability.
12/30 - Added HUD Functionality
12/31 - Cleaned up HUD

