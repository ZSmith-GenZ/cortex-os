const mongoose = require('mongoose');
const { createModels } = require('@cortex-os/data-schemas');
const models = createModels(mongoose);

module.exports = { ...models };
