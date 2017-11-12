'use strict'

const naming = require('./naming')
const ref = {}

class AWSNaming {
    constructor(serverless, options) {
        const self = this
        ref.self = self
        this.serverless = serverless
        this.service = serverless.service
        this.serverlessLog = serverless.cli.log.bind(serverless.cli)
        this.options = options

        self.start()
    }

    start() {
        ref.self.serverlessLog('Setting custom naming conventions...')
        var aws = ref.self.serverless.getProvider('aws')
        Object.assign(aws.naming, naming)
        ref.self.serverless.cli.log('Setting custom function names...')
        naming.setFunctionNames(aws)
    }
}
module.exports = AWSNaming
