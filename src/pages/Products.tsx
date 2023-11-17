import React from "react";
import { values } from "../constants";
import { stylesType } from "../utils/types";

const Products = () => {
  return (
    <div style={styles.main}>
      <div style={styles.body}>Products</div>
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
  },
  body: {
    padding: "1rem",
  },
};

export default Products;
