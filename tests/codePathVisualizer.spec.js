import { createCodePathVisualModel } from '../src';

describe('CodePathVisualModel', () => {

  let model;
  let showRowsFn;
  let hideRowsFn;

  beforeEach(() => {
    showRowsFn = jest.fn();
    hideRowsFn = jest.fn();
    model = createCodePathVisualModel(showRowsFn, hideRowsFn);
  });

  it('shows new root span entry', () => {
    const entry = {
      token: 'StartSpan',
      messageId: 123
    };

    model.pushEntries([entry]);

    expect(showRowsFn).toHaveBeenCalledTimes(1);
    expect(showRowsFn).toHaveBeenCalledWith(0, [entry]);
  });

  it('does not show row for EndSpan token', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123 },
      { token: 'EndSpan' },
    ];

    model.pushEntries(entries);

    expect(showRowsFn).toHaveBeenCalledTimes(1);
    expect(showRowsFn).toHaveBeenCalledWith(0, [
      entries[0],
    ]);
  });

  it('shows multiple root span entries', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123 },
      { token: 'EndSpan' },
      { token: 'StartSpan', messageId: 456 },
      { token: 'EndSpan' },
    ];

    model.pushEntries(entries);

    expect(showRowsFn).toHaveBeenCalledTimes(1);
    expect(showRowsFn).toHaveBeenCalledWith(0, [
      entries[0],
      entries[2]
    ]);
  });

});
