import MobileDetect from 'mobile-detect';

export default (
  userAgent?: string
): { isDesktop: boolean; isTablet: boolean; isPhone: boolean } => {
  const md = new MobileDetect(userAgent || navigator.userAgent);

  return {
    isDesktop: !md.mobile(),
    isTablet: !!md.tablet(),
    isPhone: !!md.phone()
  };
};
