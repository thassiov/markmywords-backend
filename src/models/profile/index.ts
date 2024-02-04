import { z } from 'zod';

const profileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  handle: z.string().min(4),
});

type IProfile = z.infer<typeof profileSchema>;

export { IProfile, profileSchema };
