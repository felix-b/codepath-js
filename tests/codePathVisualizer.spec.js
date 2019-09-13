import { createCodePathVisualModel } from '../src';

describe('CodePathVisualModel', () => {

  let model;
  let insertRowsFn;
  let removeRowsFn;

  beforeEach(() => {
    insertRowsFn = jest.fn();
    removeRowsFn = jest.fn();
    model = createCodePathVisualModel(insertRowsFn, removeRowsFn);
  });

  it('shows new root span entry', () => {
    const entry = {
      token: 'StartSpan',
      messageId: 123
    };

    model.publish([entry]);

    expect(insertRowsFn).toHaveBeenCalledTimes(1);
    expect(insertRowsFn).toHaveBeenCalledWith(0, [{ id: 1, entry }]);
  });

  it('does not show row for EndSpan token', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123 },
      { token: 'EndSpan' },
    ];

    model.publish(entries);

    expect(insertRowsFn).toHaveBeenCalledTimes(1);
    expect(insertRowsFn).toHaveBeenCalledWith(0, [
      { id: 1, entry: entries[0] },
    ]);
  });

  it('shows multiple root span entries', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123 },
      { token: 'EndSpan' },
      { token: 'StartSpan', messageId: 456 },
      { token: 'EndSpan' },
    ];

    model.publish(entries);

    expect(insertRowsFn).toHaveBeenCalledTimes(1);
    expect(insertRowsFn).toHaveBeenCalledWith(0, [
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[2] }
    ]);
  });

  it('does not show nested span under collapsed parent', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123 },
      { token: 'StartSpan', messageId: 456 },
      { token: 'EndSpan' },
      { token: 'EndSpan' },
    ];

    model.publish(entries);

    expect(insertRowsFn).toHaveBeenCalledTimes(1);
    expect(insertRowsFn).toHaveBeenCalledWith(1, [
      { id: 1, entry: entries[0] }
    ]);
  });

  it('can expand root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123 },
      { token: 'StartSpan', messageId: 456 },
      { token: 'EndSpan' },
      { token: 'EndSpan' },
    ];
    model.publish(entries);
    insertRowsFn.mockClear();

    model.expandRow(1);

    expect(insertRowsFn).toHaveBeenCalledTimes(1);
    expect(insertRowsFn).toHaveBeenCalledWith(1, [
      { id: 2, entry: entries[1] }
    ]);
  });

});
