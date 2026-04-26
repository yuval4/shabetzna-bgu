import { Team } from "./team";

export interface Mission {
    id: string;
    name: string;
    description: string;
    teamId: Team["id"];
    team?: Team;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
