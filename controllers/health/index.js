module.exports = function(server) {

  server.route([
    {
      method: 'GET',
      path: '/health',
      config: {
        handler: function(req, reply) {
          reply('OK');
        },
        description: 'Get health',
        notes: 'helath check',
        tags: ['api']
      }
    }
  ]);

};
