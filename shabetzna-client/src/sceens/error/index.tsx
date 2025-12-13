import { Button, Typography } from "@mui/material";
import style from "./style.module.css";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useTrack } from "../../hooks/use-track";

interface Props {
  title?: string;
  subtitle?: string;
  icon?: string;
  chatLink?: boolean;
  buttonText?: string;
  buttonClick?: () => void;
}

const ErrorPage = ({
  title = "",
  subtitle = "",
  icon = "404.png",
  chatLink = true,
  buttonText = "חזרה לעמוד הראשי",
  buttonClick,
}: Props) => {
  const { trackEvent } = useTrack();

  const handleAction = () => {
    trackEvent("error", "exit_error_click", {
      title,
      button_text: buttonText,
    });

    if (buttonClick) {
      buttonClick();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className={style.container}>
      <img src={icon} alt="404" className={style.image} />
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="body1">{subtitle} </Typography>
      {chatLink && (
        <Button
          variant="text"
          color="primary"
          href={import.meta.env.VITE_CHAT_URL}
          target="_blank"
          className={style.chatLink}
        >
          <ChatBubbleIcon />
          לעזרה נוספת, יכולים ליצור קשר בצ'אט
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAction}
        className={style.button}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ErrorPage;
