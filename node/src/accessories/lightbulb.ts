import { Accessory, Characteristic, CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, HAPStatus, Service, uuid } from "hap-nodejs";
import { queryAccessory, updateAccessory } from "../util";

export function build(name: string, nodePath: string) {
    const lightbulb = new Accessory(name, uuid.generate(nodePath));

    const service = new Service.Lightbulb(name);

    const on = service.getCharacteristic(Characteristic.On);

    on.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
            const state = await queryAccessory(nodePath, "state");
            callback(undefined, state);
        } catch (e) {
            console.error(e);
            callback(HAPStatus.OPERATION_TIMED_OUT);
        }
    });

    on.on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        try {
            await updateAccessory(nodePath, "set_state", true, value);
            callback();
        } catch (e) {
            console.error(e);
            callback(HAPStatus.OPERATION_TIMED_OUT);
        }
    });

    const brightness = service.getCharacteristic(Characteristic.Brightness);

    brightness.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
            const state = await queryAccessory(nodePath, "brightness");
            callback(undefined, state);
        } catch (e) {
            console.error(e);
            callback(HAPStatus.OPERATION_TIMED_OUT);
        }
    });

    brightness.on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        try {
            await updateAccessory(nodePath, "set_brightness", true, value);
            callback();
        } catch (e) {
            console.error(e);
            callback(HAPStatus.OPERATION_TIMED_OUT);
        }
    });

    lightbulb.addService(service);

    return lightbulb;
}