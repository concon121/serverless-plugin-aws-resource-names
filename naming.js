'use strict'

const fs = require('fs')
const _ = require('lodash')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    dataSource: undefined,

    _getMappings(lambdaName) {
        if (!this.dataSource) {
            this.dataSource = fs.readFileSync(this.provider.serverless.service.custom['serverless-aws-resource-names'].source, 'utf8').replace(new RegExp('\\$rand', 'g'), uuidv4())
        }
        var data = this.dataSource
        _.forIn(this.provider.serverless.service.custom['serverless-aws-resource-names'].variables, (replacement, variableName) => {
            data = data.replace(new RegExp(`\\$${variableName}`, 'g'), replacement)
        })
        data = data.replace(new RegExp('\\$stage', 'g'), this.provider.getStage() || 'dev')
        data = data.replace(new RegExp('\\$region', 'g'), this.provider.getRegion())
        data = data.replace(new RegExp('\\$service', 'g'), this.provider.serverless.service.service)
        if (lambdaName) {
            data = data.replace(new RegExp('\\$lambda', 'g'), lambdaName)
        } else {
            data = data.replace(new RegExp('\\$lambda', 'g'), 'lambdaName')
        }
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
            if (JSON.stringify(functionName).includes(name + '"') || JSON.stringify(functionName).includes(name + '-')) {
                logGroup = this._getMappings(name).logGroup
                return false
            }
        })
        return logGroup
    },
    getEcrRepositoryName() {
        return this._getMappings().ecr
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
    },
    fixLogGroups(args) {
        var cft = this.serverless.service.provider.compiledCloudFormationTemplate
        var role = cft.Resources.IamRoleLambdaExecution
        if (role) {
            for (var policy of role.Properties.Policies) {
                for (var statement of policy.PolicyDocument.Statement.filter((s) => (s.Action.includes("logs:CreateLogStream") || s.Action.includes("logs:PutLogEvents")))) {
                    statement.Resource = statement.Resource.filter(function(value, index, arr) {
                        return Object.values(value).filter(function (v) { return v.includes("log-group") }).length === 0;
                    });

                    for (var resource of Object.keys(cft.Resources).filter((r) => r.includes("LogGroup"))) {
                        statement.Resource.push({
                            "Fn::Sub": "arn:aws:logs:${AWS::Region}:${AWS::AccountId}:log-group:${" + resource + "}:*" + (statement.Action.includes("logs:PutLogEvents") ? ":*" : "")
                        })
                    }
                }
            }
        }
    }
}
