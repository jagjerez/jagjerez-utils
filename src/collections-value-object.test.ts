import { CollectionValueObject } from "./collections-value-object";
import { IEquality } from "./equality.interface";

test("Test collection valueObject function", () => {
  class TestCollection implements IEquality {
    constructor(
      private readonly _title: string,
      private readonly _data: string
    ) {
      this.title = _title;
      this.data = _data;
    }

    compare(other: TestCollection): boolean {
      return other.title === this.title;
    }
    title!: string;
    data!: string;
  }

  class TestCollections extends CollectionValueObject<TestCollection> {
    constructor(items: TestCollection[]) {
      super(items);
    }
  }

  const test2 = new TestCollection("test2", "test2");
  const test3 = new TestCollection("test3", "test3");
  const test1 = new TestCollection("test1", "test1");
  const collection = new TestCollections([]);
  collection.push(test1);
  collection.push(test2);
  const expect1 = collection.some((x) => x.compare(test1));
  expect(expect1).toBe(true);
  const expect2 = collection.includes(test1);
  expect(expect2).toBe(true);

  collection.remove((x) => x.compare(test2));

  expect(collection.includes(test2)).toBe(false);

  collection.push(test3);
  expect(collection.includes(test3)).toBe(true);
});
