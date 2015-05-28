module.exports = {
  name: 'health',
  job: function(data, done) {
    console.log('hostname', this.info.host);
    done();
  },
  concurrency: 10,
  priority: 'high'
};
