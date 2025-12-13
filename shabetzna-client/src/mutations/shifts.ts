import { InvalidateQueryFilters, useMutation } from "@tanstack/react-query";
import { queryClient } from "../app";
import axiosRes from "../shared/axios-req";
import { Team } from "../shared/types/entities/team";
import { User } from "../shared/types/entities/user";
import { Shift } from "../shared/types/entities/shift";

export const useAllocateShifts = () =>
  useMutation({
    mutationFn: async ({
      teamId,
      userIds,
      shiftsType,
      start,
      end,
      usersPerShift,
    }: {
      teamId: Team["id"];
      userIds: User["id"][];
      shiftsType: string;
      start: Date;
      end: Date;
      usersPerShift?: number;
    }) => {
      return await axiosRes.post(`shifts/allocate/team/${teamId}`, {
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
        "teamShifts",
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
        "teamShifts",
        "spartaView",
      ] as InvalidateQueryFilters);
    },
  });
