extends Node

func _ready() -> void:
	var server = HttpServer.new();
	server.register_router("/", GDHKRouter.new());
	add_child(server);
	server.start();

func _process(_delta: float) -> void:
	pass;
