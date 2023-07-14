extends Node3D
class_name GDHKDoor

var target_position = 0;
var tween;

func query(property: String):
	match property:
		"current_position":
			return target_position;
		"target_position":
			return target_position;
		"position_state":
			return 2;

func set_target_position(target: float):
	var absolute_delta = abs(target - target_position);
	target_position = target;
	if tween:
		tween.kill();
	tween = get_tree().create_tween();
	tween.tween_property(self, "rotation_degrees:y", 120.0 * (target / 100), max(absolute_delta / 100 * 1, 0.5));

func _ready():
	pass;

func _process(_delta):
	pass;
