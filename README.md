# GDHK - Homekit for Godot
## Project structure
- `node/` handles communication between Homekit and Godot. Requests from Homekit are forwarded to an HTTP server running in Godot.
- `godot/` the Godot project (duh).
## Note
The performance sucks for some reason. Probably something to do with all the errors that get logged from the HTTP server. I didn't implement the HTTP server so this is not my problem. :)
## Why?
Why not. It's fun. Sue me. :)