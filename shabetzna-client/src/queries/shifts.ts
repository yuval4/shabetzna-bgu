import { useQuery } from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import { Team } from "../shared/types/entities/team";
import { Shift } from "../shared/types/entities/shift";
import { formatDateToUrl } from "../shared/dates/format-date";
import { Unit } from "../shared/types/entities/unit";

export const getSpartaView = (unitId: Unit["id"], start: Date, end: Date) =>
  useQuery<Shift[]>({
    queryKey: ["sparta", start, end, unitId],
    queryFn: async () => {
      if (!unitId || !start || !end) {
        throw Error("params are undefined");
      }

      return (
        await axiosRes.get(
          `/shifts/sparta/${unitId}/${formatDateToUrl(start)}/${formatDateToUrl(
            end
          )}`
        )
      ).data;
    },
  });

export const getTeamShifts = (teamId: Team["id"], start: Date, end: Date) =>
  useQuery<Shift[]>({
    queryKey: ["teamShifts", teamId, start, end],
    queryFn: async () => {
      if (!teamId || !start || !end) {
        throw Error("params are undefined");
      }

      return (
        await axiosRes.get(
          `shifts/team/${teamId}/week/${formatDateToUrl(
            start
          )}/${formatDateToUrl(end)}`
        )
      ).data;
    },
  });
