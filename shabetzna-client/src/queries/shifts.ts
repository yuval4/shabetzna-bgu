import { useQuery } from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import { formatDateToUrl } from "../shared/dates/format-date";
import { Mission } from "../shared/types/entities/mission";
import { Shift } from "../shared/types/entities/shift";
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

export const getMissionShifts = (
  missionId: Mission["id"],
  start: Date,
  end: Date
) =>
  useQuery<Shift[]>({
    queryKey: ["missionShifts", missionId, start, end],
    enabled: !!missionId && !!start && !!end,
    queryFn: async () => {
      if (!missionId || !start || !end) {
        throw Error("params are undefined");
      }

      return (
        await axiosRes.get(
          `/shifts/missions/${missionId}/week/${formatDateToUrl(
            start
          )}/${formatDateToUrl(end)}`
        )
      ).data;
    },
  });
