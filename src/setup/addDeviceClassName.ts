// This script adds "is-desktop", "is-phone" or "is-tablet" class to the root document element

import classNames from 'classnames';
import mobileDetect from '../util/mobileDetect';

const md = mobileDetect();

const deviceClassName = classNames({
  'is-desktop': md.isDesktop,
  'is-tablet': md.isTablet,
  'is-phone': md.isPhone
});

// document.documentElement is not supported in every browser, fallback on document.body
const body = document.documentElement || document.body;

body.className = classNames(body.className, deviceClassName);
