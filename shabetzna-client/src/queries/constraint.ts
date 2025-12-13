import { useQuery } from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import { Team } from "../shared/types/entities/team";
import { Constraint } from "../shared/types/entities/constraint";
import { formatDateToUrl } from "../shared/dates/format-date";

export const getConstraint = (id: Constraint["id"]) =>
  useQuery<Constraint>({
    queryKey: ["constraint"],
    queryFn: async () => {
      return (await axiosRes.get(`/constraints/${id}`)).data;
    },
  });

export const getConstraintByTeamAndRange = (
  teamId: Team["id"],
  start: Date,
  end: Date
) =>
  useQuery<Constraint[]>({
    queryKey: ["constraints", teamId, start, end],
    queryFn: async () => {
      if (!teamId || !start || !end) {
        throw Error("params are undefined");
      }

      return (
        await axiosRes.get(
          `constraints/team/${teamId}/${formatDateToUrl(
            start
          )}/${formatDateToUrl(end)}`
        )
      ).data;
    },
  });
