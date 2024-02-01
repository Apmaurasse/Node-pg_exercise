process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let db = require("../db");



afterAll(async () => {
    await db.end()
  })


describe("Get /companies", () => {
    test("Get all companies", async () => {
        const res = await request(app).get("/companies");
        expect(res.statusCode).toBe(200);
        expect(res.body.companies[0].code).toBe('apple');
    });
});


describe("Get /companies/:code", () => {
    test("Get a specific company", async () => {
        const res = await request(app).get("/companies/ibm");
        expect(res.statusCode).toBe(200);
        expect(res.body.company.code).toBe('ibm');
        
    });
});