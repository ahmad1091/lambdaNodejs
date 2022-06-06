import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
dotenv.config();

import {
  getAll,
  itemsPerId,
  itemsPerCategory,
  getItems,
  getItemsCatByShopId,
  getCatByShopId,
  shopsPerLocation,
  getItemByName,
  createCustomer,
  pushToQueue,
  receiveFromQueue,
  success,
  createAddress,
  customerAddress,
  customerAddressByUser,
  getCustomerOrders,
  deleteAddress,
  preferredAddress,
  getOrdersByUser,
  createContact,
  getAllGallery,
  updateOrderStatus,
  getImageByName,
  getShopById,
  validateOrder,
  getOrderById,
} from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'mobile',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
  },
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },

    environment: {
      DB_NAME: process.env.DB_NAME,
      DB_AURORACLUSTER_ARN: process.env.DB_AURORACLUSTER_ARN,
      DB_SECRETSTORE_ARN: process.env.DB_SECRETSTORE_ARN,
      ACCOUNT_ID: process.env.ACCOUNT_ID,
      GOOGLEAPIKEY: process.env.GOOGLEAPIKEY,
      PAYPAL_CLIENTID: process.env.PAYPAL_CLIENTID,
      PAYPAL_CLIENTSECRET: process.env.PAYPAL_CLIENTSECRET,
      QUEUEURL: process.env.QUEUEURL,
      ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
      SQS_NEWORDER: process.env.SQS_NEWORDER,
      URL_SUCCESS_PAYPAL: process.env.URL_SUCCESS_PAYPAL,
      SLS_DEBUG: '*',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue'],
        Resource: process.env.DB_SECRETSTORE_ARN,
      },
      {
        Effect: 'Allow',
        Action: 'rds-data:*',
        Resource: process.env.DB_AURORACLUSTER_ARN,
      },
      {
        Effect: 'Allow',
        Action: [
          'sqs:SendMessage',
          'sqs:ReceiveMessage',
          'sqs:DeleteMessage',
          'sqs:GetQueueAttributes',
        ],
        Resource: process.env.SQS_NEWORDER,
      },
      {
        Effect: 'Allow',
        Action: ['ses:SendEmail', 'ses:SendRawEmail', 'ses:SendTemplatedEmail'],
        Resource: `arn:aws:ses:*`,
      },
    ],
  },

  // import the function via paths
  functions: {
    getAll,
    itemsPerId,
    itemsPerCategory,
    getItems,
    getItemsCatByShopId,
    getCatByShopId,
    shopsPerLocation,
    getItemByName,
    createCustomer,
    pushToQueue,
    receiveFromQueue,
    success,
    createAddress,
    customerAddress,
    customerAddressByUser,
    getCustomerOrders,
    deleteAddress,
    preferredAddress,
    getOrdersByUser,
    createContact,
    getAllGallery,
    updateOrderStatus,
    getImageByName,
    getShopById,
    validateOrder,
    getOrderById,
  },
};

module.exports = serverlessConfiguration;
