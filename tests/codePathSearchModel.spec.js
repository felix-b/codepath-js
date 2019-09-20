import { createCodePathModel } from '../src';
import { createCodePathSearchModel } from '../src';
/*

- R0
  |
  +- S1
  |  |
  |  +- M1 
  |  +- M2 [*]
  |  +- M3
  |
  +- S2 [*]
  |  |
  |  +- S3
  |     |
  |     +- M4 [*]
  |     +- M5 
  |     +- M6 [*]
  |
  +- S4
     |
     +- M7
  
- R1
  |    
  +- M8 [*] 
  +- M9

  RESULT:

- R0
  |
  +- S1
  |  |
  |  +- M2 [*]
  |
  +- S2 [*]
  |  |
  |  +- S3
  |     |
  |     +- M4 [*]
  |     +- M6 [*]
  
- R1
  |
  +- M8 [*] 

*/

const createSourceModel = () => {
  const entries = [
    { token: 'StartSpan', messageId: 'R0', traceId: 'T1', spanId: 1000 },
    { token: 'StartSpan', messageId: 'S1', traceId: 'T1', spanId: 101, childOf: {
      traceId: 'T1', spanId: 1000
    } },
    { token: 'Log', messageId: 'M1', traceId: 'T1', spanId: 101 },
    { token: 'Log', messageId: 'M2', traceId: 'T1', spanId: 101 },
    { token: 'Log', messageId: 'M3', traceId: 'T1', spanId: 101 },
    { token: 'EndSpan', traceId: 'T1', spanId: 101 },
    { token: 'StartSpan', messageId: 'S2', traceId: 'T1', spanId: 102, childOf: {
      traceId: 'T1', spanId: 1000
    } },
    { token: 'StartSpan', messageId: 'S3', traceId: 'T1', spanId: 103, childOf: {
      traceId: 'T1', spanId: 102
    } },
    { token: 'Log', messageId: 'M4', traceId: 'T1', spanId: 103 },
    { token: 'Log', messageId: 'M5', traceId: 'T1', spanId: 103 },
    { token: 'Log', messageId: 'M6', traceId: 'T1', spanId: 103 },
    { token: 'EndSpan', traceId: 'T1', spanId: 103 },
    { token: 'EndSpan', traceId: 'T1', spanId: 102 },
    { token: 'StartSpan', messageId: 'S4', traceId: 'T1', spanId: 104, childOf: {
      traceId: 'T1', spanId: 1000
    } },
    { token: 'Log', messageId: 'M7', traceId: 'T1', spanId: 104 },
    { token: 'EndSpan', traceId: 'T1', spanId: 104 },
    { token: 'EndSpan', traceId: 'T1', spanId: 1000 },
    { token: 'StartSpan', messageId: 'R1', traceId: 'T1', spanId: 1001 },
    { token: 'Log', messageId: 'M8', traceId: 'T1', spanId: 1001 },
    { token: 'Log', messageId: 'M9', traceId: 'T1', spanId: 1001 },
    { token: 'EndSpan', traceId: 'T1', spanId: 1001 },
  ];

  const model = createCodePathModel();
  model.publish(entries);
  return model;
}

const createSearchModel = (sourceModel, includedMessageIds) => {
  const idSet = new Set(includedMessageIds);
  const searchModel = createCodePathSearchModel(
    sourceModel,
    node => {
      const shouldInclude = !!(node.entry && idSet.has(node.entry.messageId));
      return shouldInclude;
    }
  );
  return searchModel;
};

describe("CodePathSearchModel", () => {

  it("can find root span node", () => {
    const source = createSourceModel();

    const search = createSearchModel(source, ['R0']);

    expect(search.getNodesFlat()).toMatchObject([
      { matched: true, entry: { messageId: 'R0' }, parent: { id: 0 } }
    ]);
  });

  it("can find nested node", () => {
    const source = createSourceModel();

    const search = createSearchModel(source, ['M2']);

    expect(search.getNodesFlat()).toMatchObject([
      { matched: false, entry: { messageId: 'R0' }, parent: { id: 0 } },
      { matched: false, entry: { messageId: 'S1' }, parent: { entry: { messageId: 'R0' } } },
      { matched: true, entry: { messageId: 'M2' }, parent: { entry: { messageId: 'S1' } } },
    ]);
  });

  it("can find multiple nested nodes", () => {
    const source = createSourceModel();

    const search = createSearchModel(source, ['M2', 'S2', 'M4', 'M6', 'M8']);

    expect(search.getNodesFlat()).toMatchObject([
      { matched: false, entry: { messageId: 'R0' }, parent: { id: 0 } },
      { matched: false, entry: { messageId: 'S1' }, parent: { entry: { messageId: 'R0' } } },
      { matched: true, entry: { messageId: 'M2' }, parent: { entry: { messageId: 'S1' } } },
      { matched: true, entry: { messageId: 'S2' }, parent: { entry: { messageId: 'R0' } } },
      { matched: false, entry: { messageId: 'S3' }, parent: { entry: { messageId: 'S2' } } },
      { matched: true, entry: { messageId: 'M4' }, parent: { entry: { messageId: 'S3' } } },
      { matched: true, entry: { messageId: 'M6' }, parent: { entry: { messageId: 'S3' } } },
      { matched: false, entry: { messageId: 'R1' }, parent: { id: 0 } },
      { matched: true, entry: { messageId: 'M8' }, parent: { entry: { messageId: 'R1' } } },
    ]);
  });

  it("can return empty result", () => {
    const source = createSourceModel();

    const search = createSearchModel(source, ['ZZZ']);

    expect(search.getNodesFlat().length).toBe(0);
  });

  it("can find all root spans", () => {
    const source = createSourceModel();

    const search = createSearchModel(source, ['R0', 'R1']);

    expect(search.getNodesFlat()).toMatchObject([
      { matched: true, entry: { messageId: 'R0' }, parent: { id: 0 } },
      { matched: true, entry: { messageId: 'R1' }, parent: { id: 0 } },
    ]);
  });

  it("can display new matching node under existing result parent", () => {
    const source = createSourceModel();
    const search = createSearchModel(source, ['M2', 'M22']);

    source.publish([
      { token: 'Log', messageId: 'M22', traceId: 'T1', spanId: 101 },
    ]);

    expect(search.getNodesFlat()).toMatchObject([
      { matched: false, entry: { messageId: 'R0' }, parent: { id: 0 } },
      { matched: false, entry: { messageId: 'S1' }, parent: { entry: { messageId: 'R0' } } },
      { matched: true, entry: { messageId: 'M2' }, parent: { entry: { messageId: 'S1' } } },
      { matched: true, entry: { messageId: 'M22' }, parent: { entry: { messageId: 'S1' } } },
    ]);
  });

  it("can display new matching nodes under non-existing result parents", () => {
    const source = createSourceModel();
    const search = createSearchModel(source, ['M2', 'M22', 'M44', 'M88']);

    source.publish([
      { token: 'Log', messageId: 'M22', traceId: 'T1', spanId: 103 },
      { token: 'Log', messageId: 'M44', traceId: 'T1', spanId: 1001 },
      { token: 'StartSpan', messageId: 'R2', traceId: 'T1', spanId: 1002 },
      { token: 'Log', messageId: 'M88', traceId: 'T1', spanId: 1002 },
    ]);

    expect(search.getNodesFlat()).toMatchObject([
      { matched: false, entry: { messageId: 'R0' }, parent: { id: 0 } },
      { matched: false, entry: { messageId: 'S1' }, parent: { entry: { messageId: 'R0' } } },
      { matched: true, entry: { messageId: 'M2' }, parent: { entry: { messageId: 'S1' } } },
      { matched: false, entry: { messageId: 'S2' }, parent: { entry: { messageId: 'R0' } } },
      { matched: false, entry: { messageId: 'S3' }, parent: { entry: { messageId: 'S2' } } },
      { matched: true, entry: { messageId: 'M22' }, parent: { entry: { messageId: 'S3' } } },
      { matched: false, entry: { messageId: 'R1' }, parent: { id: 0 } },
      { matched: true, entry: { messageId: 'M44' }, parent: { entry: { messageId: 'R1' } } },
      { matched: false, entry: { messageId: 'R2' }, parent: { id: 0 } },
      { matched: true, entry: { messageId: 'M88' }, parent: { entry: { messageId: 'R2' } } },
    ]);
  });

});
