import mongoose from "mongoose";
import camperModel from "./camper.model";

/* eslint-disable-next-line import/prefer-default-export */
export const mongo = {
  connect: (): void => {
    mongoose.connect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      encodeURI(process.env.MG_DATABASE_URL!),
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      },
      (error) => {
        if (error) {
          /* eslint-disable-next-line no-console */
          console.error(`Error connecting to MongoDB: ${error.message}`);
        } else {
          /* eslint-disable-next-line no-console */
          console.info("Successfully connected to MongoDB!");
        }
      },
    );
  },
};

let testId = new mongoose.Schema.Types.ObjectId("61fb4407241fcd00721d4846");
camperModel.createCollection();
camperModel.create({
  id: "test123",
  firstName: "testFirstname",
  lastName: "testLastname",
  age: 100,
  parentName: "testParent",
  contactEmail: "test@test.com",
  contactNumber: "11111",
  camps: ["61fb4407241fcd00721d4846"],
  hasCamera: true,
  hasLaptop: false,
  allergies: "",
  additionalDetails: "test",
  dropOffType: "LatePickUp",
  registrationDate: new Date(),
  hasPaid: false,
  charge_id: 123,
});