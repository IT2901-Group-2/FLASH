import { makeGlobal } from "@/lib/utils/makeGlobal";
import { DatabaseService, dbService } from "./databaseService";
import { CreateUser, EventCode, eventCodeTable, User, userTable } from "@/db";
import { setEventCookie, getEventCookie } from "@/lib/utils/eventCookie";
import { AsyncResult, Result } from "typescript-result";
import { eq } from "drizzle-orm";
import { getFirstRow } from "@/lib/utils/sql";
import { JWT_SECRET } from "@/config";

export class UserService {
  private readonly dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  /**
   * Fetches an `EventCode` object from an event code.
   * The `EventCode` contains all necessary information for joining an event.
   *
   * @param code The code to fetch the `EventCode` object for.
   * @returns A result with an `EventCode` object or an error.
   */
  private getEventByCode(code: string): AsyncResult<EventCode, Error> {
    return Result.try(() =>
      this.dbService.db
        .select()
        .from(eventCodeTable)
        .where(eq(eventCodeTable.code, code))
        .limit(1)
    ).map(rows => getFirstRow(rows, `Unable to find event with code: ${code}`));
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
      const eventCode = yield* this.getEventByCode(userData.eventCode);

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

export const userService = makeGlobal("userService", () => new UserService(dbService));
