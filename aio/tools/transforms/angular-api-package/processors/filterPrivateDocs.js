module.exports = function filterPrivateDocs() {
  return {
    $runAfter: ['extra-docs-added', 'checkContentRules'],
    $runBefore: ['computing-paths'],
    $process: function(docs) {
      return docs.filter(function(doc) {
        if (doc.global) {
          console.log(doc.name, doc.privateExport);
        }

        return doc.privateExport !== true;
      });
    }
  };
};
