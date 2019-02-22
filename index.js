'use strict'

const naming = require('./naming')

class AWSNaming {
    constructor(serverless, options) {
        this.serverless = serverless
        this.options = options

        this.provider = serverless.getProvider('aws')

        // Overwrite the AWS provider's naming module
        serverless.cli.log('Setting custom naming conventions...')
        Object.assign(this.provider.naming, naming)

        // Overwrite the function names
        serverless.cli.log('Setting custom function names...')
        naming.setFunctionNames(this.provider)
    }
}
module.exports = AWSNaming
