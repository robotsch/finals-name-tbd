import { useState, useEffect } from "react";
import LiveOrder from "./ListOrder";
import { List, Typography } from "@mui/material";
import { orderList } from "../mockdata";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ws from "../sockets/socket";

export default function LiveOrderList() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    ws.emit("EMPLOYEE", { restaurant: "1" });

    ws.on("SUBMIT_ORDER", (order) => {
      // console.log(order);
      setOrders((prev) => [...prev, order]);
    });

    ws.on("DB_TEST", (res) => {
      console.log("result: ", res);
    });

    return () => {
      ws.off("SUBMIT_ORDER");
      ws.off("DB_TEST");
    };
  }, []);

  const renderedOrders = orders.map((order) => {
    return (
      <>
        {Object.keys(order).map((name) => {
          return (
            <>
              <Typography variant="body1">{name}</Typography>
              <LiveOrder key={name} {...order[name]} />
            </>
          );
        })}
      </>
    );
  });

  return (
    <>
      <Typography variant="h4">Live Order Feed</Typography>
      {renderedOrders}
    </>
  );
}

