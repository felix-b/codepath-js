import { createWatchTreeNode, createWatchModel } from "../src/watchModel";
import { createRootNode } from "../src/codePathModel";

describe("WatchModel", () => {
  let nextNodeId;
  let rootNode;

  const model = {
    takeNodeId() {
      return nextNodeId++;
    }
  };

  beforeEach(() => {
    rootNode = createRootNode();
    nextNodeId = 101;
  });

  describe("watch model", () => {

    it('is initially empty', () => {
      const model = createWatchModel();

      expect(
        model.getTopLevelNodes()
      ).toMatchObject([]);
    });

    it('can add watch', () => {
      const model = createWatchModel();
      
      model.addWatch({ num: 123, str: 'abc' }, 'num');

      const topLevelNodes = model.getTopLevelNodes();
      expect(topLevelNodes.length).toBe(1);
      expect(topLevelNodes[0].entry).toMatchObject({
        label: 'num',
        type: 'scalar',
        value: 123
      });
      expect(topLevelNodes[0].prevSibling).toBeUndefined();
      expect(topLevelNodes[0].nextSibling).toBeUndefined();
    });

    it('can add multiple watches', () => {
      const model = createWatchModel();
      const context = { num: 123, str: 'abc' };

      model.addWatch(context, 'num');
      model.addWatch(context, 'str');

      const topLevelNodes = model.getTopLevelNodes();
      expect(topLevelNodes.length).toBe(2);

      expect(topLevelNodes[0].prevSibling).toBeUndefined();
      expect(topLevelNodes[0].nextSibling).toBe(topLevelNodes[1]);
      expect(topLevelNodes[0].entry).toMatchObject({
        label: 'num',
        type: 'scalar',
        value: 123
      });

      expect(topLevelNodes[1].prevSibling).toBe(topLevelNodes[0]);
      expect(topLevelNodes[1].nextSibling).toBeUndefined();
      expect(topLevelNodes[1].entry).toMatchObject({
        label: 'str',
        type: 'scalar',
        value: 'abc'
      });
    });

    it('can remove watch', () => {
      const model = createWatchModel();
      const context = { num: 123, str: 'abc', flag: true };
      
      model.addWatch(context, 'num');
      const { id } = model.addWatch(context, 'flag');
      model.addWatch(context, 'str');

      model.removeWatchNode(id);

      const topLevelNodes = model.getTopLevelNodes();
      expect(topLevelNodes.length).toBe(2);

      expect(topLevelNodes[0].prevSibling).toBeUndefined();
      expect(topLevelNodes[0].nextSibling).toBe(topLevelNodes[1]);
      expect(topLevelNodes[0].entry).toMatchObject({
        label: 'num',
        type: 'scalar',
        value: 123
      });

      expect(topLevelNodes[1].prevSibling).toBe(topLevelNodes[0]);
      expect(topLevelNodes[1].nextSibling).toBeUndefined();
      expect(topLevelNodes[1].entry).toMatchObject({
        label: 'str',
        type: 'scalar',
        value: 'abc'
      });
    });

    it('can publish added watches', () => {
      const subscriber = {
        insertNodes: jest.fn()
      }
      const model = createWatchModel();
      
      model.subscribe(subscriber);
      model.addWatch({ num: 123, str: 'abc' }, 'num');

      const watchNode = model.getTopLevelNodes()[0];

      expect(subscriber.insertNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.insertNodes).toHaveBeenCalledWith([watchNode]);
    });

    it('can publish removed watches', () => {
      const subscriber = {
        removeNodes: jest.fn()
      }
      const model = createWatchModel();
      model.subscribe(subscriber);

      const context = { num: 123, str: 'abc' };
      model.addWatch(context, 'num');
      model.addWatch(context, 'str');
      
      const watchNodeToRemove = model.getTopLevelNodes()[1];
      model.removeWatchNode(2);

      expect(subscriber.removeNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.removeNodes).toHaveBeenCalledWith([watchNodeToRemove]);
    });

    it('can evaluate complex expressions', () => {
      const model = createWatchModel();
      const context = { num: 123, arr: [1, {x:111, y:222}, 3], flag: true };
      
      const node = model.addWatch(context, 'arr[1].x');

      expect(node.entry).toMatchObject({
        label: 'arr[1].x',
        type: 'scalar',
        value: 111
      });

    });

  });

  describe("scalar node", () => {

    const scalarTestValues = ["abc", true, false, 12345, null, undefined];

    scalarTestValues.forEach(value => 
      it('is initialized correctly', () => {

        const node = createWatchTreeNode(model, rootNode, 'testLabel', value);

        expect(node.id).toBe(101);
        expect(node.entry).toMatchObject({
          label: 'testLabel',
          type: 'scalar',
          value
        });
        expect(node.parent).toBe(rootNode);
        expect(node.firstChild).toBeUndefined();
        expect(node.lastChild).toBeUndefined();
      })
    );

  });

  describe("object node", () => {

    it('is initialized correctly for object', () => {
      const value = { num: 123, str: 'abc' };
      const node = createWatchTreeNode(model, rootNode, 'testLabel', value);

      expect(node.id).toBe(101);
      expect(node.parent).toBe(rootNode);
      expect(node.entry).toMatchObject({
        label: 'testLabel',
        type: 'object',
        value
      });

    });

    it('is initialized correctly for array', () => {

      const value = [1, 2, 3];
      const node = createWatchTreeNode(model, rootNode, 'testLabel', value);

      expect(node.id).toBe(101);
      expect(node.parent).toBe(rootNode);
      expect(node.entry).toMatchObject({
        label: 'testLabel',
        type: 'array',
        value
      });
    });

    it('can expand properties of object', () => {
      const value = { num: 123, str: 'abc' };
      const node = createWatchTreeNode(model, rootNode, 'testLabel', value);

      expect(node.firstChild).toMatchObject({
        entry: {
          type: 'scalar',
          label: 'num',
          value: 123
        },
        nextSibling: {
          entry: {
            type: 'scalar',
            label: 'str',
            value: 'abc'
          },
          nextSibling: undefined
        }
      });

      expect(node.lastChild).toBeDefined();
      expect(node.firstChild.prevSibling).toBeUndefined();
      expect(node.firstChild.nextSibling).toBe(node.lastChild);
      expect(node.lastChild.prevSibling).toBe(node.firstChild);
      expect(node.lastChild.nextSibling).toBeUndefined();
    });

    it('can expand items of array', () => {
      const value = [123, 'abc'];
      const node = createWatchTreeNode(model, rootNode, 'testLabel', value);

      expect(node.firstChild).toMatchObject({
        entry: {
          type: 'scalar',
          label: '[0]',
          value: 123
        },
        nextSibling: {
          entry: {
            type: 'scalar',
            label: '[1]',
            value: 'abc'
          },
          nextSibling: undefined
        }
      });

      expect(node.lastChild).toBeDefined();
      expect(node.firstChild.prevSibling).toBeUndefined();
      expect(node.firstChild.nextSibling).toBe(node.lastChild);
      expect(node.lastChild.prevSibling).toBe(node.firstChild);
      expect(node.lastChild.nextSibling).toBeUndefined();
    });

    it('does not expand items of empty array', () => {
      const value = [];
      const node = createWatchTreeNode(model, rootNode, 'testLabel', value);
  
      expect(node.firstChild).toBeUndefined();
      expect(node.lastChild).toBeUndefined();
    });
  
    it('does not expand properties of empty object', () => {
      const value = {};
      const node = createWatchTreeNode(model, rootNode, 'testLabel', value);
  
      expect(node.firstChild).toBeUndefined();
      expect(node.lastChild).toBeUndefined();
    });
  
  });

});

