import bcrypt from "bcryptjs";

const password = "admin";
const hash = "$2b$12$TqTF25w43qIbdZIXkUru3uI823FgF9IvXCHfGmycWeK.k4h8oFka6";

console.log(`Testing password: '${password}'`);
console.log(`Against hash: '${hash}'`);

bcrypt
  .compare(password, hash)
  .then((res) => {
    console.log("Match Result:", res); // Should be true
  })
  .catch((err) => {
    console.error("Error:", err);
  });
