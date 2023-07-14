extends OmniLight3D
class_name GDHKLightbulb

@export_range(0.1, 10) var max_brightness = 1.0;
var brightness = 100;
var on = true;
var tween;

func set_state(state: bool):
	on = state;
	if tween:
		tween.kill();
	tween = get_tree().create_tween();
	if on:
		var absolute_delta = abs(100 - brightness);
		tween.tween_property(self, "light_energy", max_brightness * (brightness / 100), max(absolute_delta / 100 * 1, 0.5));
	else:
		var absolute_delta = abs(0 - brightness);
		tween.tween_property(self, "light_energy", 0, max(absolute_delta / 100 * 1, 0.5));

func set_brightness(value):
	var absolute_delta = abs(value - brightness);
	brightness = value;
	if tween:
		tween.kill();
	tween = get_tree().create_tween();
	tween.tween_property(self, "light_energy", max_brightness * (value / 100), max(absolute_delta / 100 * 1, 0.5));

func query(property: String):
	match property:
		"state":
			return on;
		"brightness":
			return brightness;
		_:
			return null;

func _ready():
	light_energy = max_brightness;

func _process(_delta):
	pass;
