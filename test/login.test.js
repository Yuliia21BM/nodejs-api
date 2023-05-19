const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = require("../app");
const { DB_HOST_TEST } = process.env;
const User = require("../models/user");

const pathLogin = "/api/auth/login";

const loginedUser = {
  email: "test@gmail.com",
  password: "test123",
};

describe("Test: login", () => {
  let user;

  beforeAll(async () => {
    await mongoose
      .connect(DB_HOST_TEST)
      .then(() => console.log("DB Connected"))
      .catch((err) => {
        console.log(err);
      });

    user = new User({
      email: loginedUser.email,
      password: await bcrypt.hash(loginedUser.password, 10),
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose
      .disconnect()
      .then(() => console.log("DB Disconnected"))
      .catch((err) => {
        console.log(err);
      });
  });

  it("should login user and return token with status code 200", async () => {
    const response = await request(app)
      .post(pathLogin)
      .send(loginedUser)
      .expect(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return status code 401 if password is invalid", async () => {
    const response = await request(app)
      .post(pathLogin)
      .send({ email: loginedUser.email, password: "1235678" })
      .expect(401);

    expect(response.body).toHaveProperty(
      "message",
      "Email or password is wrong"
    );
  });

  it("should return status code 401 if email are invalid", async () => {
    const response = await request(app)
      .post(pathLogin)
      .send({
        email: "somethingwrong@gmail.com",
        password: loginedUser.password,
      })
      .expect(401);

    expect(response.body).toHaveProperty(
      "message",
      "Email or password is wrong"
    );
  });
});
