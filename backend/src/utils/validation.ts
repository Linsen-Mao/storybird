import Joi from "joi";
import { Role, Status } from "@prisma/client";

//TODO register needed？
export const userSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  id: Joi.string(),
  password: Joi.string(),
  phone: Joi.string(),
  licensePlateNumber: Joi.array().items(Joi.string()),
  role: Joi.string().valid(...Object.values(Role)),
  status: Joi.string().valid(...Object.values(Status)),
});
