import { fitnessClasses } from '../data/classes.js';

let _shouldFail = false;

export function setMockFailure(val) { _shouldFail = val; }

export function loadClasses() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (_shouldFail) {
        reject(new Error('Failed to load classes. Please try again.'));
      } else {
        resolve([...fitnessClasses]);
      }
    }, 900);
  });
}
