import bcrypt from "bcrypt";

function getSalt(saltRound: number): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRound, (err, salt) => {
      if (err) return reject(err);

      return resolve(salt);
    });
  });
}

function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) return reject(err);
      return resolve(hash);
    });
  });
}

async function getPassword(
  myPlaintextPassword: string
): Promise<string | undefined> {
  try {
    const saltRounds = 10;
    const salt = await getSalt(saltRounds);
    const password = await hashPassword(myPlaintextPassword, salt);

    return password;
  } catch (error) {
    throw error;
  }
}

async function comparePass(pass: string, hash: string) : Promise<boolean | undefined > {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, hash, (err, result) => {
      if (err) return reject(err);
      return resolve(result); // retorna true o false
    });
  });
}

export default {
  getPassword,
  comparePass,
};
