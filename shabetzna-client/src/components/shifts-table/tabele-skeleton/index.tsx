import { Skeleton } from "@mui/material";
import ListSkeleton from "../../list-skeleton";

const TableSkeleton = () => {
  return (
    <div>
      <Skeleton variant="text" width="100%" height={30} style={{ marginBottom: 10 }} />
      <ListSkeleton headerSize={40} items={4} />
    </div>
  );
};

export default TableSkeleton;