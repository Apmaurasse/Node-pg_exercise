process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let db = require("../db");



afterAll(async () => {
    await db.end()
  })


describe("Get /invoices", () => {
    test("Get all invoices", async () => {
        const res = await request(app).get("/invoices");
        expect(res.statusCode).toBe(200);
        expect(res.body.invoices[0].amt).toBe(100);
    });
});


describe("Get /invoices/:id", () => {
    test("Get a specific invoice", async () => {
        const res = await request(app).get("/invoices/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.invoice.amt).toBe(100);
        
    });
});