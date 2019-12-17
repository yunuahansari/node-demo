"use strict";

import path from "path";

export default {
  app: {
    siteName: "Test",
    siteEmail: "",
    baseUrl: "http://localhost:3600/",
    setBaseUrl(url) {
      this.baseUrl = url;
    }
  },
  database: {
    mysql: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      db: "nodedb",
      timezone: "+00:00"
    },
    mongodb: {
       url: 'mongodb://localhost:27017/elcaro_db'
    }
  },
  mail: {
    from_name: "App",
    from_email: "user1@neuronsolutions.com",
    is_smtp: true,
    smtp: {
      host: "mail.codiant.com",
      port: "587",
      user: "testing@codiant.com",
      password: "test123",
      isSecure: false
    }
  },
  sms: {
    twilio: {
      accountSid: "",
      authToken: "",
      fromNumber: ""
    }
  },
  stripe: {
    production: {
      publish_key: "",
      secret_key: ""
    },
    test: {
      publish_key: "",
      secret_key: ""
    },
    env: "test"
  },
  notification: {
    ios: {
      token: {
        key: path.join(__dirname, "ios-token", ""),
        keyId: "",
        teamId: ""
      },
      production: true
    },
    android: {
      fcm: {
        server_key: ""
      }
    }
  },
  google: {
    api_key: ""
  }
};
