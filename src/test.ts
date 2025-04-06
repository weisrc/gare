type Is = (<T>(a: unknown) => a is T) & {
  __gare: "is";
};

declare const is: Is;

type Address = {
  city: string;
  zip?: string;
};

type PetFields = "cat" | "dog";
type Pet = {
  [key in PetFields]: string;
};

type User = {
  name: string;
  age: number;
  address: Address;
  pets: Pet;
  kind: "user";
  kindId: 123;
  another: any;
  yetAnother: unknown;
  nullable: null;
  object: object;
  array: Record<number, unknown>;
  friends?: User[];
  record: {[k in string]: number};
};

is<User>(123); // true
