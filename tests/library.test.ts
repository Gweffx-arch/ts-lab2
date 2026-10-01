import { expect } from "chai";
import { Library, Identifiable } from "../src/services/Library";

interface TestItem extends Identifiable {
  name: string;
}

describe("Generic Library<T> Service Tests", () => {
  let library: Library<TestItem>;

  beforeEach(() => {
    library = new Library<TestItem>();
  });

  it("має успішно додавати елемент", () => {
    library.add({ id: "1", name: "Книга 1" });
    expect(library.getAll().length).to.equal(1);
    expect(library.findById("1")?.name).to.equal("Книга 1");
  });

  it("має викидати помилку при додаванні дублікату ID", () => {
    library.add({ id: "1", name: "Книга 1" });
    expect(() => library.add({ id: "1", name: "Дублікат" })).to.throw();
  });

  it("має видаляти елемент за ID", () => {
    library.add({ id: "1", name: "Книга 1" });
    const isRemoved = library.remove("1");
    expect(isRemoved).to.be.true;
    expect(library.findById("1")).to.be.undefined;
  });

  it("має виконувати пошук за предикатом", () => {
    library.add({ id: "1", name: "TypeScript Handbook" });
    library.add({ id: "2", name: "JavaScript Guide" });

    const found = library.find((item) => item.name.includes("TypeScript"));
    expect(found.length).to.equal(1);
    expect(found[0].id).to.equal("1");
  });
});
