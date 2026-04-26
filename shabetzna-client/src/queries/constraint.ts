import { useQuery } from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import { formatDateToUrl } from "../shared/dates/format-date";
import { Constraint } from "../shared/types/entities/constraint";
import { Mission } from "../shared/types/entities/mission";

export const getConstraint = (id: Constraint["id"]) =>
  useQuery<Constraint>({
    queryKey: ["constraint"],
    queryFn: async () => {
      return (await axiosRes.get(`/constraints/${id}`)).data;
    },
  });

export const getConstraintByMissionAndRange = (
  missionId: Mission["id"],
  start: Date,
  end: Date
) =>
  useQuery<Constraint[]>({
    queryKey: ["constraints", missionId, start, end],
    enabled: !!missionId && !!start && !!end,
    queryFn: async () => {
      if (!missionId || !start || !end) {
        throw Error("params are undefined");
      }

      return (
        await axiosRes.get(
          `constraints/mission/${missionId}/${formatDateToUrl(
            start
          )}/${formatDateToUrl(end)}`
        )
      ).data;
    },
  });
