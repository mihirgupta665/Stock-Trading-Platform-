const Joi = require("joi");

const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.min": "Username must be at least 3 characters long",
        "any.required": "Username is required"
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required"
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required"
    })
});

const validateSignup = (req, res, next) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateSignup,
    validateLogin
};
