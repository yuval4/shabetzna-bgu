import { Box, Typography } from "@mui/material";
import CreateTeamForm from "./create-team-form";
import CreateUserForm from "./create-user-form";

const SuperAdmin = () => {
    return (
        <Box>
            <Typography variant="subtitle1" color="blue">מסך ניהול🧡</Typography>

            <CreateTeamForm />

            <CreateUserForm />
        </Box>
    );
}

export default SuperAdmin;
