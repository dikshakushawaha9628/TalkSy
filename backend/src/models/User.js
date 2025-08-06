import mongoose from "mongoose";    
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    bio:{
        type: String,
        default: ''
    },
    profilePic:{
        type: String,
        default: ''
    },
    birthday:{
        type: Date,
        default: null
    },
    profession:{
        type: String,
        default: ''
    },
    isOnboarded:{
        type: Boolean,
        default: false
    },
    location:{
        type: String,
        default: ''
    },
    friends:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }
},{timestamps: true});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password, salt);
        next();
    }catch(error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};

const User = mongoose.model('User', userSchema);

// Hash password before saving user

export default User;
