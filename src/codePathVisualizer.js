export function createCodePathVisualModel(onShowRows, onHideRows) {



  return {
    pushEntries(entries) {
      onShowRows(0, entries.filter(e => e.token === 'StartSpan'));      
    },
    expandRow(id) {

    },
    collapseRow(id) {

    },
    filterRows(query) {

    },
    clearRow(id) {

    },
    clearAllRows() {

    }
  };
}