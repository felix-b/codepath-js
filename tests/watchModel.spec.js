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
      model.setContext({ num: 123, str: 'abc' });
      model.addWatch('num');

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
      model.setContext({ num: 123, str: 'abc' });

      model.addWatch('num');
      model.addWatch('str');

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
      model.setContext({ num: 123, str: 'abc', flag: true });
      
      model.addWatch('num');
      const { id } = model.addWatch('flag');
      model.addWatch('str');

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
      model.setContext({ num: 123, str: 'abc' });
      model.subscribe(subscriber);
      model.addWatch('num');

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

      model.setContext({ num: 123, str: 'abc' });
      model.addWatch('num');
      model.addWatch('str');
      
      const watchNodeToRemove = model.getTopLevelNodes()[1];
      model.removeWatchNode(2);

      expect(subscriber.removeNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.removeNodes).toHaveBeenCalledWith([watchNodeToRemove]);
    });

    it('can evaluate complex expressions', () => {
      const model = createWatchModel();
      model.setContext({ num: 123, arr: [1, {x:111, y:222}, 3], flag: true });
      
      const node = model.addWatch('arr[1].x');

      expect(node.entry).toMatchObject({
        label: 'arr[1].x',
        type: 'scalar',
        value: 111
      });

    });

  });

  describe('context updates', () => {

    let subscriber = undefined;

    beforeEach(() => {
      subscriber = {
        insertNodes: jest.fn(),
        updateNodes: jest.fn(),
        removeNodes: jest.fn(),
      };
    });

    const clearSubscriberCalls = () => {
      subscriber.insertNodes.mockClear();
      subscriber.updateNodes.mockClear();
      subscriber.removeNodes.mockClear();
    };

    const getSubNodesArray = (node) => {
      const subNodes = [];
      for (let child = node.firstChild ; !!child ; child = child.nextSibling) {
        subNodes.push(child);
      }
      return subNodes;
    };

    const unfoldProxyNodes = (model) => {
      const unfoldProxySubNodes = (node) => {
        const { entry } = node;
        for (let sub = node.firstChild ; !!sub ; sub = sub.nextSibling) {
          unfoldProxySubNodes(sub);
        }
      };
      model.getTopLevelNodes().forEach(unfoldProxySubNodes);
    }

    it('can update values of scalar top-level nodes', () => {
      const model = createWatchModel();
      model.setContext({ num: 123, str: 'abc' });
      model.subscribe(subscriber);
      model.addWatch('num');
      model.addWatch('str');
      const nodes = model.getTopLevelNodes();

      model.setContext({ num: 456, str: 'def' });

      expect(nodes[0].entry).toMatchObject({ label: 'num', type: 'scalar', value: 456 });
      expect(nodes[1].entry).toMatchObject({ label: 'str', type: 'scalar', value: 'def' });
    });

    it('can publish updates of scalar top-level nodes', () => {
      const model = createWatchModel();
      model.setContext({ num: 123, str: 'abc' });
      model.subscribe(subscriber);
      model.addWatch('num');
      model.addWatch('str');
      const nodes = model.getTopLevelNodes();
      clearSubscriberCalls();

      model.setContext({ num: 456, str: 'def' });

      expect(subscriber.updateNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.updateNodes).toHaveBeenCalledWith(nodes);
      expect(subscriber.insertNodes).not.toHaveBeenCalled();
      expect(subscriber.removeNodes).not.toHaveBeenCalled();
    });

    it('can update items of array top-level node', () => {
      const model = createWatchModel();
      model.setContext({ arr: [1, 2, 3] });
      model.addWatch('arr');
      model.subscribe(subscriber);
      unfoldProxyNodes(model);

      model.setContext({ arr: [4, 5, 6] });

      const itemNodes = getSubNodesArray(model.getTopLevelNodes()[0]);
      expect(itemNodes.length).toBe(3);
      expect(itemNodes[0].entry).toMatchObject({ label: '[0]', type: 'scalar', value: 4 });
      expect(itemNodes[1].entry).toMatchObject({ label: '[1]', type: 'scalar', value: 5 });
      expect(itemNodes[2].entry).toMatchObject({ label: '[2]', type: 'scalar', value: 6 });
    });

    it('can publish updates of array item nodes', () => {
      const model = createWatchModel();
      model.setContext({ arr: [1, 2, 3] });
      model.addWatch('arr');
      unfoldProxyNodes(model);
      const arrayNode = model.getTopLevelNodes()[0];
      const itemNodes = getSubNodesArray(arrayNode);

      model.subscribe(subscriber);
      model.setContext({ arr: [4, 5, 6] });

      expect(subscriber.updateNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.updateNodes).toHaveBeenCalledWith([arrayNode, ...itemNodes]);
      expect(subscriber.insertNodes).not.toHaveBeenCalled();
      expect(subscriber.removeNodes).not.toHaveBeenCalled();
    });

    it('can update array item nodes with items changed and added', () => {
      const model = createWatchModel();
      model.setContext({ arr: [1, 2] });
      model.addWatch('arr');
      unfoldProxyNodes(model);

      model.setContext({ arr: [3, 4, 5, 6] });

      const arrayNode = model.getTopLevelNodes()[0];
      const itemNodes = getSubNodesArray(arrayNode);
      expect(itemNodes.length).toBe(4);
      expect(itemNodes[0].entry).toMatchObject({ label: '[0]', type: 'scalar', value: 3 });
      expect(itemNodes[1].entry).toMatchObject({ label: '[1]', type: 'scalar', value: 4 });
      expect(itemNodes[2].entry).toMatchObject({ label: '[2]', type: 'scalar', value: 5 });
      expect(itemNodes[3].entry).toMatchObject({ label: '[3]', type: 'scalar', value: 6 });
    });

    it('can publish updates of array item nodes with items changed and added', () => {
      const model = createWatchModel();
      model.setContext({ arr: [1, 2] });
      model.addWatch('arr');
      model.subscribe(subscriber);
      unfoldProxyNodes(model);

      model.setContext({ arr: [3, 4, 5, 6] });

      const arrayNode = model.getTopLevelNodes()[0];
      const itemNodes = getSubNodesArray(arrayNode);
      expect(itemNodes.length).toBe(4);

      expect(subscriber.updateNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.updateNodes).toHaveBeenCalledWith([arrayNode, itemNodes[0], itemNodes[1]]);
      expect(subscriber.insertNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.insertNodes).toHaveBeenCalledWith([itemNodes[2], itemNodes[3]]);
      expect(subscriber.removeNodes).not.toHaveBeenCalled();
    });

    it('can update array item nodes with items changed and removed', () => {
      const model = createWatchModel();
      model.setContext({ arr: [1, 2, 3, 4] });
      model.addWatch('arr');
      unfoldProxyNodes(model);

      model.setContext({ arr: [5, 6] });

      const itemNodes = getSubNodesArray(model.getTopLevelNodes()[0]);
      expect(itemNodes.length).toBe(2);
      expect(itemNodes[0].entry).toMatchObject({ label: '[0]', type: 'scalar', value: 5 });
      expect(itemNodes[1].entry).toMatchObject({ label: '[1]', type: 'scalar', value: 6 });
    });

    it('can publish updates of array item nodes with items changed and removed', () => {
      const model = createWatchModel();
      model.setContext({ arr: [1, 2, 3, 4] });
      model.addWatch('arr');
      model.subscribe(subscriber);
      unfoldProxyNodes(model);

      const itemNodesBefore = getSubNodesArray(model.getTopLevelNodes()[0]);

      model.setContext({ arr: [5, 6] });

      const arrayNodeAfter = model.getTopLevelNodes()[0];
      const itemNodesAfter = getSubNodesArray(arrayNodeAfter);
      expect(itemNodesBefore.length).toBe(4);
      expect(itemNodesAfter.length).toBe(2);
      expect(subscriber.updateNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.updateNodes).toHaveBeenCalledWith([arrayNodeAfter, itemNodesAfter[0], itemNodesAfter[1]]);
      expect(subscriber.removeNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.removeNodes).toHaveBeenCalledWith([itemNodesBefore[2], itemNodesBefore[3]]);
      expect(subscriber.insertNodes).not.toHaveBeenCalled();
    });

    it('can update prop nodes of object top-level node', () => {
      const model = createWatchModel();
      model.setContext({ obj: { x:1, y: 2 } });
      model.addWatch('obj');
      model.subscribe(subscriber);
      unfoldProxyNodes(model);

      model.setContext({ obj: { x:111, z: 333, w: 444 } });

      const propNodes = getSubNodesArray(model.getTopLevelNodes()[0]);
      expect(propNodes.length).toBe(3);
      expect(propNodes[0].entry).toMatchObject({ label: 'w', type: 'scalar', value: 444 });
      expect(propNodes[1].entry).toMatchObject({ label: 'x', type: 'scalar', value: 111 });
      expect(propNodes[2].entry).toMatchObject({ label: 'z', type: 'scalar', value: 333 });
    });

    it('can publish updates of object prop nodes', () => {
      const model = createWatchModel();
      model.setContext({ obj: { x:1, y: 2 } });
      model.addWatch('obj');
      model.subscribe(subscriber);
      unfoldProxyNodes(model);

      const propNodesBefore = getSubNodesArray(model.getTopLevelNodes()[0]);

      model.setContext({ obj: { x:111, z: 333, w: 444 } });

      const objNodeAfter = model.getTopLevelNodes()[0];
      const propNodesAfter = getSubNodesArray(objNodeAfter);

      expect(subscriber.updateNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.updateNodes).toHaveBeenCalledWith([objNodeAfter, propNodesAfter[1]]);
      expect(subscriber.removeNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.removeNodes).toHaveBeenCalledWith([propNodesBefore[1]]);
      expect(subscriber.insertNodes).toHaveBeenCalledTimes(1);
      expect(subscriber.insertNodes).toHaveBeenCalledWith([propNodesAfter[0], propNodesAfter[2]]);
    });

  });

  describe("scalar node", () => {

    const scalarTestValues = ["abc", true, false, 12345, null, undefined];

    scalarTestValues.forEach(value => 
      it('is initialized correctly', () => {

        const node = createWatchTreeNode(model, rootNode, 'testLabel', 'testKey', value);

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
      const node = createWatchTreeNode(model, rootNode, 'testLabel', 'testKey', value);

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
      const node = createWatchTreeNode(model, rootNode, 'testLabel', 'testKey', value);

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
      const node = createWatchTreeNode(model, rootNode, 'testLabel', 'testKey', value);

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
      const node = createWatchTreeNode(model, rootNode, 'testLabel', 'testKey', value);

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
      const node = createWatchTreeNode(model, rootNode, 'testLabel', 'testKey', value);
  
      expect(node.firstChild).toBeUndefined();
      expect(node.lastChild).toBeUndefined();
    });
  
    it('does not expand properties of empty object', () => {
      const value = {};
      const node = createWatchTreeNode(model, rootNode, 'testLabel', 'testKey', value);
  
      expect(node.firstChild).toBeUndefined();
      expect(node.lastChild).toBeUndefined();
    });
    
  });

});
