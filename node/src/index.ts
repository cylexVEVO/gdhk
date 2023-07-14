import { Bridge, Categories, uuid } from "hap-nodejs";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import { build as buildLightbulb } from "./accessories/lightbulb";
import { build as buildDoor } from "./accessories/door";
import { Accessory } from "hap-nodejs";

const schema = z.object({
    accessories: z.array(
        z.object({
            type: z.enum(["lightbulb", "door"]),
            name: z.string().nonempty(),
            nodePath: z.string().nonempty()
        })
    )
});

export async function readAccessories() {
    const fileContents = JSON.parse(new TextDecoder().decode(await readFile("./accessories.json")));
    const parsed = schema.safeParse(fileContents);

    if (!parsed.success) {
        console.error("Invalid `accessories.json`. Please check the config.");
        console.error("Error:", parsed.error);
        process.exit(1);
    }

    const { data: { accessories: readAccessories } } = parsed;

    const accessories: Accessory[] = [];

    readAccessories.forEach((accessory) => {
        switch (accessory.type) {
            case "lightbulb":
                accessories.push(buildLightbulb(accessory.name, accessory.nodePath));
                break;
            case "door":
                accessories.push(buildDoor(accessory.name, accessory.nodePath));
                break;
        }
    });

    return accessories;
}

async function init() {
    const bridge = new Bridge("gdhk Bridge", uuid.generate("gdhk.bridge"));

    bridge.addBridgedAccessories(await readAccessories());

    bridge.publish({
        username: "17:51:07:F4:BC:8A",
        pincode: "678-90-876",
        port: 47128,
        category: Categories.BRIDGE
    });
}

init();