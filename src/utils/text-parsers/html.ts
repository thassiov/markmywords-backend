import { convert } from 'html-to-text';

import { SelectionDataConversionError } from '../errors';

function htmlToPlainText(htmlString: string): string {
  try {
    const converted = convert(htmlString, { wordwrap: false });
    return converted;
  } catch (error) {
    throw new SelectionDataConversionError(
      'Could not convert the given html text to plain text',
      {
        cause: error as Error,
        details: {
          htmlString,
          convertionType: 'html-plain',
        },
      }
    );
  }
}

export { htmlToPlainText };
