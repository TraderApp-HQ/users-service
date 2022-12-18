import Role from "../src/models/Role";
import { IRole } from "../src/types";

async function role() {
    const insertRoles: IRole[] = [];

    const roles = ["USER", "SUBSCRIBER", "ADMIN", "SUPER_ADMIN"];
    
    for(let i = 0; i < roles.length; i++) {
        insertRoles.push({ _id: i + 1, description: roles[i] });
    }

    try {
        await Role.insertMany(insertRoles);
        console.log("roles inserted");
    }
    catch(err: any) {
        console.log(err.message)
    }
}

export default role;