import { z } from 'zod';

const selectionSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string().min(1),
  rawText: z.string().min(1),
  url: z.string().url(),
});

const getSelectionDtoSchema = selectionSchema;
const createSelectionDtoSchema = selectionSchema.extend({
  text: z.string().min(1).optional(),
});

type ISelection = z.infer<typeof selectionSchema>;
type IGetSelectionDto = z.infer<typeof getSelectionDtoSchema>;
type ICreateSelectionDto = z.infer<typeof createSelectionDtoSchema>;

class SelectionDto {
  static modelToGetSelection(selection: ISelection): IGetSelectionDto {
    return {
      id: selection.id ?? undefined,
      text: selection.text,
      rawText: selection.rawText,
      url: selection.url,
    };
  }

  static getSelectionDtoToModel(selection: IGetSelectionDto): ISelection {
    return {
      id: selection.id ?? undefined,
      text: selection.text,
      rawText: selection.rawText,
      url: selection.url,
    };
  }

  static createSelectionDtoToModel(selection: ICreateSelectionDto): ISelection {
    return {
      text: selection.text || '',
      rawText: selection.rawText,
      url: selection.url,
    };
  }
}

export {
  selectionSchema,
  getSelectionDtoSchema,
  createSelectionDtoSchema,
  IGetSelectionDto,
  ICreateSelectionDto,
  ISelection,
  SelectionDto,
};
