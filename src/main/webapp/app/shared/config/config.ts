import type { App } from 'vue';
import { type IntlDateTimeFormats, createI18n } from 'vue-i18n';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons/faArrowsRotate';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons/faAsterisk';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons/faCartPlus';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons/faCartShopping';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faCloud } from '@fortawesome/free-solid-svg-icons/faCloud';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faReceipt } from '@fortawesome/free-solid-svg-icons/faReceipt';
import { faRoad } from '@fortawesome/free-solid-svg-icons/faRoad';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons/faShieldHalved';
import { faShirt } from '@fortawesome/free-solid-svg-icons/faShirt';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown';
import { faSortUp } from '@fortawesome/free-solid-svg-icons/faSortUp';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags';
import { faTasks } from '@fortawesome/free-solid-svg-icons/faTasks';
import { faThList } from '@fortawesome/free-solid-svg-icons/faThList';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons/faTruckFast';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faUsersCog } from '@fortawesome/free-solid-svg-icons/faUsersCog';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const datetimeFormats: IntlDateTimeFormats = {
  en: {
    short: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' },
  },
  // jhipster-needle-i18n-language-date-time-format - JHipster will add/remove format options in this object
};

export function initFortAwesome(vue: App) {
  vue.component('FontAwesomeIcon', FontAwesomeIcon);

  library.add(
    faArrowLeft,
    faArrowsRotate,
    faAsterisk,
    faBan,
    faBars,
    faBell,
    faBook,
    faBoxOpen,
    faCartPlus,
    faCartShopping,
    faCheck,
    faChevronDown,
    faCloud,
    faCogs,
    faDatabase,
    faEye,
    faFlag,
    faHeart,
    faHome,
    faImage,
    faList,
    faLock,
    faPencilAlt,
    faPlus,
    faReceipt,
    faRoad,
    faSave,
    faSearch,
    faShieldHalved,
    faShirt,
    faSignInAlt,
    faSignOutAlt,
    faSort,
    faSortDown,
    faSortUp,
    faStar,
    faSync,
    faTachometerAlt,
    faTags,
    faTasks,
    faThList,
    faTimes,
    faTimesCircle,
    faTrash,
    faTruckFast,
    faUser,
    faUserPlus,
    faUsers,
    faUsersCog,
    faWrench,
  );
}
export function initI18N(opts: any = {}) {
  return createI18n({
    missingWarn: false,
    fallbackWarn: false,
    legacy: false,
    datetimeFormats,
    silentTranslationWarn: true,
    ...opts,
  });
}
