export async function queryAccessory(nodePath: string, property: string) {
    const res = await fetch("http://localhost:8080/", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            intent: "query",
            node_path: nodePath,
            property
        })
    });
    return await res.json();
}

export async function updateAccessory(nodePath: string, uFunction: string, useParams: boolean = false, params: any = null) {
    return await fetch("http://localhost:8080/", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            intent: "update",
            node_path: nodePath,
            function: uFunction,
            use_params: useParams,
            params
        })
    });
}