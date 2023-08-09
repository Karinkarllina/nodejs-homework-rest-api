import mongoose from 'mongoose';
import request from 'supertest';
import 'dotenv/config';
import app from "../app.js";
import User from './user.js'

const {PORT, DB_HOST_TEST} = process.env;

describe("test login route", () => { 

    let server = null;

    beforeAll(async () => {
        await mongoose.connect(DB_HOST_TEST);
        server = app.listen(PORT);
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    test("test login with correct data", async () => {
        
        const loginData = {
            "email": "Naduin@email.com",
            "password": "12345678"
        };
        const {statusCode, body} = await request(app).post("/api/auth/login").send(loginData);

        expect(statusCode).toBe(200);
        expect(body.token).toBeDefined(); 
        
        expect(body.user.email).toBe(loginData.email);

        const user = await User.findOne({ email: loginData.email }); 

        expect(user.email).toBe(loginData.email);
        expect(typeof user.email).toBe('string');
        expect(body.user.subscription).toBeDefined();
        expect(typeof user.subscription).toBe('string');
     })
    
});
 
