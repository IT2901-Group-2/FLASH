import { makeGlobal } from "@/lib/utils/makeGlobal";
import { DatabaseService, dbService } from "./databaseService";
import { CreateUser, EventCode, User, userTable } from "@/db";
import { setEventCookie, getEventCookie } from "@/lib/utils/eventCookie";
import { AsyncResult, Result } from "typescript-result";
import { getFirstRow } from "@/lib/utils/sql";
import { JWT_SECRET } from "@/config";
import { EventService, eventService } from "./eventService";

export class UserService {
  private readonly dbService: DatabaseService;
  private readonly eventService: EventService;

  constructor(dbService: DatabaseService, eventService: EventService) {
    this.dbService = dbService;
    this.eventService = eventService;
  }

  /**
   * Creates and returns a new user session in the database.
   *
   * @param eventCode An `EventCode` object contianing information about which event to join.
   * @param data The data of the new user to be created.
   * @returns A result with the newly created user session or an error.
   */
  private createUser(
    { eventId, isModerator }: EventCode,
    { name }: CreateUser
  ): AsyncResult<User, Error> {
    return Result.try(() =>
      this.dbService.db
        .insert(userTable)
        .values({ eventId, name, isModerator })
        .returning()
    )
      .map(rows => getFirstRow(rows, "Unable to create user"))
      .onSuccess(() => this.dbService.flush());
  }

  /**
   * Joins the event specified by the provided eventCode with the correct permissions.
   *
   * @param userData The data of the new user to be created.
   * @returns A result with the id of the joined event or an error.
   */
  joinEvent(userData: CreateUser): AsyncResult<string, Error> {
    return Result.gen(this, async function* () {
      const eventCode = yield* this.eventService.getEventByCode(userData.eventCode);

      const cookieResult = await getEventCookie(eventCode.eventId, JWT_SECRET);
      if (cookieResult.ok) {
        return eventCode.eventId;
      }

      const user = yield* this.createUser(eventCode, userData);
      yield* setEventCookie(user, JWT_SECRET);

      return eventCode.eventId;
    });
  }
}

export const userService = makeGlobal(
  "userService",
  () => new UserService(dbService, eventService)
);
