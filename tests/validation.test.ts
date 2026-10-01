import { expect } from "chai";
import { Validation } from "../src/utils/validators";

describe("Validation Namespace Tests", () => {
  it("має перевіряти обов'язковість рядка", () => {
    expect(Validation.isRequired("")).to.be.false;
    expect(Validation.isRequired("   ")).to.be.false;
    expect(Validation.isRequired("Clean Code")).to.be.true;
  });

  it("має перевіряти тільки цифрові значення (ID)", () => {
    expect(Validation.isNumeric("12345")).to.be.true;
    expect(Validation.isNumeric("123a")).to.be.false;
    expect(Validation.isNumeric("")).to.be.false;
  });

  it("має валідувати коректний рік видання через регулярний вираз", () => {
    expect(Validation.isValidYear("2008")).to.be.true;
    expect(Validation.isValidYear("1999")).to.be.true;
    expect(Validation.isValidYear("999")).to.be.false;
    expect(Validation.isValidYear("2150")).to.be.false;
  });

  it("має перевіряти формат email", () => {
    expect(Validation.isValidEmail("user@example.com")).to.be.true;
    expect(Validation.isValidEmail("invalid-email")).to.be.false;
  });
});
