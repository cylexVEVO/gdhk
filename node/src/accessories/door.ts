import { Accessory, Characteristic, CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Service, uuid } from "hap-nodejs";

export function build(name: string, nodePath: string) {
    const door = new Accessory(name, uuid.generate(nodePath));

    const service = new Service.Door(name);

    const current = service.getCharacteristic(Characteristic.CurrentPosition);

    current.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        const res = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                intent: "query",
                node_path: nodePath,
                property: "current_position"
            })
        });
        const state = await res.json();
        callback(undefined, state);
    });

    const target = service.getCharacteristic(Characteristic.TargetPosition);

    target.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        // TODO
        const res = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                intent: "query",
                node_path: nodePath,
                property: "target_position"
            })
        });
        const state = await res.json();
        callback(undefined, state);
    });

    target.on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                intent: "update",
                node_path: nodePath,
                function: "set_target_position",
                use_params: true,
                params: value
            })
        });

        const res = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                intent: "query",
                node_path: nodePath,
                property: "current_position"
            })
        });
        const state = await res.json();

        service.updateCharacteristic(Characteristic.CurrentPosition, state);
        callback();
    });

    const position = service.getCharacteristic(Characteristic.PositionState);

    position.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        const res = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                intent: "query",
                node_path: nodePath,
                property: "position_state"
            })
        });
        const state = await res.json();
        callback(undefined, state);
    });

    door.addService(service);

    return door;
}