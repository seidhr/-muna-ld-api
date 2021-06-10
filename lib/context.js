export const context = {
  "@context": {
    id: "@id",
    type: "@type",
    "@base": "http://data.muna.xyz/id/",
    "@vocab": "http://muna.xyz/model/0.1/",
    label: {
      "@id": "http://muna.xyz/model/0.1/label",
      "@container": ["@language", "@set"],
    },
    production: {
      "@id": "http://muna.xyz/model/0.1/Production"
    },
    dataTransferEvent: {
      "@id": "http://muna.xyz/model/0.1/DataTransferEvent"
    },
    digitalObject: {
      "@id": "http://muna.xyz/model/0.1/DigitalObject"
    },
    digitalDevice: {
      "@id": "http://muna.xyz/model/0.1/DigitalDevice"
    },
    madeObject: {
      "@id": "http://muna.xyz/model/0.1/MadeObject"
    },
    linguisticObject: {
      "@id": "http://muna.xyz/model/0.1/LinguisticObject"
    },
    identifier: {
      "@id": "http://muna.xyz/model/0.1/Identifier"
    },
    actorInRole: {
      "@id": "http://muna.xyz/model/0.1/ActorInRole"
    }
  },
};
