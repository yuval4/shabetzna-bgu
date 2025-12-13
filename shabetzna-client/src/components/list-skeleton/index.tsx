import { Skeleton } from "@mui/material";
import style from "./style.module.css";

interface Props {
  items?: number;
  itemHeight?: number;
  gap?: number;
  headerSize?: number;
}

const ListSkeleton = ({ items = 3, itemHeight = 25, gap = 4, headerSize }: Props) => {
  return (
    <div className={style.container} style={{ gap }}>
      <Skeleton variant="rectangular" width="100%" height={headerSize ?? itemHeight} />

      {Array.from({ length: items - 1 }, (_, index) => (
        <Skeleton key={index} variant="rectangular" width="100%" height={itemHeight} />
      ))}
    </div>
  );
};

export default ListSkeleton;