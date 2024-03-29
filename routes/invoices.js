const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");


router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM invoices`);
      return res.json({ invoices: results.rows })
    } catch (e) {
      return next(e);
    }
  })


router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const invoiceResult = await db.query('SELECT * FROM invoices WHERE id = $1', [id])
      if (invoiceResult.rows.length === 0) {
        throw new ExpressError(`Can't find invoice with code of ${id}`, 404)
      }
      return res.send({ invoice: invoiceResult.rows[0] });
    } catch (e) {
      return next(e)
    }
  })


router.post('/', async (req, res, next) => {
    try {
      const { comp_code, amt } = req.body;
      const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt]);

      return res.status(201).json({ invoice: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })


router.patch('/:id', async (req, res, next) => {
    try {
      let { id } = req.params;
      let  { amt, paid } = req.body;
      let paidDate = null;

      const currResult = await db.query(
        `SELECT paid
         FROM invoices
         WHERE id = $1`,
      [id]);

    if (currResult.rows.length === 0) {
    throw new ExpressError(`No such invoice: ${id}`, 404);
     }

    const currPaidDate = currResult.rows[0].paid_date;

    if (!currPaidDate && paid) {
    paidDate = new Date();
    } else if (!paid) {
    paidDate = null
     } else {
    paidDate = currPaidDate;
     }

      const results = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date', [amt, id]);
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't update invoice with id of ${id}`, 404)
      }
      return res.send({ invoice: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })


router.delete('/:id', async (req, res, next) => {
    try {
      const results = await db.query('DELETE FROM invoices WHERE id = $1', [req.params.id]);
      if (results.rowCount === 0) {
        throw new ExpressError(`Can't delete invoice with id of ${req.params.id}`, 404);
      }
      return res.send({ msg: "DELETED!" });
    } catch (e) {
      return next(e);
    }
});



module.exports = router;