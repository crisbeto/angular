/**
 * @dgProcessor addGlobalNamespace
 *
 * Marks APIs tagged with `@globalApi` as globals and
 * prefixes them with the namespace, if there is one.
 */
module.exports = function addGlobalNamespaceProcessor() {
  return {
    $runAfter: ['extractDecoratedClassesProcessor'],
    $runBefore: ['computing-ids'],
    $process: function(docs) {
      docs.forEach(doc => {
        const globalApiTag = doc.globalApi && doc.globalApi.trim();

        if (globalApiTag !== undefined) {
          doc.global = true;

          if (globalApiTag.length > 0) {
            doc.name = `${globalApiTag}.${doc.name}`;
          }
        }
      });
    }
  };
};
