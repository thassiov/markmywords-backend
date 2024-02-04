import { z } from 'zod';

const profileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  accountId: z.string().uuid(),
});

const createProfileDto = z.object({
  name: z.string().min(1),
  accountId: z.string().uuid(),
});

type IProfile = z.infer<typeof profileSchema>;
type ICreateProfileDto = z.infer<typeof createProfileDto>;

export { IProfile, profileSchema, ICreateProfileDto, createProfileDto };
