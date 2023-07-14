extends OmniLight3D
class_name GDHKLightbulb

@export_range(0.1, 10) var max_brightness = 1.0;
var brightness = 100;

func set_state(state: bool):
	visible = state;

func set_brightness(value):
	brightness = value;
	light_energy = max_brightness * (value / 100);

func query(property: String):
	match property:
		"state":
			return visible;
		"brightness":
			return brightness;
		_:
			return null;

func _ready():
	light_energy = max_brightness;

func _process(delta):
	pass;
