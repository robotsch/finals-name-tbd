require('dotenv').config({ silent: true });
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { Server, Socket } from 'socket.io';

import {
  getAllRestaurants,
  getRestaurantsWithId,
  createRestaurant,
  deleteRestaurantById,
  addMenuItemByRestaurantId,
  getEmployeeWithUsername,
  getMenuByRestaurantId,
  deleteMenuItemByRestaurantId,
} from './db/queries/01_restaurants';

const clientPromise = require('./db/db');

const app = express();
app.use(morgan('dev'));

const clientAddr = process.env.CLIENT_ORIGIN!;

app.use(cors({ origin: [clientAddr], credentials: true }));
app.use(bodyParser.json());

/**
 * ============================================================
 * Session setup
 * ============================================================
 */

declare module 'express-session' {
  export interface SessionData {
    restaurant_id: string;
    employee_id: string;
  }
}

app.use(
  expressSession({
    store: MongoStore.create({ clientPromise }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 15 * 60 * 1000,
    },
  })
);

/**
 * ============================================================
 * Socket setup
 * ============================================================
 */

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientAddr,
  },
});
//======================================

const getAllNames = (sockets: any) => {
  const names = [];
  for (const clientID of sockets) {
    const socket = io.sockets.sockets.get(clientID);
    if (socket && socket.data.name !== undefined) {
      names.push(socket.data.name);
    }
  }
  return names;
};

let interval: any;
io.on('connection', (socket) => {
  let sockets: any;
  let room: string;
  let orderNum = 1;
  console.log('special: ', getAllRestaurants);

  socket.data = socket.handshake.query;

  console.log(`New client connected`, socket.id);

  socket.on('SUBMIT_NAME', ({ name, restaurant, table }) => {
    socket.data.name = name;
    // room = `rst1.tbl1`;
    // room = `rst${socket.data.restaurant}.tbl${socket.data.table}`;
    room = `rst${restaurant}.tbl${table}`;
    io.in(socket.id).socketsJoin(room);
    const names = getAllNames(io.sockets.adapter.rooms.get(room));
    io.to(room).emit('SUBMIT_NAME', names);
  });

  socket.on('RECONNECT', ({ name, restaurant, table }) => {
    room = `rst${restaurant}.tbl${table}`;
    io.in(socket.id).socketsJoin(room);
  });

  socket.on('EMPLOYEE', ({ restaurant }) => {
    room = restaurant;
    io.in(socket.id).socketsJoin(room);
  });

  socket.on('DB_TEST', () => {
    getAllRestaurants().then((res: any) => io.emit('DB_TEST', res));
  });

  socket.on('EMPLOYEE', ({ restaurant }) => {
    room = restaurant;
    io.in(socket.id).socketsJoin(room);
  });

  socket.on('UPDATE_ORDER', ({ name, order, restaurant, table }) => {
    room = `rst${restaurant}.tbl${table}`;
    io.in(socket.id).socketsJoin(room);
    io.to(room).emit('UPDATE_ORDER', { name, order });
  });

  socket.on('SUBMIT_ORDER', ({ restaurant, currentOrder }) => {
    io.to(room).emit('SUBMIT_ORDER');
    io.to(restaurant).emit('SUBMIT_ORDER', currentOrder);
  });

  socket.on('disconnect', () => {
    console.log('Client has disconnected:', socket.id);
    io.to(room).emit('USER_DISCONNECT', socket.data.name);
  });
});

//======================================

// Router imports
const menuRoute = require('./routes/menu-router');
const orderRoute = require('./routes/order-insert-router');
const employeeLoginRoute = require('./routes/login-router');
const addMenuItemRoute = require('./routes/add-menu-item-router');
const removeMenuItemRoute = require('./routes/remove-menu-item-router');
const qrRoute = require('./routes/qr-code-router');

<<<<<<< HEAD
app.use(express.static('../client/dist'))
=======
app.use(express.static('client/dist'));
>>>>>>> a7623a2703c3d66eb05979d7054cf8ca26b50bc2

// Resource routes
app.use('/api/menu', menuRoute);
app.use('/api/order', orderRoute);
app.use('/api/employee-login', employeeLoginRoute);
app.use('/api/add-menu-item', addMenuItemRoute);
app.use('/api/remove-menu-item', removeMenuItemRoute);
app.use('/api/qr-generate', qrRoute);

server.listen(process.env.PORT || 3001, () => console.log(`Server running on ${process.env.PORT || 3001}`));
