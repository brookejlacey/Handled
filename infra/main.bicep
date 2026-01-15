// Handled App - Azure Infrastructure
// This Bicep template provisions all Azure resources needed for the Handled app

@description('The environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('The Azure region for all resources')
param location string = resourceGroup().location

@description('The administrator login for SQL Server')
@secure()
param sqlAdminLogin string

@description('The administrator password for SQL Server')
@secure()
param sqlAdminPassword string

@description('The Anthropic API key for Claude')
@secure()
param anthropicApiKey string

@description('The RevenueCat API key')
@secure()
param revenueCatApiKey string

// Variables
var appName = 'handled'
var resourcePrefix = '${appName}-${environment}'

// ==================== STORAGE ACCOUNT ====================
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: replace('${resourcePrefix}storage', '-', '')
  location: location
  sku: {
    name: environment == 'prod' ? 'Standard_GRS' : 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
  }
}

// Blob container for user documents
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource documentsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'documents'
  properties: {
    publicAccess: 'None'
  }
}

// ==================== SQL DATABASE ====================
resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: '${resourcePrefix}-sql'
  location: location
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  parent: sqlServer
  name: '${appName}-db'
  location: location
  sku: {
    name: environment == 'prod' ? 'S1' : 'Basic'
    tier: environment == 'prod' ? 'Standard' : 'Basic'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: environment == 'prod' ? 268435456000 : 2147483648 // 250GB or 2GB
  }
}

// Allow Azure services to access SQL Server
resource sqlFirewallRule 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// ==================== APP SERVICE PLAN ====================
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '${resourcePrefix}-plan'
  location: location
  sku: {
    name: environment == 'prod' ? 'P1v3' : 'Y1'
    tier: environment == 'prod' ? 'PremiumV3' : 'Dynamic'
  }
  properties: {
    reserved: false
  }
}

// ==================== FUNCTION APP ====================
resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: '${resourcePrefix}-api'
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower('${resourcePrefix}-api')
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'DATABASE_URL'
          value: 'sqlserver://${sqlServer.properties.fullyQualifiedDomainName}:1433;database=${sqlDatabase.name};user=${sqlAdminLogin};password=${sqlAdminPassword};encrypt=true'
        }
        {
          name: 'ANTHROPIC_API_KEY'
          value: anthropicApiKey
        }
        {
          name: 'AZURE_STORAGE_CONNECTION_STRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'REVENUECAT_API_KEY'
          value: revenueCatApiKey
        }
      ]
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      cors: {
        allowedOrigins: [
          'https://${resourcePrefix}.azurewebsites.net'
        ]
      }
    }
    httpsOnly: true
  }
}

// ==================== APPLICATION INSIGHTS ====================
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${resourcePrefix}-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
    RetentionInDays: environment == 'prod' ? 90 : 30
  }
}

// ==================== NOTIFICATION HUB ====================
resource notificationHubNamespace 'Microsoft.NotificationHubs/namespaces@2023-01-01' = {
  name: '${resourcePrefix}-notifications'
  location: location
  sku: {
    name: environment == 'prod' ? 'Standard' : 'Free'
  }
  properties: {}
}

resource notificationHub 'Microsoft.NotificationHubs/namespaces/notificationHubs@2023-01-01' = {
  parent: notificationHubNamespace
  name: '${appName}-hub'
  location: location
  properties: {}
}

// ==================== OUTPUTS ====================
output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output storageAccountName string = storageAccount.name
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
