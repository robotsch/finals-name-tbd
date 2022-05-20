import express, { Request, Response, Router,} from 'express';
import * as rQueries from '../db/queries/01_restaurants';
import * as sanitize from 'mongo-sanitize'
const ObjectId = require('mongodb').ObjectId;

const router: Router = express.Router()

router.get("/", (req: Request, res: Response) => {
  if(req.query.id) {
    const restaurant = sanitize(req.query.id)
    rQueries.getMenuByRestaurantId(ObjectId(restaurant))
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send(`Failed to get menu items: ${err}`)
    })
  }
})

module.exports = router