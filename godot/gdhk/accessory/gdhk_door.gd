extends Node3D
class_name GDHKDoor

var target_position = 0;

func query(property: String):
	match property:
		"current_position":
			return target_position;
		"target_position":
			return target_position;
		"position_state":
			return 2;

func set_target_position(target: float):
	target_position = target;
	rotation_degrees.y = 120.0 * (target / 100);

func _ready():
	pass;

func _process(delta):
	pass;
