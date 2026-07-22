import Razorpay from "razorpay";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// 1. Create Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    const options = {
      amount: Math.round(course.price * 100), // Amount in paise (e.g., ₹500 = 50000)
      currency: "INR",
      receipt: `receipt_course_${courseId}`,
      notes: {
        userId: req.user._id.toString(),
        courseId: courseId.toString(),
      },
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Verify Payment & Grant Enrollment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Signature is authentic, enroll the user
      const alreadyEnrolled = await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
      });

      if (!alreadyEnrolled) {
        await Enrollment.create({
          user: req.user._id,
          course: courseId,
        });
      }

      return res.json({ success: true, message: "Payment verified and course unlocked!" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};