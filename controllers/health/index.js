module.exports = [
  {
    method: 'GET',
    path: '/health',
    config: {
      handler: function(req, reply) {
        reply('OK');
      }
    }
  }
];
