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

  private getEventByCode(code: string): AsyncResult<EventCode, Error> {
    return Result.try(() =>
      this.dbService.db
        .select()
        .from(eventCodeTable)
        .where(eq(eventCodeTable.code, code))
        .limit(1)
    ).map(rows => getFirstRow(rows, `Unable to find event with code: ${code}`));
  }

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
