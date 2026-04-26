import { InvalidateQueryFilters, useMutation } from "@tanstack/react-query";
import { queryClient } from "../app";
import axiosRes from "../shared/axios-req";
import { Shift } from "../shared/types/entities/shift";
import { User } from "../shared/types/entities/user";

export const useAllocateShifts = () =>
  useMutation({
    mutationFn: async ({
      missionId,
      userIds,
      shiftsType,
      start,
      end,
      usersPerShift,
    }: {
      missionId: string;
      userIds: User["id"][];
      shiftsType: string;
      start: Date;
      end: Date;
      usersPerShift?: number;
    }) => {
      return await axiosRes.post(`shifts/allocate/mission/${missionId}`, {
        userIds,
        shiftsType,
        start,
        end,
        usersPerShift,
      });
    },
    onSuccess: () => {
      return queryClient.invalidateQueries([
        "shifts",
        "missionShifts",
        "spartaView",
      ] as InvalidateQueryFilters);
    },
  });

export const useUpdateShifts = () =>
  useMutation({
    mutationFn: async ({
      shifts,
      shiftsIdsToDelete,
    }: {
      shifts: Partial<Shift>[];
      shiftsIdsToDelete: Shift["id"][];
    }) => {
      return await axiosRes.put("shifts", {
        shifts,
        shiftsIdsToDelete,
      });
    },
    onSuccess: () => {
      return queryClient.invalidateQueries([
        "shifts",
        "missionShifts",
        "spartaView",
      ] as InvalidateQueryFilters);
    },
  });
