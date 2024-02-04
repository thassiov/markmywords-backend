import { z } from 'zod';

const accountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

type IAccount = z.infer<typeof accountSchema>;

export { IAccount, accountSchema };
