'use strict'

const naming = require('./naming')

class AWSNaming {
    constructor(serverless, options) {
        const self = this
        this.serverless = serverless
        this.service = serverless.service
        this.serverlessLog = serverless.cli.log.bind(serverless.cli)
        this.options = options

        this.hooks = {
            'before:package:*': self.start(),
            'before:deploy:*': self.start(),
            'before:config:*': self.start()
        }
    }

    start() {
        var aws = this.serverless.getProvider('aws')
        Object.assign(aws.naming, naming)
        this.serverless.cli.log('AWS NAMING')
        this.serverless.cli.log(aws.naming)
        naming.setFunctionNames(aws)
    }
}
module.exports = AWSNaming
