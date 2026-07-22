// Run with: npm run seed
// Creates Nursita's founder & lead instructor account (Vineeta Rani) if it
// doesn't already exist, plus one sample course so the platform isn't empty
// on first run. Safe to re-run — it won't create duplicates.
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";

dotenv.config();

const FOUNDER = {
  name: "Vineeta Rani",
  email: "vineeta@nursita.com",
  password: "ChangeMe123!", // change this after first login
  role: "instructor",
};

const run = async () => {
  await connectDB();

  let founder = await User.findOne({ email: FOUNDER.email });
  if (!founder) {
    founder = await User.create(FOUNDER);
    console.log(`Created founder account: ${founder.email} (password: ${FOUNDER.password})`);
  } else {
    console.log(`Founder account already exists: ${founder.email}`);
  }

  const existingCourse = await Course.findOne({ instructor: founder._id });
  if (!existingCourse) {
    await Course.create({
      title: "Fundamentals of Nursing",
      description:
        "Core concepts every nursing student starts with — patient care basics, vital signs, hygiene and safety — taught live with notes and DPP after every class.",
      subject: "Fundamentals of Nursing",
      instructor: founder._id,
      price: 0,
      published: true,
    });
    console.log("Created starter course under the founder account.");
  }

  console.log("Seed complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
