extends HttpRouter
class_name GDHKRouter

func handle_post(request: HttpRequest, response: HttpResponse) -> void:
	var parsed = JSON.parse_string(request.body);
	var node = TreeAcc.proxied_node(parsed.node_path);
	var result;
	match parsed.intent:
		"query":
			result = node.query(parsed.property);
		"update":
			var function = Callable(node, parsed.function);
			if parsed.use_params:
				function.call(parsed.params);
			else:
				function.call();
			result = null;
	response.send(200, JSON.stringify(result), "application/json");
