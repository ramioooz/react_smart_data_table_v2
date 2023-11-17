import React from "react";
import { stylesType } from "../utils/types";
import { values } from "../constants";

const Home = () => {
  return (
    <div style={styles.main}>
      <div style={styles.body}>
        <h1>Home</h1>
        <ul style={styles.body}>
          <li><a href="/users">Users</a></li>
          <li><a href="/products">Products</a></li>
        </ul>
      </div>
    </div>
  );
};

var marg =
  parseFloat(values.header_height.replace(/\D/g, "")) +
  parseFloat(values.footer_height.replace(/\D/g, "")) +
  "px";
// console.log('marg: ', marg);
const styles: stylesType = {
  main: {
    minHeight: `calc(100vh - ${marg})`,
  },
  body: {
    padding: "1rem",
    display:"flex",
    flexDirection: "column",
  },
  ul: {

  }
};

export default Home;
