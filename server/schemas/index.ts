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
      minimum: 0,
    },
    description: {
      type: 'string',
      maxLength: 1000,
    },
    color: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
      // format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      // format: 'date-time',
    },
  },
  required: ['id', 'name', 'color', 'price', 'createdAt'],
};
