import { walkNodesDepthFirst } from "./codePathModel";

export function aggregateSpanStats(rootNode) {
  let entryByMessageId = new Map();

  walkNodesDepthFirst(rootNode, node => {
    if (node.entry) {
      let statsEntry = getOrAddEntry(node.entry.messageId);
      statsEntry.count++;
      statsEntry.totalDuration += node.entry.duration;
    }
  });

  const statsLines = [...entryByMessageId.values()].map(statsEntry => {
    statsEntry.avgDuration =
      statsEntry.count > 0 ? statsEntry.totalDuration / statsEntry.count : 0;
    return statsEntry;
  });

  return statsLines.sort((a, b) => a.totalDuration - b.totalDuration);

  function getOrAddEntry(messageId) {
    const existingEntry = entryByMessageId.get(messageId);
    if (existingEntry) {
      return existingEntry;
    }
    const newEntry = {
      messageId,
      count: 0,
      totalDuration: 0,
      avgDuration: 0
    };
    entryByMessageId.set(messageId, newEntry);
    return newEntry;
  }
}
