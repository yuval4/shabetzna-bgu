import { Box, Button, Link, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import { useTrack } from "../../hooks/use-track";
import { setLocalStorage, USER_TOKEN_KEY } from "../../shared/local-storage";
import style from "./style.module.css";

// TODO handle login without teams

const LoginScreen = () => {
  const navigate = useNavigate();
  const { trackEvent } = useTrack();
  const { user } = useContext(UserContext);

  const handleLogin = async () => {
    trackEvent("auth", "google");
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google/login`;
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      setLocalStorage(USER_TOKEN_KEY, token);
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user]);

  return (
    <Box className={style.container}>
      <Box className={style.loginForm}>
        <img src="full-logo.png" alt="לוגו" className={style.logo} />
        <Typography className={style.subtitle}>
          ברוכים הבאים לשבץנא, השבצק המבצעי האוטומטי
        </Typography>
        <Button
          variant="outlined"
          startIcon={
            <img src="google.png" alt="גוגל" className={style.googleIcon} />
          }
          className={style.button}
          onClick={handleLogin}
        >
          התחברות עם גוגל
        </Button>
        <Typography className={style.description}>
          לא מצליחים להתחבר? כנראה שאין לכם צוות... בקשו מהרש"צ שיכניס אתם או
          &nbsp;
          <Link href={import.meta.env.VITE_CHAT_URL} target="_blank">
            כתבו לנו
          </Link>
        </Typography>

        <Box className={style.agreements}>
          <Link href="terms-and-conditions.html" target="_blank">
            terms of service
          </Link>
          |
          <Link href="privacy-policy.html" target="_blank">
            privacy policy
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginScreen;
