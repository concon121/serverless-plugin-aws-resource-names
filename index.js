'use strict';

const naming = require('./naming')
const path = require('path'),
  fs = require('fs'),
  BbPromise = require('bluebird'); // Serverless uses Bluebird Promises and we recommend you do to because they provide more than your average Promise :)

console.log(typeof ServerlessPlugin)

/**
 * ServerlessPluginBoierplate
 */

class AWSNaming {

  constructor(serverless, options) {
    const self = this
    this.serverless = serverless;
    this.service = serverless.service;
    this.serverlessLog = serverless.cli.log.bind(serverless.cli);
    this.options = options;

    this.hooks = {

      'before:package:*': self.start(),
      'before:deploy:*': self.start(),

    };
  }

  start() {
    var aws = this.serverless.getProvider('aws')
    Object.assign(aws.naming, naming)
    this.serverless.cli.log('AWS NAMING')
    this.serverless.cli.log(aws.naming)
  }

  static getName() {
    return 'serverless-aws-resource-names';
  }
}

//new ServerlessPluginBoilerplate()

module.exports = AWSNaming;
