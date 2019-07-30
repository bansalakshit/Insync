import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,

    passwordResetToken: String,
    passwordResetExpires: Date,

    roles: [String],

    active: {
        type: Boolean,
        default: false
    },
    activationToken: String,

    profile: {
        channel_key: String,
        first_name: String,
        last_name: String,
        img: String,
        isOnline: {
            type: Boolean,
            default: false
        }
    },

    last_login: Date,
}, {
    timestamps: true
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

export default User;