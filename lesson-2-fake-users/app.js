import { faker } from "@faker-js/faker";
import _ from "lodash";

export function createRandomUser() {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    phone: faker.number.int(),
  };
}

const users = faker.helpers.multiple(createRandomUser, {
  count: 10,
});

console.log(users);

const sortedArrOfUsers = _.sortBy(users, [
  function (user) {
    return user.name;
  },
]);

console.log(sortedArrOfUsers);
