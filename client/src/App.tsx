import * as dotenv from "dotenv";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.scss";

import Menu from "./components/Menu";
import TemporaryDrawer from "./components/Drawer";
import Table from "./components/Table";
import Landing from "./components/Landing";

import Employee from "./employee-components/Employee";
import EmployeeLogin from "./employee-components/EmployeeLogin";
import OrderHistory from "./employee-components/OrderHistory";

import { CssBaseline } from "@mui/material";

export default function App() {

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
