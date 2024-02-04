import { z } from 'zod';

const accountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  handle: z.string().min(4),
});

const createAccountAndProfileDtoSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  handle: z.string().min(4),
});

const createAccountDtoSchema = z.object({
  email: z.string().email(),
  handle: z.string().min(4),
});

type IAccount = z.infer<typeof accountSchema>;
type ICreateAccountDto = z.infer<typeof createAccountDtoSchema>;
type ICreateAccounAndProfileDto = z.infer<
  typeof createAccountAndProfileDtoSchema
>;

export {
  IAccount,
  accountSchema,
  ICreateAccountDto,
  createAccountDtoSchema,
  createAccountAndProfileDtoSchema,
  ICreateAccounAndProfileDto,
};
