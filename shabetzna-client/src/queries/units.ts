import { useQuery } from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import { Unit } from "../shared/types/entities/unit";

export const getAllUnits = () =>
  useQuery<Unit[]>({
    queryKey: ["units"],
    queryFn: async () => {
      return (await axiosRes.get("/units")).data;
    },
  });
