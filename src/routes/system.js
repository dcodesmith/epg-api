module.exports = (router) => {
  router
    .head('/status', (req, res) => {
      res.json({ status: 'ok' });
    });
};
