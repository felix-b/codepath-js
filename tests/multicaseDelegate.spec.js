import { createMulticastDelegate } from '../src/multicastDelegate';

describe('MulticastDelegate', () => {

  it('is initially empty', () => {
    const delegate = createMulticastDelegate('test1');
    delegate.invoke(123, 'abc');
  });

  it('can invoke single subscriber', () => {
    const delegate = createMulticastDelegate('test1');
    const subscriber = jest.fn();

    delegate.add(subscriber);
    delegate.invoke(123, 'abc');

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(123, 'abc');
  });

  it('can invoke multiple subscribers', () => {
    const delegate = createMulticastDelegate('test1');
    const subscriber1 = jest.fn();
    const subscriber2 = jest.fn();

    delegate.add(subscriber1);
    delegate.add(subscriber2);
    
    delegate.invoke(123, 'abc');

    expect(subscriber1).toHaveBeenCalledTimes(1);
    expect(subscriber1).toHaveBeenCalledWith(123, 'abc');

    expect(subscriber2).toHaveBeenCalledTimes(1);
    expect(subscriber2).toHaveBeenCalledWith(123, 'abc');
  });

  it('can remove existing subscriber', () => {
    const delegate = createMulticastDelegate('test1');
    const subscriber1 = jest.fn();
    const subscriber2 = jest.fn();
    const subscriber3 = jest.fn();

    delegate.add(subscriber1);
    delegate.add(subscriber2);
    delegate.add(subscriber3);
    delegate.remove(subscriber2);
    
    delegate.invoke(123, 'abc');

    expect(subscriber1).toHaveBeenCalledTimes(1);
    expect(subscriber1).toHaveBeenCalledWith(123, 'abc');

    expect(subscriber2).toHaveBeenCalledTimes(0);

    expect(subscriber3).toHaveBeenCalledTimes(1);
    expect(subscriber3).toHaveBeenCalledWith(123, 'abc');
  });

  it('can catch subscriber errors', () => {
    const delegate = createMulticastDelegate('test1');
    const subscriber1 = jest.fn().mockImplementation(() => {
      throw new Error('TEST1');
    });
    const subscriber2 = jest.fn();

    delegate.add(subscriber1);
    delegate.add(subscriber2);
    
    delegate.invoke(123, 'abc');

    expect(subscriber1).toHaveBeenCalledTimes(1);
    expect(subscriber1).toHaveBeenCalledWith(123, 'abc');

    expect(subscriber2).toHaveBeenCalledTimes(1);
    expect(subscriber2).toHaveBeenCalledWith(123, 'abc');
  });

})