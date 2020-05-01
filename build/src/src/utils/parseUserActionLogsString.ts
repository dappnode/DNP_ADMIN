import { UserActionLogWithCount } from "types";

/**
 * Parse a stringified userActions logs string
 * @param userActionLogsString
 */
export function parseUserActionLogsString(
  userActionLogsString: string
): UserActionLogWithCount[] {
  if (typeof userActionLogsString !== "string")
    throw Error(
      `userActionLogsString must be a string: ${JSON.stringify(
        userActionLogsString
      )}`
    );

  // Process userActionLogs. They are json objects appended in a log file
  let userActionLogs: UserActionLogWithCount[] = [];
  userActionLogsString
    .trim()
    .split(/\r?\n/)
    .filter(s => s.trim())
    .forEach((stringifiedLog, i) => {
      try {
        userActionLogs.push(JSON.parse(stringifiedLog));
      } catch (e) {
        console.warn(
          `Error parsing userActionLog #${i}: ${e.message}. StringifiedLog: `,
          stringifiedLog
        );
      }
    });

  console.log({ userActionLogs });

  // Collapse equal errors
  for (let i = 0; i < userActionLogs.length; i++) {
    const log = userActionLogs[i];
    const logNext = userActionLogs[i + 1];
    if (log && logNext) {
      if (
        log.level === logNext.level &&
        log.event === logNext.event &&
        log.message === logNext.message &&
        log.stack === logNext.stack
      ) {
        log.count ? log.count++ : (log.count = 2);
        userActionLogs.splice(i + 1, 1);
        // Go one step back to keep aggregating on the same index
        i--;
      }
    }
  }

  // Order by newest first
  return userActionLogs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
