/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {createBenchmark} from '../micro_bench';

function renderStringifyCurrent(value: any): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return '' + value;
}

function renderStringifyToString(value: any): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return value.toString();
}

function renderStringifyConstructor(value: any): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

const objects: any[] = [];
const objectsWithToString: any[] = [];

for (let i = 0; i < 1000000; i++) {
  objects.push({['foo_' + i]: i});
  objectsWithToString.push({['foo_' + i]: i, toString: () => 'x'});
}
const max = objects.length - 1;
let i = 0;

const benchmarkRefresh = createBenchmark('renderStringify');
const renderStringifyCurrentTime = benchmarkRefresh('current');
const renderStringifyCurrentWithToStringTime = benchmarkRefresh('current with toString');
const renderStringifyToStringTime = benchmarkRefresh('toString');
const renderStringifyToStringWithToStringTime = benchmarkRefresh('toString with toString');
const renderStringifyConstructorTime = benchmarkRefresh('constructor');
const renderStringifyConstructorWithToStringTime = benchmarkRefresh('constructor with toString');
const renderStringifyToStringMonoTime = benchmarkRefresh('toString mono');
const renderStringifyToStringWithToStringMonoTime = benchmarkRefresh('toString with toString mono');

// Current
while (renderStringifyCurrentTime()) {
  renderStringifyCurrent(objects[i]);
  i = i < max ? i + 1 : 0;
}

while (renderStringifyCurrentWithToStringTime()) {
  renderStringifyCurrent(objectsWithToString[i]);
  i = i < max ? i + 1 : 0;
}
/////////////

// toString
while (renderStringifyToStringTime()) {
  renderStringifyToString(objects[i]);
  i = i < max ? i + 1 : 0;
}

while (renderStringifyToStringWithToStringTime()) {
  renderStringifyToString(objectsWithToString[i]);
  i = i < max ? i + 1 : 0;
}
/////////////

// toString mono
while (renderStringifyToStringMonoTime()) {
  renderStringifyToString(objects[0]);
}

while (renderStringifyToStringWithToStringMonoTime()) {
  renderStringifyToString(objectsWithToString[0]);
}
/////////////

// String()
while (renderStringifyConstructorTime()) {
  renderStringifyConstructor(objects[i]);
  i = i < max ? i + 1 : 0;
}

while (renderStringifyConstructorWithToStringTime()) {
  renderStringifyConstructor(objectsWithToString[i]);
  i = i < max ? i + 1 : 0;
}
/////////////

benchmarkRefresh.report();
