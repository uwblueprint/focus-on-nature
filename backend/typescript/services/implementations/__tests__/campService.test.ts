import db from "../../../testUtils/testDb";
import CampService from "../campService";
import { QuestionType } from "../../../types";

const testCamps = [
  {
    active: true,
    ageLower: 15,
    ageUpper: 30,
    name: "test camp",
    description: "description",
    location: "canada",
    capacity: 20,
    startTime: "12:00",
    endTime: "17:00",
    dates: ["Sun Mar 13 2022 20:01:14 GMT-0600 (Mountain Daylight Time)"],
    fee: 25,
    formQuestions: [
      {
        question: "Q1",
        type: "Multiselect" as QuestionType,
        required: true,
        description: "question description",
      },
    ],
  },
  {
    active: true,
    ageLower: 30,
    ageUpper: 50,
    name: "test camp2",
    description: "description2",
    location: "canada",
    capacity: 500,
    startTime: "1:00",
    endTime: "2:00",
    dates: [new Date().toString()],
    fee: 24,
    formQuestions: [
      {
        question: "Q1",
        type: "Text" as QuestionType,
        required: true,
        description: "question description2",
      },
    ],
  },
];

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
});

describe("mongo campService", (): void => {
  let campService: CampService;

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    campService = new CampService();
  });

  afterEach(async () => {
    await db.clear();
  });

  it("createCamp", async () => {
    testCamps.forEach(async (testCamp, i) => {
      const res = await campService.createCamp(testCamp);
      expect(res.capacity).toEqual(testCamp.capacity);
      expect(res.startTime).toEqual(testCamp.startTime);
      expect(res.endTime).toEqual(testCamp.endTime);
      expect(res.active).toEqual(testCamp.active);
      expect(res.campers).toEqual([]);
      expect(res.dates.map((date) => new Date(date))).toEqual(
        testCamp.dates.map((date) => new Date(date)),
      );
    });
  });
});
