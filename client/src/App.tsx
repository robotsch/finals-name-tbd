import * as dotenv from "dotenv";
import { useState, createContext, useMemo, useContext } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.scss";

import {
  Category,
  FoodItem,
  Order,
  OrderFoodItem,
} from "../ts/foodItem_interface";

import MenuItemList from "./components/MenuItemList";
import CurrentOrder from "./components/CurrentOrder";
import Menu from "./components/Menu";
import TemporaryDrawer from "./components/Drawer";
import Table from "./components/Table";
import Landing from "./components/Landing";

import Employee from "./employee-components/Employee";
import EmployeeLogin from "./employee-components/EmployeeLogin";
import OrderHistory from "./employee-components/OrderHistory";

import useSocket from "./hooks/useSocket";

import RestaurantProvider from "./providers/RestaurantProvider";
import TableProvider from "./providers/TableProvider";

import { salads, soups, order1 } from "./mockdata";
import { CssBaseline } from "@mui/material";

import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#11cb5f",
//     },
//     secondary: {
//       main: "#f25f4c",
//     },

//   },
// });

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ToggleColorMode() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

function App() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <div className="App">
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/landing/*" element={<Landing />} />
          <Route
            path="/menu"
            element={
              <>
                <TemporaryDrawer />
                <Menu />
              </>
            }
          />
          <Route
            path="/table"
            element={
              <>
                <TemporaryDrawer />
                <Table />
              </>
            }
          />
          <Route
            path="/bill"
            element={
              <>
                <TemporaryDrawer />
              </>
            }
          />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
          <Route
            path="/employee"
            element={
              <>
                <Employee />
              </>
            }
          />
          <Route
            path="/employee/login"
            element={
              <>
                <EmployeeLogin />
              </>
            }
          />

          <Route
            path="/employee/history"
            element={
              <>
                <OrderHistory />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
