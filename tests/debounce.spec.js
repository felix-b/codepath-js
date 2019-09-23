import { createDebounce } from '../src/debounce';
import { createTestClock } from './testClock';

describe('debounce', () => {

  it('should not fire consumer right away', () => {
    const clock = createTestClock(100);
    const consumer = jest.fn();
    const debounce = createDebounce(consumer, 200, clock);

    expect(consumer).not.toHaveBeenCalled();
  });

  it('should not fire consumer if no events bounced', () => {
    const clock = createTestClock(100);
    const consumer = jest.fn();
    const debounce = createDebounce(consumer, 200, clock);

    clock.testSetTime(299).testExecuteTimers();
    expect(consumer).not.toHaveBeenCalled();

    clock.testSetTime(301).testExecuteTimers();
    expect(consumer).not.toHaveBeenCalled();
  });

  it('should not fire consumer within interval when events bounced', () => {
    const clock = createTestClock(100);
    const consumer = jest.fn();
    const debounce = createDebounce(consumer, 200, clock);

    clock.testSetTime(200);
    debounce.bounce();
    clock.testExecuteTimers();
    expect(consumer).not.toHaveBeenCalled();

    clock.testSetTime(250);
    debounce.bounce();
    clock.testExecuteTimers();
    expect(consumer).not.toHaveBeenCalled();

    clock.testSetTime(299);
    debounce.bounce();
    clock.testExecuteTimers();
    expect(consumer).not.toHaveBeenCalled();
  });

  it('should fire consumer once after interval elapses since last bounced event', () => {
    const clock = createTestClock(100);
    const consumer = jest.fn();
    const debounce = createDebounce(consumer, 200, clock);

    clock.testSetTime(200);
    debounce.bounce();
    clock.testExecuteTimers();

    clock.testSetTime(250);
    debounce.bounce();
    clock.testExecuteTimers();

    clock.testSetTime(299);
    debounce.bounce();
    clock.testExecuteTimers();

    expect(consumer).toHaveBeenCalledTimes(0);

    clock.testSetTime(300).testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(0);

    clock.testSetTime(498).testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(0);

    clock.testSetTime(499).testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(1);

    clock.testSetTime(699).testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(1);
  });

  it('should fire consumer once after interval when event bounced after a long delay', () => {
    const clock = createTestClock(100);
    const consumer = jest.fn();
    const debounce = createDebounce(consumer, 200, clock);

    clock.testSetTime(200);
    debounce.bounce();
    clock.testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(0);

    clock.testSetTime(600).testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(1);

    clock.testSetTime(10000);
    debounce.bounce();
    clock.testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(1);

    clock.testSetTime(10010);
    debounce.bounce();
    clock.testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(1);

    clock.testSetTime(10209).testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(1);

    clock.testSetTime(10210).testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(2);

    clock.testSetTime(10400).testExecuteTimers();
    expect(consumer).toHaveBeenCalledTimes(2);
  });

});
