module.exports = {
  create:  {
    name: {
      notEmpty: {
        errorMessage: 'Missing name field'
      }
    },
    code: {
      notEmpty: {
        errorMessage: 'Missing code field'
      }
    },
    type: {
      optional: true
    },
    description: {
      optional: true
    }
  },
  read: {},
  update: {},
  detele: {}
};
