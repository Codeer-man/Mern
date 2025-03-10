const validate = (Schema) => async (req, res, next) => {
  try {
    const parseBody = await Schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (error) {
    const message = error.errors[0].message;
    // res.status(400).json({
    //   msg: message,
    // });

    const status = 500;
    const err = {
      status,
      message,
    };
    console.log(err);

    next(err);
  }
};

module.exports = validate;
