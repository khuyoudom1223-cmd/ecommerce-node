import Joi from 'joi';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    // Strip double quotes and capitalize for beautiful user-friendly messages
    let msg = error.details[0].message.replace(/\"/g, '');
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
    return res.status(400).json({ success: false, message: msg });
  }
  next();
};
