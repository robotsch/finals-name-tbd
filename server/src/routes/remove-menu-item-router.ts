import express, { Request, Response, Router } from 'express';
import * as rQueries from '../db/queries/01_restaurants';

const sanitize = require('mongo-sanitize');
const ObjectId = require('mongodb').ObjectId;

const router: Router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const restaurant = sanitize(req.session.employee_id);
  const menuItem = sanitize(req.body.id);

  rQueries
    .deleteMenuItemByRestaurantId(ObjectId(restaurant), ObjectId(menuItem))
    .then((res) => {
      res.send(res);
    })
    .catch((err) => {
      console.log('Failed to remove menu item: ', err)
      res.status(500).send(`Failed to remove menu item: ${err}`)
    });
});

module.exports = router;
