import { useQuery } from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import { Team } from "../shared/types/entities/team";
import { User } from "../shared/types/entities/user";
import { UserToTeam } from "../shared/types/entities/user-to-team";

export const getAllTeams = () =>
  useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      return (await axiosRes.get("/teams")).data;
    },
  });

export const getTeam = (id: Team["id"]) =>
  useQuery<Team>({
    queryKey: ["team"],
    queryFn: async () => {
      return (await axiosRes.get(`teams/${id}`)).data;
    },
  });

export const getJusticeOfTeam = (teamId: Team["id"]) =>
  useQuery<UserToTeam[]>({
    queryKey: ["justice", teamId],
    queryFn: async () => {
      return (await axiosRes.get(`teams/${teamId}/justice`)).data;
    },
  });

export const getUsersOfTeam = (
  teamId: Team["id"],
  firstUserId: User["id"] = ""
) =>
  useQuery<UserToTeam[]>({
    queryKey: ["teamUsers", teamId],
    queryFn: async () => {
      if (!teamId) {
        throw Error("param is undefined");
      }

      const data = (await axiosRes.get(`teams/${teamId}/users`)).data;
      return data.sort((a: UserToTeam, b: UserToTeam) => {
        if (a.user.id === firstUserId) {
          return -1;
        } else if (b.user.id === firstUserId) {
          return 1;
        } else {
          return b.role.localeCompare(a.role);
        }
      });
    },
  });
