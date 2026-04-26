import { useQuery } from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import { Mission } from "../shared/types/entities/mission";
import { Team } from "../shared/types/entities/team";

export const getMissionByTeamId = (teamId: Team["id"]) =>
    useQuery<Mission | undefined>({
        queryKey: ["missionByTeam", teamId],
        queryFn: async () => {
            if (!teamId) {
                throw Error("param is undefined");
            }

            const missions = (await axiosRes.get("/missions")).data as Mission[];
            return missions.find((mission) => mission.teamId === teamId);
        },
        enabled: !!teamId,
    });
