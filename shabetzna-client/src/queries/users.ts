import {
  QueryKey,
  UndefinedInitialDataOptions,
  useQuery,
} from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import { User } from "../shared/types/entities/user";

export const getAllUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      return (await axiosRes.get("/users")).data;
    },
  });

export const getUser = (
  options?: Omit<
    UndefinedInitialDataOptions<User, Error, User, QueryKey>,
    "queryKey"
  >
) =>
  useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      return (await axiosRes.get("users/me")).data;
    },
    ...options,
  });
