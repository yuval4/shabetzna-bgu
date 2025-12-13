import {
  InvalidateQueryFilters,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { queryClient } from "../app";
import axiosRes from "../shared/axios-req";
import { Team } from "../shared/types/entities/team";
import { User } from "../shared/types/entities/user";
import { UserToTeam } from "../shared/types/entities/user-to-team";
import { Unit } from "../shared/types/entities/unit";

export const useCreateTeam = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      name: string;
      unit: Unit;
    },
    unknown
  >
) =>
  useMutation({
    mutationFn: async (newUser: { name: string; unit: Unit }) => {
      return await axiosRes.post("teams", newUser);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ["teams", "user", "users", "teamUsers", "team"],
      });

      options?.onSuccess && (await options.onSuccess(data, variables, context));
    },
    ...options,
  });

export const useAddUserToTeam = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      teamId: Team["id"];
      userId: User["id"];
      role: UserToTeam["role"];
    },
    unknown
  >
) =>
  useMutation({
    mutationFn: async (newUser: {
      teamId: Team["id"];
      userId: User["id"];
      role: UserToTeam["role"];
    }) => {
      return await axiosRes.post("teams/users", newUser);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries([
        "teamUsers",
      ] as InvalidateQueryFilters);

      options?.onSuccess && (await options.onSuccess(data, variables, context));
    },
    ...options,
  });

export const useRemoveUserFromTeam = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      id: Team["id"];
      userId: User["id"];
    },
    unknown
  >
) =>
  useMutation({
    mutationFn: async ({
      id,
      userId,
    }: {
      id: Team["id"];
      userId: User["id"];
    }) => {
      return await axiosRes.delete(`teams/${id}/users/${userId}`);
    },
    onSuccess: async (data, variables, context) => {
      options?.onSuccess && (await options.onSuccess(data, variables, context));
      return queryClient.invalidateQueries([
        "teamUsers",
      ] as InvalidateQueryFilters);
    },
    ...options,
  });
