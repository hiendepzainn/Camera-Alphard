import { Router } from "express";
import { getHomePage } from "../controllers/user.controller";
import {
  getProductPageClient,
  getProductsPage,
  postAddProductToCart,
  postAddProductWithQuantity,
  postAddToCartFilter,
} from "../controllers/client/product.controller";
import {
  getCartPage,
  getCheckOutPage,
  getThankyouPage,
  postConfirmCart,
  postCreateOrder,
  postDeleteCartDetailByID,
} from "../controllers/client/cart.controller";
import { getOrderHistoryPage } from "../controllers/admin/order.controller";
import { checkLogin } from "../middleware/auth";
import {
  getLoginPage,
  getRegisterPage,
  getSuccessLoginPage,
  handlePostLogin,
  postLogout,
  postRegister,
} from "../controllers/authentication.controller";
import { getChatPage } from "../controllers/client/chat.controller";
import { getViewProduct } from "../controllers/client/view.controller";
import { getResultPayment } from "../controllers/client/payment.controller";

const clientRouter = Router();

// CLIENT
clientRouter.get("/", getHomePage);
clientRouter.get("/product/:id", getProductPageClient);
clientRouter.get("/products", getProductsPage);

// Product (client)
clientRouter.post("/addProductToCart/:id", postAddProductToCart);
clientRouter.post(
  "/add-product-to-cart-with-quantity",
  postAddProductWithQuantity,
);
clientRouter.post("/addToCartFilter/:id", postAddToCartFilter);

// Cart (client)
clientRouter.get("/cart", getCartPage);
clientRouter.post("/deleteCartDetail/:id", postDeleteCartDetailByID);
clientRouter.get("/checkout", getCheckOutPage);
clientRouter.post("/confirm-cart", postConfirmCart);
clientRouter.post("/create-order", postCreateOrder);
clientRouter.get("/thankyou", getThankyouPage);
clientRouter.get("/order-history", getOrderHistoryPage);

// Chatbot (client)
clientRouter.get("/chat", getChatPage);

// 3D viewer
clientRouter.get("/viewProduct", getViewProduct);

// ONLINE PAYMENT
clientRouter.get("/vnpay-return", getResultPayment);

// Authentication
clientRouter.get("/login", checkLogin, getLoginPage);
clientRouter.post("/login", handlePostLogin);
clientRouter.get("/register", checkLogin, getRegisterPage);
clientRouter.post("/register", postRegister);
clientRouter.get("/successLoginPage", getSuccessLoginPage);
clientRouter.post("/logout", postLogout);

export default clientRouter;
