import { makeGlobal } from "@/lib/utils/makeGlobal";
import { DatabaseService, dbService } from "./databaseService";
import { CreateUser, EventCode, eventCodeTable, User, userTable } from "@/db";
import { AsyncResult, Result } from "typescript-result";
import { cookies } from "next/headers";
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

  joinEvent(code: string, userData: CreateUser): AsyncResult<EventCode, Error> {
    return Result.genCatching(this, async function* () {
      const eventCode = yield* this.getEventByCode(code);

      // TODO: Check if user is already logged in

      const user = yield* this.createUser(eventCode, userData);

      const cookieStore = await cookies();

      // TODO: Make JWT
      cookieStore.set(
        `event-${eventCode.eventId}`,
        JSON.stringify({ name: user.name, isModerator: eventCode.isModerator })
      );

      return eventCode;
    });
  }
}

export const userService = makeGlobal("userService", () => new UserService(dbService));
