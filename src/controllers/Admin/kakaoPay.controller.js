import { StatusCodes } from "http-status-codes";
import { MyFurCart } from "../../models/my-furCart/myFurCart.model.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables!");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class StripeController {
  static createCheckoutSession = async (req, res) => {
    try {
      const { orderId, userId, checkImg } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(orderId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid orderId or userId!" });
      }

      const orderData = await MyFurCart.findOne({
        "order.order_id": orderId,
      }).populate("order.OrderItems.product");

      if (!orderData || !orderData.order || orderData.order.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Order not found or empty!",
        });
      }

      const paymentMethod = orderData.paymentMethod;

      if (paymentMethod === "CASH") {
        if (!checkImg) {
          return res.status(400).json({
            success: false,
            message: "checkImg is required for CASH payment!",
          });
        }

        return res.status(200).json({
          success: true,
          message:
            "Cash payment method selected, order is pending manual confirmation.",
          data: { checkImg },
        });
      }

      if (checkImg) {
        return res.status(400).json({
          success: false,
          message: "checkImg is only allowed for CASH payment!",
        });
      }

      if (paymentMethod === "CARD" || paymentMethod === "VISA") {
        if (
          !orderData.order[0].OrderItems ||
          orderData.order[0].OrderItems.length === 0
        ) {
          return res
            .status(400)
            .json({ success: false, message: "Order items not found!" });
        }

        let totalAmount = 0;
        const shippingCost =
          orderData.shippingMethod === "FEDEX" ? 15 * 100 : 0; // 15$ ni sentga o'tkazamiz (Stripe sent bilan ishlaydi)

        const lineItems = orderData.order[0].OrderItems.map((item) => {
          let unitAmount = item.totalCost * 100; // Stripe uchun sentga o‘tkazish

          if (isNaN(unitAmount) || unitAmount <= 0) {
            console.error(
              `Invalid unit amount for product ${item.product.Feature}:`,
              unitAmount
            );
            return null;
          }

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.product.Feature,
                description: item.product.description,
                images: [item.product.image],
              },
              unit_amount: unitAmount / item.quantity, // **Har bir mahsulot narxi to‘g‘ri hisoblanishi uchun**
            },
            quantity: item.quantity,
          };
        }).filter(Boolean);

        if (lineItems.length === 0) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid line items!" });
        }

        // Shipping costni qo'shamiz
        if (shippingCost > 0) {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: "Shipping Fee (FEDEX)",
                description: "Fixed shipping cost for FEDEX",
              },
              unit_amount: shippingCost,
            },
            quantity: 1,
          });
        }

        totalAmount += shippingCost; // Umumiy summaga shipping qo‘shish

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: "http://localhost:3000/order",
          cancel_url: "http://localhost:3000/",
        });
        return res.status(200).json({ success: true, url: session.url });
      }

      return res
        .status(400)
        .json({ success: false, message: "Invalid payment method!" });
    } catch (error) {
      console.error("Checkout Error:", error);
      res.status(500).json({
        success: false,
        message: "Checkout session creation failed",
        error: error.message,
      });
    }
  };

  static getUserSessions = async (req, res) => {
    try {
      const { sessionId } = req.params; // faqat sessionId ni olish

      if (!sessionId) {
        return res
          .status(400)
          .json({ success: false, message: "sessionId is required!" });
      }

      // Stripe API orqali sessiyani tekshirish
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (!session) {
        return res
          .status(404)
          .json({ success: false, message: "Session not found!" });
      }

      return res.status(200).json({ success: true, session });
    } catch (error) {
      console.error("Error fetching session:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving session",
        error: error.message,
      });
    }
  };
}

// export class KakaoPayController {
//   static createPayment1 = asyncHandler(async (req, res) => {
//     try {
//       const { userId, orderId } = req.body;

//       if (!mongoose.Types.ObjectId.isValid(orderId)) {
//         return res
//           .status(StatusCodes.BAD_REQUEST)
//           .json({ success: false, message: "Invalid orderId!" });
//       }

//       const order = await MyFurCart.findById(orderId);
//       console.log("Order:", order);  // Order'ni tekshirib chiqing
//       if (!order || order.subTotalCost <= 0) {
//         return res
//           .status(StatusCodes.NOT_FOUND)
//           .json({ success: false, message: "Order not found or total cost is invalid!" });
//       }

//       const totalAmount = order.subTotalCost;

//       // Kakao Pay API'ga so‘rov yuboramiz
//       const kakaoResponse = await axios.post(
//         KAKAO_PAY_API,
//         {
//           cid: "TC0ONETIME",
//           partner_order_id: orderId,
//           partner_user_id: userId,
//           item_name: "Furniture Order",
//           quantity: 1,
//           total_amount: totalAmount,
//           vat_amount: 0,
//           tax_free_amount: 0,
//           approval_url: "http://localhost:5000/api/payment/success",
//           cancel_url: "http://localhost:5000/api/payment/cancel",
//           fail_url: "http://localhost:5000/api/payment/fail",
//         },
//         {
//           headers: {
//             Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
//             "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
//           },
//         }
//       );

//       // To‘lovni saqlaymiz
//       const newPayment = new Payment({
//         user: userId,
//         order: orderId,
//         status: "PENDING",
//         amount: totalAmount,
//         kakaoTid: kakaoResponse.data.tid,
//         kakaoRedirectUrl: kakaoResponse.data.next_redirect_pc_url,
//       });

//       await newPayment.save();

//       res.status(StatusCodes.OK).json({
//         success: true,
//         message: "Payment created successfully",
//         redirectUrl: kakaoResponse.data.next_redirect_pc_url,
//       });
//     } catch (error) {
//       console.error("Payment error:", error);
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Internal Server Error",
//         error: error.response ? error.response.data : error.message,
//       });
//     }
//   });

//   static createPayment = asyncHandler(async (req, res) => {
//     try {
//       const { userId, orderId } = req.body;

//       // orderId validligini tekshirish
//       if (!mongoose.Types.ObjectId.isValid(orderId)) {
//         return res
//           .status(StatusCodes.BAD_REQUEST)
//           .json({ success: false, message: "Invalid orderId!" });
//       }
//       console.log("Order:", orderId);

//       const order = await MyFurCart.findOne({ 'order.order_id': orderId });

//       if (!order) {
//         return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Order not found!" });
//       }

//       const orderDetails = order.order.find(o => o.order_id.toString() === orderId);

//       if (!orderDetails || orderDetails.subTotalCost <= 0) {
//         return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Invalid order total cost!" });
//       }

//       const totalAmount = orderDetails.subTotalCost;

//       // Kakao Pay API'ga so'rov yuborish
//       const kakaoResponse = await axios.post(
//         KAKAO_PAY_API,
//         {
//           cid: "TC0ONETIME",
//           partner_order_id: orderId,
//           partner_user_id: userId,
//           item_name: "Furniture Order",
//           quantity: 1,
//           total_amount: totalAmount,
//           vat_amount: 0,
//           tax_free_amount: 0,
//           approval_url: "https://a72f-119-18-121-75.ngrok-free.app/api/payment/success",
//           cancel_url: "https://a72f-119-18-121-75.ngrok-free.app/api/payment/cancel",
//           fail_url: "https://a72f-119-18-121-75.ngrok-free.app/api/payment/fail",
//         },
//         {
//           headers: {
//             Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
//             "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
//           },
//         }
//       );

//       // To'lovni saqlash
//       const newPayment = new Payment({
//         user: userId,
//         order: orderId,
//         status: "PENDING",
//         amount: totalAmount,
//         kakaoTid: kakaoResponse.data.tid,
//         kakaoRedirectUrl: kakaoResponse.data.next_redirect_pc_url,
//       });

//       await newPayment.save();

//       // Muvaffaqiyatli javob
//       res.status(StatusCodes.OK).json({
//         success: true,
//         message: "Payment created successfully",
//         redirectUrl: kakaoResponse.data.next_redirect_pc_url,
//       });
//     } catch (error) {
//       console.error("Payment error:", error);
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Internal Server Error",
//         error: error.response ? error.response.data : error.message,
//       });
//     }
//   });
// }
