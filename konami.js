/**
 *      Konami JS
 * 
 *      Bit Space Development Ltd.
 * 		
 */
var Konami = function (callback) {
	
	typeof callback === "string" && cheat.load(callback);
	if (typeof callback === "function") {
		cheat.code = callback;
		cheat.load();
	}
	
	var cheat = {
		addEvent: function (obj, type, fn, ref_obj) {
			if (obj.addEventListener)
				obj.addEventListener(type, fn, false);
			else if (obj.attachEvent) {
				// IE
				obj["e" + type + fn] = fn;
				obj[type + fn] = function () {
					obj["e" + type + fn](window.event, ref_obj);
				}
				obj.attachEvent("on" + type, obj[type + fn]);
			}
		},
		input: "",
		pattern: "38384040373937396665",
		load: function (link) {
			this.addEvent(document, "keydown", function (e, ref_obj) {
				if (ref_obj) cheat = ref_obj; // IE
				cheat.input += e ? e.keyCode : event.keyCode;
				if (cheat.input.length > cheat.pattern.length)
					cheat.input = cheat.input.substr((cheat.input.length - cheat.pattern.length));
				if (cheat.input == cheat.pattern) {
					cheat.code(link);
					cheat.input = "";
					e.preventDefault();
					return false;
				}
			}, this);
			this.iphone.load(link);
		},
		code: function (link) {
			window.location = link
		},
		iphone: {
			start_x: 0,
			start_y: 0,
			stop_x: 0,
			stop_y: 0,
			tap: false,
			capture: false,
			orig_keys: "",
			keys: ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "TAP", "TAP"],
			code: function (link) {
				konami.code(link);
			},
			load: function (link) {
				this.orig_keys = this.keys;
				cheat.addEvent(document, "touchmove", function (e) {
					if (e.touches.length == 1 && cheat.iphone.capture == true) {
						var touch = e.touches[0];
						cheat.iphone.stop_x = touch.pageX;
						cheat.iphone.stop_y = touch.pageY;
						cheat.iphone.tap = false;
						cheat.iphone.capture = false;
						cheat.iphone.check_direction();
					}
				});
				cheat.addEvent(document, "touchend", function (evt) {
					if (cheat.iphone.tap == true) cheat.iphone.check_direction(link);
				}, false);
				cheat.addEvent(document, "touchstart", function (evt) {
					cheat.iphone.start_x = evt.changedTouches[0].pageX;
					cheat.iphone.start_y = evt.changedTouches[0].pageY;
					cheat.iphone.tap = true;
					cheat.iphone.capture = true;
				});
			},
			check_direction: function (link) {
				x_magnitude = Math.abs(this.start_x - this.stop_x);
				y_magnitude = Math.abs(this.start_y - this.stop_y);
				x = ((this.start_x - this.stop_x) < 0) ? "RIGHT" : "LEFT";
				y = ((this.start_y - this.stop_y) < 0) ? "DOWN" : "UP";
				result = (x_magnitude > y_magnitude) ? x : y;
				result = (this.tap == true) ? "TAP" : result;

				if (result == this.keys[0]) this.keys = this.keys.slice(1, this.keys.length);
				if (this.keys.length == 0) {
					this.keys = this.orig_keys;
					this.code(link);
				}
			}
		}
	}

	return cheat;
};
