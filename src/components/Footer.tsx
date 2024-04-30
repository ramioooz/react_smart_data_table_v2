import React from "react";
import { stylesType } from "../utils/types";
import { values } from "../constants";

const Footer = () => {
  return (
    <nav style={styles.main}>
      {/* {links.map((link, i) => (
        <link key={i} href={link.url} />
      ))} */}
      <div style={styles.body}>
        <p>
          All rights reserved © {new Date().getFullYear()}{" "}
          <a href="https://rami.sd" target="_blank" style={{color: "white"}}>
            <b>Rami Mohamed</b>
          </a>
        </p>
      </div>
    </nav>
  );
};

const styles: stylesType = {
  main: {
    height: values.footer_height,
    background: "#188c18",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    color: "white",
  },
};

export default Footer;
