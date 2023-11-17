import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import TablePage from "./pages/TablePage/TablePage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path='/users' element={<Users/>}/> */}
        <Route
          path="/users"
          element={
            <TablePage
              key={"users"}
              title={"Users"}
              dataSourceUrl={"https://dummyjson.com/users"}
              columns_to_display={[
                "id",
                "firstName",
                "lastName",
                "maidenName",
                "age",
                "gender",
                "email",
                "phone",
                "username",
                "birthDate",
              ]}
            />
          }
        />
        <Route path="/products" element={<TablePage key={"products"}
            title={"Products"}
            dataSourceUrl={'https://dummyjson.com/products'}
            columns_to_display={[
              "id",
              "title",
              "description",
              "price",
              "discountPercentage",
              "rating",
              "stock",
              "brand",
              "category",
            ]}
          />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
