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
  console.log(currentDate);
  var s =
    currentDate.getMonth() +
    1 +
    "/" +
    currentDate.getDate() +
    "/" +
    currentDate.getFullYear() +
    " " +
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes();
  console.log(s);

  let startDate, endDate;

  switch (period) {
    case "today":
      const currentDayStart = new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0
        )
      );
      const currentDayEnd = new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          23,
          59,
          59,
          999
        )
      );

      console.log("current day start:", currentDayStart);
      console.log("current day end:", currentDayEnd);

      startDate = currentDayStart;
      endDate = currentDayEnd;
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
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
          0,
          0,
          0,
          0
        )
      );
      const currentMonthEnd = new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
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
      let daysUntilNextMonday = (8 - currentDate.getDay()) % 7;
      startOfNextWeek.setDate(currentDate.getDate() + daysUntilNextMonday);
      startOfNextWeek.setUTCHours(0, 0, 0, 0);

      let endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      endOfNextWeek.setUTCHours(23, 59, 59, 999);

      console.log("Start of next week", startOfNextWeek);
      console.log("End of next week", endOfNextWeek);

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

export function convertUTCDateToLocalDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
}

export function convertLocalDateToUTCDate(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}
