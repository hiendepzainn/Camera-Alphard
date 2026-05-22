import { NextFunction, Request, Response } from "express";
import { RegisterSchema } from "../validation/authentication.schema";
import { insertUserToDatabase } from "../services/authentication.service";
import passport from "passport";

const getLoginPage = (req: Request, res: Response) => {
  const session: any = req.session;

  // Nếu có thông báo lỗi trong session
  if (session.messages && session.messages.length > 0) {
    const error = session.messages[session.messages.length - 1];

    // Xóa mảng lỗi để tránh việc F5 lại trang vẫn hiện lỗi cũ
    session.messages = [];

    // Ép session lưu trạng thái "đã xoá lỗi" xuống DB trước khi render
    return req.session.save(() => {
      res.render("login.ejs", { error: error });
    });
  }

  // Trường hợp vào trang login bình thường, không có lỗi
  return res.render("login.ejs", { error: undefined });
};

const handlePostLogin = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  // 🔥 Tự bắt lỗi trống trường trước khi gọi Passport
  if (!username || !password) {
    const session: any = req.session;
    session.messages = session.messages || [];

    // Bạn thích viết câu thông báo gì ở đây cũng được
    session.messages.push("Vui lòng điền đầy đủ tài khoản và mật khẩu!");

    return req.session.save(() => {
      res.redirect("/login");
    });
  }

  // Sử dụng Custom Callback của Passport để kiểm soát luồng lưu Session
  passport.authenticate("local", (err: any, user: any, info: any) => {
    // Nếu có lỗi hệ thống (mất kết nối DB, crash code...)
    if (err) {
      return next(err);
    }

    // Nếu thông tin đăng nhập sai (User không tồn tại hoặc sai mật khẩu)
    if (!user) {
      const session: any = req.session;
      session.messages = session.messages || [];

      // Đẩy thông báo lỗi (info.message trả ra từ dịch vụ handleLogin) vào session
      session.messages.push(info.message);

      // Đợi Prisma ghi lỗi vào session DB xong mới redirect về trang login
      return req.session.save(() => {
        res.redirect("/login");
      });
    }

    // Nếu đăng nhập thành công, tiến hành thiết lập login cho user
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      // Đợi DB cập nhật trạng thái session đã đăng nhập thành công rồi mới chuyển trang
      return req.session.save(() => {
        res.redirect("/successLoginPage");
      });
    });
  })(req, res, next); // Thực thi phương thức authenticate
};

const getSuccessLoginPage = (req: Request, res: Response) => {
  const user = req.user as any;
  const roleName = user.role.name;
  if (roleName === "ADMIN") {
    res.redirect("/admin");
  } else {
    res.redirect("/");
  }
};

const getRegisterPage = (req: Request, res: Response) => {
  return res.render("register.ejs", {
    listErrors: undefined,
    oldData: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

const postRegister = async (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } = req.body;

  // validate data
  const validateResult = await RegisterSchema.safeParseAsync(req.body);

  if (validateResult.success) {
    // insert to DB
    await insertUserToDatabase(fullName, email, password);

    res.redirect("/login");
  } else {
    return res.render("register.ejs", {
      listErrors: validateResult.error.issues,
      oldData: req.body,
    });
  }
};

const postLogout = (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export {
  getLoginPage,
  getRegisterPage,
  postRegister,
  getSuccessLoginPage,
  postLogout,
  handlePostLogin,
};
