type PrevDepth<Depth extends number> = Depth extends 1
  ? never
  : Depth extends 2
  ? 1
  : Depth extends 3
  ? 2
  : never;

export type NestedKeyOf<ObjectType extends object, Depth extends number = 3> = [
  Depth
] extends [never]
  ? never
  : {
      [Key in keyof ObjectType &
        (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key], PrevDepth<Depth>>}`
        : `${Key}`;
    }[keyof ObjectType & (string | number)];
