import { AppError } from "../err/errorHandler";

export const parsePaginationParams = (
  offset: string | undefined,
  limit: string | undefined
) => {
  const skipValue = offset ? parseInt(offset, 10) : 0;
  if (isNaN(skipValue)) {
    throw new AppError("Offset must be a number", 400);
  }

  const takeValue = limit ? parseInt(limit, 10) : 10;
  if (isNaN(takeValue)) {
    throw new AppError("Limit must be a number", 400);
  }

  return { skipValue, takeValue };
};
