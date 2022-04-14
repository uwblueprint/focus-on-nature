import db from "../../../testUtils/testDb";
import CampService from "../campService";
import { CreateCampDTO, QuestionType } from "../../../types";
import MgCampSession from "../../../models/campSession.model";
import MgFormQuestion from "../../../models/formQuestion.model";
import FileStorageService from "../../implementations/fileStorageService";
import IFileStorageService from "../../interfaces/fileStorageService";

const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const fileStorageService: IFileStorageService = new FileStorageService(
  defaultBucket,
);

const testCamps: CreateCampDTO[] = [
  {
    ageLower: 15,
    ageUpper: 30,
    name: "test camp",
    description: "description",
    location: "canada",
    capacity: 20,
    fee: 25,
    campSessions: [
      {
        active: true,
        startTime: "12:00",
        endTime: "17:00",
        dates: ["Sun Mar 13 2022 20:01:14 GMT-0600 (Mountain Daylight Time)"],
      },
    ],
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
    ageLower: 30,
    ageUpper: 50,
    name: "test camp2",
    description: "description2",
    location: "canada",
    capacity: 500,
    fee: 24,
    campSessions: [
      {
        active: true,
        startTime: "1:00",
        endTime: "2:00",
        dates: [new Date().toString()],
      },
    ],
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
    campService = new CampService(fileStorageService);
  });

  afterEach(async () => {
    await db.clear();
  });

  it("createCamp", async () => {
    /* eslint-disable no-restricted-syntax */
    for (const testCamp of testCamps) {
      /* eslint-disable no-await-in-loop */
      const res = await campService.createCamp(testCamp);
      const campSessions = await MgCampSession.find({
        _id: { $in: res.campSessions },
      });
      const formQuestions = await MgFormQuestion.find({
        _id: { $in: res.formQuestions },
      });

      for (let i = 0; i < campSessions.length; i += 1) {
        const campSession = campSessions[i];
        expect(campSession.camp.toString()).toEqual(res.id);
        expect(campSession.dates.map((date) => new Date(date))).toEqual(
          testCamp.campSessions[i].dates.map((date) => new Date(date)),
        );
        expect(campSession.startTime).toEqual(
          testCamp.campSessions[i].startTime,
        );
        expect(campSession.endTime).toEqual(testCamp.campSessions[i].endTime);
        expect(campSession.active).toEqual(testCamp.campSessions[i].active);
        expect(campSession.campers).toHaveLength(0);
        expect(campSession.waitlist).toHaveLength(0);
      }

      for (let i = 0; i < formQuestions.length; i += 1) {
        const formQuestion = formQuestions[i];

        expect(formQuestion.type).toEqual(testCamp.formQuestions[i].type);
        expect(formQuestion.question).toEqual(
          testCamp.formQuestions[i].question,
        );
        expect(formQuestion.required).toEqual(
          testCamp.formQuestions[i].required,
        );
        expect(formQuestion.description).toEqual(
          testCamp.formQuestions[i].description,
        );
        const testOptions = testCamp.formQuestions[i].options;
        if (testOptions) {
          expect(formQuestion.options).toHaveLength(testOptions.length);
          if (formQuestion.options) {
            for (let j = 0; j < formQuestion?.options?.length; j += 1) {
              const option = formQuestion?.options[j];
              if (testOptions) expect(option).toEqual(testOptions[j]);
            }
          }
        }
      }

      expect(res.ageLower).toEqual(testCamp.ageLower);
      expect(res.ageUpper).toEqual(testCamp.ageUpper);
      expect(res.capacity).toEqual(testCamp.capacity);
      expect(res.name).toEqual(testCamp.name);
      expect(res.description).toEqual(testCamp.description);
      expect(res.location).toEqual(testCamp.location);
      expect(res.fee).toEqual(testCamp.fee);
    }
  });
});
