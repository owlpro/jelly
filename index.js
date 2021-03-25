// "use strict";

// var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

// Object.defineProperty(exports, "__esModule", {
//   value: true
// });
// Object.defineProperty(exports, "default", {
//   enumerable: true,
//   get: function get() {
//     return _SmartCrudProvider.default;
//   }
// });

// var _SmartCrudProvider = _interopRequireDefault(require("./src/SmartCrudProvider"));

import SmartCrudProvider from './src/SmartCrudProvider'
import SmartCrud from './src/SmartCrud'

module.exports = {
    SmartCrudProvider,
    SmartCrud,
}
