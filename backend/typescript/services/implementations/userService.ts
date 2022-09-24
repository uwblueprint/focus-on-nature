import * as firebaseAdmin from "firebase-admin";

import IUserService from "../interfaces/userService";
import MgUser, { User } from "../../models/user.model";
import MgCampCoordinator, {
  CampCoordinator,
} from "../../models/campcoordinator.model";
import {
  CreateUserDTO,
  Role,
  UpdateUserDTO,
  UserDTO,
  CampCoordinatorDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

const getMongoUserByAuthId = async (authId: string): Promise<User> => {
  const user: User | null = await MgUser.findOne({ authId });
  if (!user) {
    throw new Error(`user with authId ${authId} not found.`);
  }
  return user;
};

class UserService implements IUserService {
  /* eslint-disable class-methods-use-this */
  async getUserById(userId: string): Promise<UserDTO> {
    let user: User | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      user = await MgUser.findById(userId);

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }

      firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: firebaseUser.email ?? "",
      role: user.role,
      active: user.active,
    };
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    let user: User | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      user = await MgUser.findOne({ authId: firebaseUser.uid });

      if (!user) {
        throw new Error(`userId with authId ${firebaseUser.uid} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: firebaseUser.email ?? "",
      role: user.role,
      active: user.active,
    };
  }

  async getUserRoleByAuthId(authId: string): Promise<Role> {
    try {
      const { role } = await getMongoUserByAuthId(authId);
      return role;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get user role. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getUserIdByAuthId(authId: string): Promise<string> {
    try {
      const { id } = await getMongoUserByAuthId(authId);
      return id;
    } catch (error: unknown) {
      Logger.error(`Failed to get user id. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getAuthIdById(userId: string): Promise<string> {
    try {
      const user = await MgUser.findById(userId);
      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      return user.authId;
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    const userDtos: Array<UserDTO> = [];

    try {
      const users: Array<User> = await MgUser.find();
      for (let i = 0; i < users.length; i += 1) {
        const user = users[i];
        let firebaseUser: firebaseAdmin.auth.UserRecord | undefined;
        try {
          // eslint-disable-next-line no-await-in-loop
          firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
        } catch (error) {
          Logger.error(
            `user with authId ${user.authId} could not be fetched from Firebase`,
          );
        }
        if (firebaseUser) {
          userDtos.push({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: firebaseUser.email ?? "",
            role: user.role,
            active: user.active,
          });
        }
      }
      return userDtos;
    } catch (error: unknown) {
      Logger.error(`Failed to get users. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return userDtos;
  }

  async createUser(user: CreateUserDTO, authId?: string): Promise<UserDTO> {
    let newUser: User;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      firebaseUser = await firebaseAdmin.auth().getUser(authId!);

      try {
        newUser = await MgUser.create({
          firstName: user.firstName,
          lastName: user.lastName,
          authId: firebaseUser.uid,
          email: firebaseUser.email,
          role: user.role,
          active: user.active,
          __t: "CampCoordinator",
        });
      } catch (mongoDbError) {
        // rollback user creation in Firebase
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: unknown) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after MongoDB user creation failure. Reason =",
            getErrorMessage(firebaseError),
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to create user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: firebaseUser.email ?? "",
      role: newUser.role,
      active: newUser.active,
    };
  }

  async updateUserById(
    userId: string,
    user: UpdateUserDTO,
  ): Promise<UserDTO | CampCoordinatorDTO> {
    let updatedUser: User | CampCoordinator | null;

    const oldUser = await MgUser.findById(userId); // getting the user to check their role

    if (!oldUser) {
      throw new Error(`userId ${userId} not found before update.`);
    }

    try {
      // update roles
      if (user.role && user.role !== oldUser.role) {
        if (user.role === "CampCoordinator") {
          await MgUser.findByIdAndUpdate(userId, {
            $set: {
              __t: "CampCoordinator",
            },
          });
        } else if (user.role === "Admin") {
          await MgCampCoordinator.findByIdAndUpdate(userId, {
            $unset: {
              __t: "CampCoordinator",
              campSessions: (oldUser as CampCoordinator).campSessions,
            },
          });
        } else {
          throw new Error(`${user.role} is not a valid role.`);
        }
      }

      // must explicitly specify runValidators when updating through findByIdAndUpdate

      if (
        (user.role && user.role === "CampCoordinator") ||
        (!user.role && oldUser.role === "CampCoordinator")
      ) {
        updatedUser = await MgCampCoordinator.findByIdAndUpdate(
          { _id: userId, __t: "CampCoordinator" },
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            active: user.active,
            campSessions: user.campSessions,
          },
          { runValidators: true },
        );
      } else if (
        (user.role && user.role === "Admin") ||
        (!user.role && oldUser.role === "Admin")
      ) {
        updatedUser = await MgUser.findByIdAndUpdate(
          userId,
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            active: user.active,
          },
          { runValidators: true },
        );
      } else {
        throw new Error(`userId ${userId} does not have a valid role.`);
      }

      if (!updatedUser) {
        throw new Error(`userId ${userId} not found after update.`);
      }

      if (user.email) {
        try {
          await firebaseAdmin
            .auth()
            .updateUser(oldUser.authId, { email: user.email });
        } catch (error) {
          // rollback MongoDB user updates
          try {
            // revert role updates
            if (user.role && user.role !== oldUser.role) {
              if (user.role === "CampCoordinator") {
                await MgCampCoordinator.findByIdAndUpdate(userId, {
                  $unset: {
                    __t: "CampCoordinator",
                    campSessions: user.campSessions,
                  },
                });
              } else {
                await MgUser.findByIdAndUpdate(userId, {
                  $set: {
                    __t: "CampCoordinator",
                  },
                });
              }
            }
            // revert other updates
            if (oldUser.role === "CampCoordinator") {
              await MgCampCoordinator.findByIdAndUpdate(
                { _id: userId, __t: "CampCoordinator" },
                {
                  firstName: oldUser.firstName,
                  lastName: oldUser.lastName,
                  email: oldUser.email,
                  role: oldUser.role,
                  active: oldUser.active,
                  campSessions: (oldUser as CampCoordinator).campSessions,
                },
                { runValidators: true },
              );
            } else {
              await MgUser.findByIdAndUpdate(
                userId,
                {
                  firstName: oldUser.firstName,
                  lastName: oldUser.lastName,
                  email: oldUser.email,
                  role: oldUser.role,
                  active: oldUser.active,
                },
                { runValidators: true },
              );
            }
          } catch (mongoDbError: unknown) {
            const errorMessage = [
              "Failed to rollback MongoDB user update after Firebase user update failure. Reason =",
              getErrorMessage(mongoDbError),
              "MongoDB user id with possibly inconsistent data =",
              oldUser.id,
            ];
            Logger.error(errorMessage.join(" "));
          }

          throw error;
        }
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    if (
      (user.role && user.role === "CampCoordinator") ||
      (!user.role && oldUser.role === "CampCoordinator")
    ) {
      return {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        active: user.active,
        campSessions: user.campSessions,
      };
    }
    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      active: user.active,
    };
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      const deletedUser: User | null = await MgUser.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw new Error(`userId ${userId} not found.`);
      }

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error) {
        // rollback user deletion in MongoDB
        try {
          await MgUser.create({
            firstName: deletedUser.firstName,
            lastName: deletedUser.lastName,
            authId: deletedUser.authId,
            role: deletedUser.role,
            active: deletedUser.active,
          });
        } catch (mongoDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(mongoDbError),
            "Firebase uid with non-existent MongoDB record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const firebaseUser: firebaseAdmin.auth.UserRecord = await firebaseAdmin
        .auth()
        .getUserByEmail(email);
      const deletedUser: User | null = await MgUser.findOneAndDelete({
        authId: firebaseUser.uid,
      });

      if (!deletedUser) {
        throw new Error(`authId (Firebase uid) ${firebaseUser.uid} not found.`);
      }

      try {
        await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
      } catch (error) {
        try {
          // rollback user deletion in MongoDB
          await MgUser.create({
            firstName: deletedUser.firstName,
            lastName: deletedUser.lastName,
            authId: deletedUser.authId,
            role: deletedUser.role,
            active: deletedUser.active,
          });
        } catch (mongoDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(mongoDbError),
            "Firebase uid with non-existent MongoDB record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default UserService;
