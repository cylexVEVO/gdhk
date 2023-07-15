extends HttpRouter
class_name GDHKRouter

var node_cache = {};
var function_cache = {};

func handle_post(request: HttpRequest, response: HttpResponse) -> void:
	var parsed = JSON.parse_string(request.body);

	var node;
	if node_cache.has(parsed.node_path):
		node = node_cache[parsed.node_path];
	else:
		node = TreeAcc.proxied_node(parsed.node_path);
		node_cache[parsed.node_path] = node;

	var result = null;
	match parsed.intent:
		"query":
			result = node.query(parsed.property);
		"update":
			var node_func_idx = "%s.%s" % [parsed.node_path, parsed.function];
			var function;
			if function_cache.has(node_func_idx):
				function = function_cache[node_func_idx];
			else:
				function = Callable(node, parsed.function);
				function_cache[node_func_idx] = function;

			if parsed.use_params:
				function.call(parsed.params);
			else:
				function.call();
	response.send(200, JSON.stringify(result), "application/json");
