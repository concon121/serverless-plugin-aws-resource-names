'use strict'

const fs = require('fs')
const _ = require('lodash')

module.exports = {

    _getMappings(lambdaName) {
        var data = fs.readFileSync(this.provider.serverless.service.custom['serverless-aws-resource-names'].source, 'utf8')
        data = data.replace(new RegExp('\\$stage', 'g'), this.provider.getStage() || 'dev')
        data = data.replace(new RegExp('\\$region', 'g'), this.provider.getRegion())
        data = data.replace(new RegExp('\\$service', 'g'), this.provider.serverless.service.service)
        if (lambdaName) {
            data = data.replace(new RegExp('\\$lambda', 'g'), lambdaName)
        } else {
            data = data.replace(new RegExp('\\$lambda', 'g'), 'lambdaName')
        }
        console.log(data)
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
    getLogGroupName(functionName) {
        const self = this
        var logGroup
        _.forEach(self.provider.serverless.service.functions, (functionObj, name) => {
            if (JSON.stringify(functionName).includes(name + '"')) {
                logGroup = this._getMappings(name).logGroup
                return false
            }
        })
        return logGroup
    },
    setFunctionNames(provider) {
        const self = this
        var mappings
        if (!self.provider) {
            self.provider = provider
        }
        if (self.provider) {
            _.forEach(self.provider.serverless.service.functions, (functionObj, functionName) => {
                if (!functionObj.events) {
                    self.provider.serverless.service.functions[functionName].events = []
                }
                mappings = self._getMappings(functionName)
                self.provider.serverless.service.functions[functionName].name = mappings.lambda
            })
        }
    }
}
