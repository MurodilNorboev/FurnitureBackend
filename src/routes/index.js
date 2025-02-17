import { API_CONSTANTS } from "../constants/api.constant.js";
import { UploadRouter } from "./upload/upload.router.js";
import { router as UserRouter } from "./user/user.route.js";
import { router as UserFurRouter } from "./Admin/admin.users.js";
import { router as FurnitureRouter } from "./Admin/products.router.js";
import { router as ProductsRouter } from "./Admin/products.router.js";
import { router as OrderRouter } from "./Admin/order.router.js";
import { router as PaymentRouter } from "./Admin/kakaoPay.router.js";
import { router as ChatRouter } from "./Chat/chat.router.js";
import { router as CheckoutRouter } from "./Admin/checkout.router.js";
import { router as LikesRouter } from "./LIkes/likes.router.js";

export const Routes = [
  { path: API_CONSTANTS.USER, router: UserRouter },
  { path: API_CONSTANTS.UPLOAD, router: UploadRouter },
  { path: API_CONSTANTS.USERFUR, router: UserFurRouter },
  { path: API_CONSTANTS.SESSIONUSER, router: FurnitureRouter },
  { path: API_CONSTANTS.PRODUCTS, router: ProductsRouter },
  { path: API_CONSTANTS.CHAT, router: ChatRouter },
  { path: API_CONSTANTS.ORDER, router: OrderRouter },
  { path: API_CONSTANTS.PAYMENT, router: PaymentRouter},
  { path: API_CONSTANTS.CHECKOUT, router: CheckoutRouter },
  { path: API_CONSTANTS.LIKES, router: LikesRouter },
];
