module.exports = (function() {
  return {
    local: {
      host: 'localhost',
      port: '3306',
      user: 'jumi',
      password: 'asd25320',
      database: 'demo'
    },
    real: {
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    },
    staging: {
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    },
    dev: {
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    }
  }
})();
