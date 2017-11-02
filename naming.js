'use strict'

const fs = require('fs')
const _ = require('lodash')

module.exports = {

    _getMappings() {
        var data = fs.readFileSync(this.provider.serverless.service.custom['serverless-aws-resource-names'].source, 'utf8')
        data = data.replace(new RegExp('\\$stage', 'g'), this.provider.getStage())
        data = data.replace(new RegExp('\\$region', 'g'), this.provider.getRegion())
        data = data.replace(new RegExp('\\$service', 'g'), this.provider.serverless.service.service)
        return JSON.parse(data)
    },

    getCompiledTemplateFileName() {
        return this._getMappings().template.compiled
    },

    getCoreTemplateFileName() {
        return this._getMappings().template.core
    },
    getStackName() {
        return this._getMappings().stack
    },
    getRoleName() {
        return this._getMappings().role
    },
    getPolicyName() {
        return this._getMappings().policy
    },
    getApiGatewayName() {
        return this._getMappings().apiGateway
    },
    setFunctionNames(provider) {
        const self = this
        if (!self.provider) {
            self.provider = provider
        }
        if (self.provider) {
            const mappings = self._getMappings()
            _.forEach(self.provider.serverless.service.functions, (functionObj, functionName) => {
                if (!functionObj.events) {
                    self.provider.serverless.service.functions[functionName].events = []
                }
                self.provider.serverless.service.functions[functionName].name = mappings.lambda.replace('$lambda', functionName)
            })
        }
    }
}
