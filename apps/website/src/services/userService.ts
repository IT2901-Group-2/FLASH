import { makeGlobal } from "@/lib/utils/makeGlobal";
import { DatabaseService, dbService } from "./databaseService";
import { CreateUser } from "@/db";
import { AsyncResult, Result } from "typescript-result";

export class UserService {
  private readonly dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  joinEvent(code: string, user: CreateUser): AsyncResult<void, Error> {
    return Result.try(async () => {});
  }
}

export const userService = makeGlobal("userService", () => new UserService(dbService));
