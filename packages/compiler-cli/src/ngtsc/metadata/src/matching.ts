/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {MatchedDirectives} from '@angular/compiler';

import {DirectiveMeta, MetadataReader} from './api';
import {ClassPropertyMapping} from './property_mapping';

// TODO: better name. maybe HostDirectiveMatcher or HostDirectiveAnalyzer?
export class HostDirectiveResolver<T extends DirectiveMeta> {
  constructor(private metaReader: MetadataReader) {}

  getMatchedDirectives(metadata: T): MatchedDirectives<T> {
    // TODO: do some caching
    const hostDirectives = metadata.hostDirectives ?
        (function process(directives, results, reader) {
          for (const current of directives) {
            const hostMeta = reader.getDirectiveMetadata(current);

            // TODO: produce diagnostic instead.
            if (hostMeta === null) {
              throw Error('Could not resolve host directive metadata');
            }

            if (hostMeta.hostDirectives) {
              process(hostMeta.hostDirectives, results, reader);
            }

            const newMeta = {...hostMeta};

            // TODO: filter the inputs/outputs here?
            // Can be done like this:
            // if (newMeta.inputs.hasBindingPropertyName('otherHostInput')) {
            //   newMeta.inputs = ClassPropertyMapping.fromMappedObject({});
            // }

            results.push(newMeta as T);
          }

          return results;
        })(metadata.hostDirectives, [] as T[], this.metaReader) :
        null;

    return {directive: metadata, hostDirectives};
  }
}
