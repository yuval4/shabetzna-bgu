import { NestedKeyOf } from "../../shared/types/nested-keyof";

export interface Column<T extends Object> {
  name: NestedKeyOf<T>;
  label: string;
  width?: number;
  align?: "right";
  format?: (value: any, row: T) => JSX.Element | string;
  sortby?: (a?: T, b?: T) => number | undefined;
}
