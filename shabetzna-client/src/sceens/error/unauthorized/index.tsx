import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorPage from "..";
import { UserContext } from "../../../context/user-context";

const Unauthorized = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleAction = () => {
    window.location.href = "/login";
  };

  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user]);

  return (
    <ErrorPage
      title="נראה שאין לך הרשאות :\"
      subtitle="אנא פנה למנהל המערכת"
      icon="unauthorized.png"
      buttonText="התחברות"
      buttonClick={handleAction}
    />
  );
};

export default Unauthorized;
