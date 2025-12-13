import { Grid, useMediaQuery } from "@mui/material";
import Constraints from "./constraints";
import Shifts from "./shifts";
import style from "./style.module.css";
import theme from "../../shared/theme";

const Home = () => {
  const isPhone = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid container className={style.container}>
      {
        isPhone ?
          <>
            <Grid item md={8} xs={12} className={style.shifts}>
              <Shifts />
            </Grid>
            <Grid item md={4} xs={12} className={style.constraints}>
              <Constraints />
            </Grid>
          </>
          :
          <>
            <Grid item md={4} xs={12} className={style.constraints}>
              <Constraints />
            </Grid>
            <Grid item md={8} xs={12} className={style.shifts}>
              <Shifts />
            </Grid>
          </>
      }
    </Grid >
  );
};

export default Home;
