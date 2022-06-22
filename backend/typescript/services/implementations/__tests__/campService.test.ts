import db from "../../../testUtils/testDb";
import CampService from "../campService";
import {
  CreateCampDTO,
  CreateCampSessionsDTO,
  CreateFormQuestionsDTO,
  UpdateCampSessionDTO,
  UpdateCampDTO,
  CampDTO,
} from "../../../types";
import MgCampSession from "../../../models/campSession.model";
import MgCamp from "../../../models/camp.model";
import MgFormQuestion from "../../../models/formQuestion.model";
import FileStorageService from "../fileStorageService";
import IFileStorageService from "../../interfaces/fileStorageService";

const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const fileStorageService: IFileStorageService = new FileStorageService(
  defaultBucket,
);

const testCamps: CreateCampDTO[] = [
  {
    active: false,
    ageLower: 15,
    ageUpper: 30,
    name: "test camp",
    description: "description",
    location: {
      streetAddress1: "123 Focus on Nature Avenue",
      city: "Guelph",
      province: "Ontario",
      postalCode: "M1A 3G3",
    },
    fee: 25,
    campSessions: [],
    formQuestions: [],
    campCoordinators: ["61fb3d34272ea0002ad6a24d"],
    campCounsellors: ["61fb3d34272ea0002ad6a24d"],
    earlyDropoff: "12:30",
    latePickup: "2:30",
    startTime: "6:49",
    endTime: "16:09",
    volunteers: ["jason"],
  },
  {
    active: true,
    ageLower: 30,
    ageUpper: 50,
    name: "test camp2",
    description: "description2",
    location: {
      streetAddress1: "123 Focus on Nature Avenue",
      city: "Guelph",
      province: "Ontario",
      postalCode: "M1A 3G3",
    },
    fee: 24,
    campSessions: [],
    formQuestions: [],
    campCoordinators: ["61fb3d34272ea0002ad6a24d"],
    campCounsellors: ["61fb3d34272ea0002ad6a24d"],
    earlyDropoff: "12:30",
    latePickup: "2:30",
    startTime: "6:49",
    endTime: "16:09",
    volunteers: ["jason"],
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

  it("registerCamp", async () => {
    const testCamp: CreateCampDTO = {
      active: false,
      ageLower: 15,
      ageUpper: 30,
      campCoordinators: ["61fb3d34272ea0002ad6a24d"],
      campCounsellors: ["61fb3d34272ea0002ad6a24d"],
      earlyDropoff: "12:30",
      latePickup: "2:30",
      name: "test camp",
      description: "description",
      location: "canada",
      fee: 25,
      formQuestions: [],
      campSessions: [],
      startTime: "6:49",
      endTime: "16:09",
      volunteers: ["jason"],
    };

    const testCampSessions: CreateCampSessionsDTO = [
      {
        capacity: 20,
        dates: ["Sun Mar 13 2022 20:01:14 GMT-0600 (Mountain Daylight Time)"],
      },
      {
        capacity: 20,
        dates: [
          new Date(2023, 1, 2),
          new Date(2023, 1, 3),
          new Date(2023, 1, 4),
          new Date(2023, 1, 5),
          new Date(2023, 1, 6),
        ].map((date) => date.toString()),
      },
      {
        capacity: 20,
        dates: [new Date(2023, 1, 7), new Date(2023, 1, 8)].map((date) =>
          date.toString(),
        ),
      },
    ];

    // const testFormQuestions: CreateFormQuestionsDTO = [
    //   {
    //     type: "Multiselect",
    //     question: "Why beans",
    //     required: true,
    //     description: "Good question",
    //     options: ["Yes", "Bread"],
    //   },
    // ];

    // Step 1: Create camp with basic details
    const res = await campService.createCamp(testCamp);
    const camp = await MgCamp.findById(res.id).exec();
    expect(camp?.active).toEqual(testCamp.active);
    expect(camp?.ageLower).toEqual(testCamp.ageLower);
    expect(camp?.ageUpper).toEqual(testCamp.ageUpper);
    expect(camp?.name).toEqual(testCamp.name);
    expect(camp?.description).toEqual(testCamp.description);
    expect(camp?.location).toEqual(testCamp.location);
    expect(camp?.fee).toEqual(testCamp.fee);
    expect(camp?.startTime).toEqual(testCamp.startTime);
    expect(camp?.endTime).toEqual(testCamp.endTime);
    expect(camp?.active).toEqual(testCamp.active);
    expect(
      camp?.campCoordinators.map((coordinator) => coordinator.toString()),
    ).toEqual(testCamp.campCoordinators);
    expect(
      camp?.campCounsellors.map((counsellor) => counsellor.toString()),
    ).toEqual(testCamp.campCounsellors);
    expect(camp?.earlyDropoff).toEqual(testCamp.earlyDropoff);
    expect(camp?.latePickup).toEqual(testCamp.latePickup);

    // Step 2: Add Camp Sessions
    const campSessions = await campService.createCampSessions(
      res.id,
      testCampSessions,
    );

    for (let i = 0; i < campSessions.length; i += 1) {
      const campSession = campSessions[i];
      expect(campSession.camp.toString()).toEqual(res.id);
      expect(campSession.dates.map((date) => new Date(date))).toEqual(
        testCampSessions[i].dates.map((date) => new Date(date)),
      );
      expect(campSession.capacity).toEqual(testCampSessions[i].capacity);
      expect(campSession.campers).toHaveLength(0);
      expect(campSession.waitlist).toHaveLength(0);
    }

    // TODO: Step 3: Add form questions :eyes
  });

  it("updateCampSession", async () => {
    const testCamp: CreateCampDTO = {
      active: false,
      ageLower: 15,
      ageUpper: 30,
      campCoordinators: ["61fb3d34272ea0002ad6a24d"],
      campCounsellors: ["61fb3d34272ea0002ad6a24d"],
      earlyDropoff: "12:30",
      latePickup: "2:30",
      name: "test camp",
      description: "description",
      location: "canada",
      fee: 25,
      formQuestions: [],
      campSessions: [],
      startTime: "6:49",
      endTime: "16:09",
      volunteers: ["jason"],
    };

    const testCampSessions: CreateCampSessionsDTO = [
      {
        capacity: 20,
        dates: ["Sun Mar 13 2022 20:01:14 GMT-0600 (Mountain Daylight Time)"],
      },
    ];

    const updatedTestCampSession: UpdateCampSessionDTO = {
      capacity: 30,
      dates: [
        new Date(2023, 1, 2),
        new Date(2023, 1, 3),
        new Date(2023, 1, 4),
        new Date(2023, 1, 5),
        new Date(2023, 1, 6),
      ].map((date) => date.toString()),
    };

    // Create camp with basic details
    const res = await campService.createCamp(testCamp);

    // Add campSession
    const resCampSessions = await campService.createCampSessions(
      res.id,
      testCampSessions,
    );

    await campService.updateCampSessionById(
      res.id,
      resCampSessions[0].id,
      updatedTestCampSession,
    );

    const campSession = await MgCampSession.findById(resCampSessions[0].id);

    expect(campSession?.camp.toString()).toEqual(res.id);
    expect(campSession?.dates.map((date) => new Date(date))).toEqual(
      updatedTestCampSession.dates.map((date) => new Date(date)),
    );
    expect(campSession?.capacity).toEqual(updatedTestCampSession.capacity);
    expect(campSession?.campers).toHaveLength(0);
    expect(campSession?.waitlist).toHaveLength(0);
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
        expect(campSession.capacity).toEqual(testCamp.campSessions[i].capacity);
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
      expect(res.name).toEqual(testCamp.name);
      expect(res.description).toEqual(testCamp.description);
      expect(res.location).toEqual(testCamp.location);
      expect(res.fee).toEqual(testCamp.fee);
      expect(res.startTime).toEqual(testCamp.startTime);
      expect(res.endTime).toEqual(testCamp.endTime);
      expect(res.active).toEqual(testCamp.active);
      expect(res.campCoordinators).toEqual(testCamp.campCoordinators);
      expect(res.campCounsellors).toEqual(testCamp.campCounsellors);
      expect(res.earlyDropoff).toEqual(testCamp.earlyDropoff);
      expect(res.latePickup).toEqual(testCamp.latePickup);
    }
  });

  it("updateCamp", async () => {
    const testCamp: CreateCampDTO = {
      active: false,
      ageLower: 15,
      ageUpper: 30,
      campCoordinators: ["61fb3d34272ea0002ad6a24d"],
      campCounsellors: ["61fb3d34272ea0002ad6a24d"],
      earlyDropoff: "12:30",
      latePickup: "2:30",
      name: "test camp",
      description: "description",
      location: "canada",
      fee: 25,
      formQuestions: [],
      campSessions: [],
      startTime: "6:49",
      endTime: "16:09",
      volunteers: ["jason"],
    };

    const updatedTestCamp: UpdateCampDTO = {
      active: true,
      ageLower: 15,
      ageUpper: 30,
      campCoordinators: [],
      campCounsellors: [],
      earlyDropoff: "2:30",
      latePickup: "8:30",
      name: "ab",
      description: "ba",
      location: "ca",
      fee: 50,
      startTime: "8:49",
      endTime: "12:09",
      volunteers: ["jason", "elon"],
    };

    // create camp
    const res = await campService.createCamp(testCamp);

    await campService.updateCampById(res.id, updatedTestCamp);

    // TODO (jason): would be nice to have a generic "validateCamp" function instead of hardcoding fields
    const camp = await MgCamp.findById(res.id);
    expect(camp?.active).toEqual(updatedTestCamp.active);
    expect(camp?.ageLower).toEqual(updatedTestCamp.ageLower);
    expect(camp?.ageUpper).toEqual(updatedTestCamp.ageUpper);
    expect(camp?.name).toEqual(updatedTestCamp.name);
    expect(camp?.description).toEqual(updatedTestCamp.description);
    expect(camp?.location).toEqual(updatedTestCamp.location);
    expect(camp?.fee).toEqual(updatedTestCamp.fee);
    expect(camp?.startTime).toEqual(updatedTestCamp.startTime);
    expect(camp?.endTime).toEqual(updatedTestCamp.endTime);
    expect(camp?.active).toEqual(updatedTestCamp.active);
    expect(
      camp?.campCoordinators.map((coordinator) => coordinator.toString()),
    ).toEqual(updatedTestCamp.campCoordinators);
    expect(
      camp?.campCounsellors.map((counsellor) => counsellor.toString()),
    ).toEqual(updatedTestCamp.campCounsellors);
    expect(camp?.earlyDropoff).toEqual(updatedTestCamp.earlyDropoff);
    expect(camp?.latePickup).toEqual(updatedTestCamp.latePickup);
  });

  it("deleteCamp", async () => {
    // add camp
    const res = await campService.createCamp({
      active: true,
      ageLower: 5,
      ageUpper: 12,
      name: "Test Camp",
      description: "description",
      location: "Canada",
      fee: 7,
      campCoordinators: [],
      campCounsellors: [],
      earlyDropoff: "14:00",
      latePickup: "19:00",
      startTime: "15:00",
      endTime: "18:00",
      formQuestions: [
        {
          type: "Text",
          question: "how is it going",
          required: true,
          description: "asdfasdf",
        },
        {
          type: "Text",
          question: "Hi",
          required: true,
          description: "Description",
        },
      ],
      campSessions: [
        {
          capacity: 12,
          dates: ["December 17, 1995 03:24:00"],
        },
      ],
      volunteers: [],
    });

    const camp = await MgCamp.findById(res.id).exec();
    expect(camp).toBeInstanceOf(MgCamp); // make sure not null
    expect(res.campSessions).toHaveLength(1);
    expect(res.formQuestions).toHaveLength(2);

    // delete camp
    await campService.deleteCamp(res.id);

    const deletedCamp = await MgCamp.findById(res.id).exec();
    const deletedCampSession = await MgCampSession.findById(
      res.campSessions[0],
    );
    const deletedFirstFormQuestion = await MgFormQuestion.findById(
      res.formQuestions[0],
    );
    const deletedSecondFormQuestion = await MgFormQuestion.findById(
      res.formQuestions[1],
    );
    expect(deletedCamp).toBeNull(); // make sure deleted
    expect(deletedCampSession).toBeNull();
    expect(deletedFirstFormQuestion).toBeNull();
    expect(deletedSecondFormQuestion).toBeNull();
  });
});
