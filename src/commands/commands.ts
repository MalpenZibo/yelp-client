import { getDoUpdateCurrentView } from 'avenger/lib/browser';
import { viewToLocation } from '../model';

export const doUpdateCurrentView = getDoUpdateCurrentView(viewToLocation);
