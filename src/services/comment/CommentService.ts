import { ICreateCommentDto } from '../../models/comment';
import { CommentRepository } from '../../repositories/comment';
import {
  ApplicationError,
  ErrorMessages,
  ServiceError,
} from '../../utils/errors';
import { SelectionService } from '../selection';

class CommentService {
  constructor(
    private readonly repository: CommentRepository,
    private readonly selectionService: SelectionService
  ) {}

  async create(commmentDto: ICreateCommentDto): Promise<string> {
    try {
      // @NOTE there's no need to check for user as the middleware already does it
      // @NOTE maybe this verification should be done in a middleware as well
      if (!(await this.selectionService.retrieve(commmentDto.selectionId))) {
        throw new ApplicationError(ErrorMessages.SELECTION_NOT_FOUND, {
          details: { input: commmentDto },
        });
      }

      const commentId = await this.repository.create(commmentDto);

      return commentId;
    } catch (error) {
      throw new ServiceError('Could not create new comment', {
        cause: error as Error,
        details: {
          service: 'comment',
          input: commmentDto,
        },
      });
    }
  }
}

export { CommentService };
