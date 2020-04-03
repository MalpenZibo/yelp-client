import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { identity } from 'fp-ts/lib/function';

export const getRandomName = (length: number): TaskEither<unknown, string> => {
  return tryCatch(
    () =>
      fetch(`http://uinames.com/api/?minlen=${length}&maxlen=${length}`).then(res => res.json()),
    identity
  ).map(res => `${res.name} ${res.surname}`);
};
