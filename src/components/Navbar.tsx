import React from "react";
import { stylesType } from "../utils/types";
import { values } from "../constants";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      {links.map((link, i) => (
        <a key={i} href={link.url} style={styles.a}>
          {link.title.toUpperCase()}
        </a>
      ))}
    </nav>
  );
};

var links = [
  { title: "Home", url: "/" },
  { title: "Users", url: "/users" },
  { title: "Products", url: "/products" },
];

const styles: stylesType = {
  nav: {
    height: values.header_height,
    background: "#188c18",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  a: {
    height: "fit-content",
    // border: "1px solid black",
    color: "white",
    textUnderlineOffset: "5px",
  },
};

export default Navbar;
