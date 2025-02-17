export const itemSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    name: {
      type: 'string',
      maxLength: 100,
    },
    price: {
      type: 'number',
      positive: true,
    },
    description: {
      type: 'string',
      maxLength: 1000,
    },
    color: {
      type: 'string',
    },
    createdAt: {
      type: 'date-time',
    },
    updatedAt: {
      type: 'date-time',
    },
  },
  required: ['id', 'dealer', 'players', 'createdAt'],
};
