import { Accessory, Characteristic, CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, HAPStatus, HapStatusError, Service, uuid } from "hap-nodejs";
import { queryAccessory, updateAccessory } from "../util";

export function build(name: string, nodePath: string) {
    const window = new Accessory(name, uuid.generate(nodePath));

    const service = new Service.Window(name);

    const current = service.getCharacteristic(Characteristic.CurrentPosition);

    current.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
            const state = await queryAccessory(nodePath, "current_position");
            callback(undefined, state);
        } catch (e) {
            console.error(e);
            callback(HAPStatus.OPERATION_TIMED_OUT);
        }
    });

    const target = service.getCharacteristic(Characteristic.TargetPosition);

    target.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
            const state = await queryAccessory(nodePath, "target_position");
            callback(undefined, state);
        } catch (e) {
            console.error(e);
            callback(HAPStatus.OPERATION_TIMED_OUT);
        }
    });

    target.on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        try {
            await updateAccessory(nodePath, "set_target_position", true, value);

            const state = await queryAccessory(nodePath, "current_position");
            service.updateCharacteristic(Characteristic.CurrentPosition, state);
            callback();
        } catch (e) {
            console.error(e);
            callback(HAPStatus.OPERATION_TIMED_OUT);
        }
    });

    const position = service.getCharacteristic(Characteristic.PositionState);

    position.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
            const state = await queryAccessory(nodePath, "position_state");
            callback(undefined, state);
        } catch (e) {
            console.error(e);
            callback(HAPStatus.OPERATION_TIMED_OUT);
        }
    });

    window.addService(service);

    return window;
}