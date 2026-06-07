import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import validateEmail from "../utils/validateEmail.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // LAYER 1,2,3 — email validation before anything
    const emailCheck = await validateEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({
        message: emailCheck.message,
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      digestSubscribed: true, // subscribed to digest by default
    });

    const verificationUrl =
      `http://localhost:3000/verify-email/${verificationToken}`;

    // FIX — send email BEFORE responding
    // if email fails, user won't be left in a broken state
    try {
      await sendEmail(
        user.email,
        "Verify Your Account",
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Verify Your Email</h2>
          <p>Thanks for registering, ${username}! Click below to verify your account:</p>
          
            href="${verificationUrl}"
            style="
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              margin-top: 16px;
            "
          >
            Verify Email →
          </a>
          <p style="color: #71717a; margin-top: 24px; font-size: 13px;">
            If you didn't create this account, ignore this email.
          </p>
        </div>
        `
      );
    } catch (emailError) {
      // email failed but user is created — log it but don't crash
      console.error("Verification email failed:", emailError.message);
    }

    // respond AFTER email is sent
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message: "Registration successful. Please verify your email.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // uncomment this when email verification is fully tested
    
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first",
      });
    }
    

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      accessToken,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REFRESH ACCESS TOKEN
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);

    res.json({ accessToken });

  } catch (error) {
    res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

// LOGOUT
export const logoutUser = (req, res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};

// GET ME
export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset",
      `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>Click below to reset your password. This link expires in 15 minutes.</p>
        
          href="${resetUrl}"
          style="
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin-top: 16px;
          "
        >
          Reset Password →
        </a>
        <p style="color: #71717a; margin-top: 24px; font-size: 13px;">
          If you didn't request this, ignore this email.
        </p>
      </div>
      `
    );

    res.json({ message: "Password reset email sent" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
      // $gt: Date.now() → token must not be expired
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};