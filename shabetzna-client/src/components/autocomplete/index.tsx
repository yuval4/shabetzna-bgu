import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Autocomplete, AutocompleteProps } from "@mui/material";
import stylisRTLPlugin from "stylis-plugin-rtl";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [stylisRTLPlugin],
});

interface Props<
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = "div"
> extends AutocompleteProps<
  Value,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent
> {
  label?: string;
  placeholder?: string;
}

const AutocompleteRTL = <
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = "div"
>({
  label,
  placeholder,
  ...props
}: Props<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>) => {
  return (
    <CacheProvider value={cacheRtl}>
      <Autocomplete {...props} />
    </CacheProvider>
  );
};

export default AutocompleteRTL;
