import { Accessory, Characteristic, CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Service, uuid } from "hap-nodejs";

export function build(name: string, nodePath: string) {
    const lightbulb = new Accessory(name, uuid.generate(nodePath));

    const service = new Service.Lightbulb(name);

    const on = service.getCharacteristic(Characteristic.On);

    on.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        const res = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                intent: "query",
                node_path: nodePath,
                property: "state"
            })
        });
        const state = await res.json();
        callback(undefined, state);
    });

    on.on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                intent: "update",
                node_path: nodePath,
                function: "set_state",
                use_params: true,
                params: value
            })
        });
        callback();
    });

    const brightness = service.getCharacteristic(Characteristic.Brightness);

    brightness.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        const res = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                intent: "query",
                node_path: nodePath,
                property: "brightness"
            })
        });
        const state = await res.json();
        callback(undefined, state);
    });

    brightness.on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                intent: "update",
                node_path: nodePath,
                function: "set_brightness",
                use_params: true,
                params: value
            })
        });
        callback();
    });

    lightbulb.addService(service);

    return lightbulb;
}