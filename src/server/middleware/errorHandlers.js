/* eslint no-console: 0, no-unused-vars: 0 */

// Do not be a n00b and remove the unused params, please :)
const errorHandlersMiddleware = [
  function notFoundMiddlware(req, res, next) {
    res.status(404).send('Sorry, that resource was not found.');
  },

  function unhandledErrorMiddleware(err, req, res, next) {
    if (err) {
      console.log(err);
      console.log(err.stack);
    }

    res.status(500).send('Sorry, an unexpected error occurred.');
  },
];

export default (errorHandlersMiddleware);
