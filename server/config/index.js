'use strict';

import development from './development';
import production from './production';

process.env.NODE_ENV = 'development';

export default (process.env.NODE_ENV === 'development') ? development: production;