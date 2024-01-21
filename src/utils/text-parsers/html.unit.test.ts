import { selections } from '../tests/mocks/selection';
import { htmlToPlainText } from './html';

describe('test-parser: html ', () => {
  it('converts a sample html text', () => {
    const result = htmlToPlainText(selections[0]!.rawText);
    expect(result).toBe(selections[0]!.text);
  });

  it('should throw an error when sending an object instead of string', () => {
    expect(() =>
      htmlToPlainText([12, 234, 4324, { thisis: false }] as unknown as string)
    ).toThrow('Could not convert the given html text to plain text');
  });
});
