import { useNavigate } from "react-router-dom";
import { stylesType } from "../utils/types";
import { values } from "../constants";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.main}>
      <div style={styles.body}>
        <h1>Page not found!</h1>
        <button onClick={() => navigate("/")} style={styles.button}>
          Return home
        </button>
      </div>
    </div>
  );
};

var marg =
  parseFloat(values.header_height.replace(/\D/g, "")) +
  parseFloat(values.footer_height.replace(/\D/g, "")) +
  "px";
const styles: stylesType = {
  main: {
    minHeight: `calc(100vh - ${marg})`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    // height: "100%",
    // background: "red",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "1rem",
  },
  button: {
    padding: "0.2rem 0.4rem",
  },
};

export default NotFound;
