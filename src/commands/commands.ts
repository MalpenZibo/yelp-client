/*

In this file we can define all the avenger commands that are needed in our app.

*/

import { command } from 'avenger';
import { getDoUpdateCurrentView } from 'avenger/lib/browser';
import { randomName } from '../queries';
import { taskEither } from 'fp-ts/lib/TaskEither';
import { viewToLocation } from '../model';

export const doUpdateCurrentView = getDoUpdateCurrentView(viewToLocation);

export const doRefreshUsername = command(
  // doesn't perform any operation: it exists only to refresh the `randomName` query
  () => taskEither.of<void, void>(undefined),
  // when successful, should invalidate this query
  { randomName }
);
