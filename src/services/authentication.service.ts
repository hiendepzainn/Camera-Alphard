import { prisma } from "../config/client";
import { ACCOUNT_TYPE } from "../config/constant";
import { comparePassword, hashPassword } from "./user.service";

const isExistInDatabase = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      username: email,
    },
  });

  if (user) {
    return true;
  }
  return false;
};

const insertUserToDatabase = async (fullName, email, password) => {
  await prisma.user.create({
    data: {
      fullName: fullName,
      username: email,
      password: await hashPassword(password),
      accountType: ACCOUNT_TYPE.SYSTEM,
      roleID: 2,
    },
  });
};

const handleLogin = async (
  username: string,
  password: string,
  callback: any,
) => {
  // check Username exist in Database
  const user = await prisma.user.findUnique({ where: { username: username } });
  if (!user) {
    return callback(null, false, {
      message: `Tài khoản ${username} không tồn tại!`,
    });
  }
  // compare Password
  const result = await comparePassword(password, user.password);
  if (!result) {
    return callback(null, false, { message: `Mật khẩu không chính xác!` });
  }
  return callback(null, user);
};

export { isExistInDatabase, insertUserToDatabase, handleLogin };
