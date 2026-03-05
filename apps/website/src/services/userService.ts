import { makeGlobal } from "@/lib/utils/makeGlobal";
import { DatabaseService, dbService } from "./databaseService";
import { CreateUser, EventCode, eventCodeTable, User, userTable } from "@/db";
import { setEventCookie, verifyEventCookie } from "@/lib/utils/eventCookie";
import { AsyncResult, Result } from "typescript-result";
import { eq } from "drizzle-orm";
import { getFirstRow } from "@/lib/utils/sql";

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

  joinEvent(code: string, userData: CreateUser): AsyncResult<User, Error> {
    return this.getEventByCode(code).map(eventCode =>
      verifyEventCookie(eventCode.eventId, "SUPER_SECRET_KEY").fold(
        () => Result.error(new Error()),
        () =>
          this.createUser(eventCode, userData).map(user =>
            setEventCookie(user, "SUPER_SECRET_KEY").map(() => user)
          )
      )
    );
  }
}

export const userService = makeGlobal("userService", () => new UserService(dbService));
