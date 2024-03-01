import { FastifyRequest } from "fastify";
import { fastifyServer } from "../server";

function getFirstDayOfWeek(d: any) {
  // 👇️ clone date object, so we don't mutate it
  const date = new Date(d);
  const day = date.getDay(); // 👉️ get day of week

  // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(date.setDate(diff));
}

export function getTimeFrame(period: string) {
  const currentDate = new Date();
  let startDate, endDate;

  switch (period) {
    case "today":
      const currentDayStartInUTC = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          0,
          0,
          0
        )
      );
      const currentDayEndInUTC = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      console.log("current day start:", currentDayStartInUTC);
      console.log("current day end:", currentDayEndInUTC);

      startDate = currentDayStartInUTC;
      endDate = currentDayEndInUTC;
      break;
    case "week":
      const firstDayOfCurrentWeek = getFirstDayOfWeek(new Date());
      firstDayOfCurrentWeek.setUTCHours(0, 0, 0, 0);
      const lastDayOfCurrentWeek = new Date(firstDayOfCurrentWeek);
      lastDayOfCurrentWeek.setUTCHours(23, 59, 59, 999);
      lastDayOfCurrentWeek.setDate(lastDayOfCurrentWeek.getDate() + 6);

      console.log("first day of current week:", firstDayOfCurrentWeek);
      console.log("last day of current week:", lastDayOfCurrentWeek);

      startDate = firstDayOfCurrentWeek;
      endDate = lastDayOfCurrentWeek;
      break;
    case "month":
      const currentMonthStart = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          1,
          0,
          0,
          0,
          0
        )
      );
      const currentMonthEnd = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth() + 1,
          0,
          23,
          59,
          59,
          999
        )
      );

      console.log("current month start:", currentMonthStart);
      console.log("current month end:", currentMonthEnd);

      startDate = currentMonthStart;
      endDate = currentMonthEnd;
      break;
    case "nextWeek":
      let startOfNextWeek = new Date(currentDate);
      let daysUntilNextMonday = (8 - currentDate.getUTCDay()) % 7;
      startOfNextWeek.setUTCDate(
        currentDate.getUTCDate() + daysUntilNextMonday
      );
      startOfNextWeek.setUTCHours(0, 0, 0, 0);

      let endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setUTCDate(startOfNextWeek.getUTCDate() + 6);
      endOfNextWeek.setUTCHours(23, 59, 59, 999);

      console.log("Start of next week (UTC):", startOfNextWeek);
      console.log("End of next week (UTC):", endOfNextWeek);

      startDate = startOfNextWeek;
      endDate = endOfNextWeek;
      break;
    default:
      break;
  }

  return { startDate, endDate };
}

export async function getCurrentSessionData(request: FastifyRequest) {
  const { redis } = fastifyServer;
  const currentCookie = request.cookieData;
  const currentSessionValue = JSON.parse(
    (await redis.sessionRedis.get(`sessionId:${currentCookie.value}`)) ?? "null"
  );

  return currentSessionValue;
}
