import { StatusCodes } from "http-status-codes";
import { MyFurCart } from "../../models/my-furCart/myFurCart.model.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import moment from "moment";

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
        "order._id": orderId,
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

        const shippingCost =
          orderData.shippingMethod === "FEDEX" ? 15 * 100 : 0;
        const totalAmount = orderData.subTotalCost;

        const lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Total Order Cost",
                description: "Total amount for all order items",
              },
              unit_amount: totalAmount * 100,
            },
            quantity: 1,
          },
        ];

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

        // **Foydalanuvchini tekshiramiz**
        let userStripeData = await MyFurCart.findOne({
          user: new mongoose.Types.ObjectId(userId),
        });

        if (!userStripeData) {
          return res
            .status(400)
            .json({ success: false, message: "User not found!" });
        }

        let stripeCustomerId = userStripeData.stripeCustomerId;

        if (!stripeCustomerId) {
          // **Stripe-da yangi mijoz yaratamiz**
          const customer = await stripe.customers.create({
            email: userStripeData.email,
            name: userStripeData.userFullName,
          });

          stripeCustomerId = customer.id;

          // **Yangi Stripe mijoz ID sini bazaga saqlaymiz (order.OrderItems ichidagi har bir item uchun ham)**
          await MyFurCart.updateOne(
            { user: new mongoose.Types.ObjectId(userId) },
            {
              $set: {
                stripeCustomerId: stripeCustomerId,
                "order.$[].OrderItems.$[].stripeCustomerId": stripeCustomerId,
              },
            }
          );
        }

        // **Stripe sessiyasini yaratamiz**
        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
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

  static getPurchasedOrders = async (req, res) => {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid userId!" });
      }

      const userStripeData = await MyFurCart.findOne({
        user: new mongoose.Types.ObjectId(userId),
      });

      if (!userStripeData) {
        return res
          .status(404)
          .json({ success: false, message: "User not found in MyFurCart!" });
      }

      let stripeCustomerId = userStripeData.stripeCustomerId;

      if (!stripeCustomerId) {
        return res.status(400).json({
          success: false,
          message: "Stripe customer ID not found in MyFurCart!",
        });
      }

      // Stripe orqali sotib olingan buyurtmalarni olish
      const stripeOrders = await stripe.checkout.sessions.list({
        customer: stripeCustomerId,
      });

      // Mahalliy bazadan foydalanuvchining barcha buyurtmalarini olish va kerakli OrderItems ni olish
      const userOrders = await MyFurCart.find({
        user: new mongoose.Types.ObjectId(userId),
        "order.OrderItems.stripeCustomerId": stripeCustomerId, // Faqat shu stripeCustomerId ga mos buyurtmalar
      }).populate("order.OrderItems.product");
      // Stripe sessiyalariga mos buyurtmalarni qo‘shish
      const enrichedOrders = stripeOrders.data.map((session) => {
        const relatedOrder = userOrders.find(
          (order) =>
            order.order.some((o) => o.stripeCustomerId === session.customer) // Stripe session ID ni tekshirish
        );
        const product = userOrders.filter(
          (order) => order.stripeCustomerId === session.customer
        );
        console.log(product);

        if (!relatedOrder) {
          return {
            id: session.id,
            amount_total: session.amount_total,
            currency: session.currency,
            payment_status: session.payment_status,
            success_url: session.success_url,
            status: session.status,
            customer_details: session.customer_details,
            products: product,
          };
        }
        return {
          id: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
          success_url: session.success_url,
          status: session.status,
          customer_details: session.customer_details,
          products: relatedOrder
            ? relatedOrder.order.flatMap((o) =>
                o.OrderItems.filter(
                  (item) => item.stripeCustomerId === stripeCustomerId
                ) // Faqat shu stripeCustomerId ga tegishli OrderItems
                  .map((item) => ({
                    _id: item.product._id,
                    item_id: item.item_id, // `item_id`ni yuborish
                    categories: item.product.categories,
                    types: item.product.types,
                    Feature: item.product.Feature,
                    SubCategories: item.product.SubCategories,
                    StockNumber: item.product.StockNumber,
                    SpecialOffers: item.product.SpecialOffers,
                    desc1: item.product.desc1,
                    Color: item.product.Color,
                    ColorSet: item.product.ColorSet,
                    Styles: item.product.Styles,
                    image: item.product.image,
                    image1: item.product.image1,
                    image2: item.product.image2,
                    image3: item.product.image3,
                    image4: item.product.image4,
                    videos1: item.product.videos1,
                    description: item.product.description,
                    minWidth: item.product.minWidth,
                    maxWidth: item.product.maxWidth,
                    minHeight: item.product.minHeight,
                    maxHeight: item.product.maxHeight,
                    ArmDimensions_HWD: item.product.ArmDimensions_HWD,
                    SeatDimensions_HWD: item.product.SeatDimensions_HWD,
                    LegHeight_CM: item.product.LegHeight_CM,
                    PackagingDimensions: item.product.PackagingDimensions,
                    Weight_KG: item.product.Weight_KG,
                    Assembly: item.product.Assembly,
                    material: item.product.material,
                    NumberOfSeats: item.product.NumberOfSeats,
                    CaringInstructions: item.product.CaringInstructions,
                    cost: item.product.cost,
                    bigCost: item.product.bigCost,
                    discount: item.product.discount,
                    count: item.count,
                    sana: item.product.sana,
                    yangilanish: item.product.yangilanish,
                  }))
              )
            : [],
        };
      });

      return res.status(200).json({ success: true, data: enrichedOrders });
    } catch (error) {
      console.error("Error fetching purchased orders:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };

  static getOrderList = async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      const orders = await MyFurCart.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setFullYear(currentYear - 1)),
            },
          },
        },
        {
          $project: {
            createdAt: 1,
            totalItemsCount: { $size: "$order" },
            orderItemsCount: {
              $sum: {
                $map: {
                  input: "$order",
                  as: "order",
                  in: { $size: "$$order.OrderItems" },
                },
              },
            },
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
        },
        {
          $group: {
            _id: { year: "$year", month: "$month", day: "$day" },
            totalOrders: { $sum: 1 },
            totalItems: { $sum: "$totalItemsCount" },
            totalOrderItems: { $sum: "$orderItemsCount" },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
      ]);

      const result = {
        totalOrders: orders.length,
        totalItems: orders.reduce((acc, o) => acc + o.totalItems, 0),
        totalOrderItems: orders.reduce((acc, o) => acc + o.totalOrderItems, 0),
        totalItemsMonth: orders.reduce((acc, o) => acc + o.totalItems, 0),
        totalOrderItemsMonth: orders.reduce(
          (acc, o) => acc + o.totalOrderItems,
          0
        ),
        days: Array.from({ length: 31 }, (_, i) => ({
          day: i + 1,
          totalItems:
            orders
              .filter((o) => o._id.day === i + 1)
              .reduce((sum, o) => sum + o.totalItems, 0) || 0,
          totalOrderItems:
            orders
              .filter((o) => o._id.day === i + 1)
              .reduce((sum, o) => sum + o.totalOrderItems, 0) || 0,
          totalItemsDay:
            orders
              .filter((o) => o._id.day === i + 1)
              .reduce((sum, o) => sum + o.totalItems, 0) || 0,
          totalOrderItemsDay:
            orders
              .filter((o) => o._id.day === i + 1)
              .reduce((sum, o) => sum + o.totalOrderItems, 0) || 0,
        })),
        year: currentYear,
        month: currentMonth,
      };

      return res.status(StatusCodes.OK).json({ success: true, data: [result] });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: "Ichki server xatosi",
          error: error.message,
        });
    }
  };
}

// export class StripeController1 {
//   static createCheckoutSession = async (req, res) => {
//     try {
//       const { orderId, userId, checkImg } = req.body;

//       if (
//         !mongoose.Types.ObjectId.isValid(orderId) ||
//         !mongoose.Types.ObjectId.isValid(userId)
//       ) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Invalid orderId or userId!" });
//       }

//       const orderData = await MyFurCart.findOne({
//         "order._id": orderId,
//       }).populate("order.OrderItems.product");

//       if (!orderData || !orderData.order || orderData.order.length === 0) {
//         return res.status(StatusCodes.NOT_FOUND).json({
//           success: false,
//           message: "Order not found or empty!",
//         });
//       }

//       const paymentMethod = orderData.paymentMethod;

//       if (paymentMethod === "CASH") {
//         if (!checkImg) {
//           return res.status(400).json({
//             success: false,
//             message: "checkImg is required for CASH payment!",
//           });
//         }

//         return res.status(200).json({
//           success: true,
//           message:
//             "Cash payment method selected, order is pending manual confirmation.",
//           data: { checkImg },
//         });
//       }

//       if (checkImg) {
//         return res.status(400).json({
//           success: false,
//           message: "checkImg is only allowed for CASH payment!",
//         });
//       }

//       if (paymentMethod === "CARD" || paymentMethod === "VISA") {
//         if (
//           !orderData.order[0].OrderItems ||
//           orderData.order[0].OrderItems.length === 0
//         ) {
//           return res
//             .status(400)
//             .json({ success: false, message: "Order items not found!" });
//         }

//         const shippingCost =
//           orderData.shippingMethod === "FEDEX" ? 15 * 100 : 0; // 15$ ni sentga o'tkazamiz

//         // ✅ **ASOSIY XATONI TUZATDIK**
//         const totalAmount = orderData.subTotalCost; // Umumiy narxni olib qo‘yish

//         const lineItems = [
//           {
//             price_data: {
//               currency: "usd",
//               product_data: {
//                 name: "Total Order Cost",
//                 description: "Total amount for all order items",
//               },
//               unit_amount: totalAmount * 100, // Stripe uchun sentga o‘tkazish
//             },
//             quantity: 1, // Barcha buyurtmalar uchun bitta umumiy qiymat
//           },
//         ];

//         // **Shipping costni qo‘shish**
//         if (shippingCost > 0) {
//           lineItems.push({
//             price_data: {
//               currency: "usd",
//               product_data: {
//                 name: "Shipping Fee (FEDEX)",
//                 description: "Fixed shipping cost for FEDEX",
//               },
//               unit_amount: shippingCost,
//             },
//             quantity: 1,
//           });
//         }

//         const userStripeId = await MyFurCart.findOne({
//           user: new mongoose.Types.ObjectId(userId),
//         });
//         const session = await stripe.checkout.sessions.create({
//           customer_email: userStripeId.email, // Bu mijozga yangi Stripe ID yaratadi
//           payment_method_types: ["card"],
//           line_items: lineItems,
//           mode: "payment",
//           success_url: "http://localhost:3000/order",
//           cancel_url: "http://localhost:3000/",
//         });

//         return res.status(200).json({ success: true, url: session.url });
//       }

//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid payment method!" });
//     } catch (error) {
//       console.error("Checkout Error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Checkout session creation failed",
//         error: error.message,
//       });
//     }
//   };

//   static getPurchasedOrders = async (req, res) => {
//     const { userId } = req.params;
//     try {
//       console.log("User ID:", userId);

//       // userId ni ObjectId formatga o‘tkazish
//       const userStripeId = await MyFurCart.findOne({
//         user: new mongoose.Types.ObjectId(userId),
//       });

//       console.log("MyFurCart Query Result:", userStripeId);

//       // Agar topilmasa
//       if (!userStripeId) {
//         return res.status(404).json({
//           success: false,
//           message: `User with ID ${userId} not found in MyFurCart collection.`,
//         });
//       }

//       // Stripe Customer ID ni har xil nomlar bilan tekshiramiz
//       const stripeCustomerId =
//         userStripeId.stripeCustomerId ||
//         userStripeId.customerId ||
//         (userStripeId.paymentInfo
//           ? userStripeId.paymentInfo.stripeId
//           : undefined);

//       console.log("Stripe Customer ID:", stripeCustomerId);

//       if (!stripeCustomerId) {
//         return res.status(400).json({
//           success: false,
//           message: "Stripe customer ID not found in MyFurCart!",
//         });
//       }

//       // Stripe'dan buyurtmalarni olish
//       const orders = await stripe.checkout.sessions.list({
//         customer: stripeCustomerId, // Stripe customer ID
//       });

//       res.status(200).json({ success: true, data: orders.data });
//     } catch (error) {
//       console.error("Error fetching purchased orders:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//         error: error.message,
//       });
//     }
//   };
// }

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
