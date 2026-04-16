import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

const app=express();
const port=process.env.PORT||4000

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(cookieParser());

app.get('/api/init', (req, res) => {
  const cookieOptions = { httpOnly: false, secure: true, sameSite: 'none' };

  res.cookie('session_id', 'a1b2c3d4e5f6', cookieOptions);
  res.cookie('tracker_id', 'tr-99882233', cookieOptions);
  res.cookie('csrf_token', '93jf823hf2938h', cookieOptions);
  res.cookie('user_role', 'guest', cookieOptions);
  res.cookie('is_admin', 'false', cookieOptions); 
  res.cookie('access_level', '1', cookieOptions);
  res.cookie('privileges', 'read_only', cookieOptions);
  res.cookie('secret_cookie', 'cookie', cookieOptions);// imp

  res.json({ message: "Challenge initialized. Authentication required." });
});

app.get('/api/flag', (req, res) => {
  if (String(req.cookies.secret_cookie).toLowerCase() === 'oreo') {// imp
    res.json({
      success: true,
      message: "Access Granted",
      flag: "CTF{h1dd3n_c00k13_m4st3r}"// imp
    });
  } else {
    res.status(403).json({
      success: false,
      message: "Access Denied. Provide admin credentials."
    });
  }
});

app.get('/',(req,res)=> res.send("Api Working!"));

app.listen(port,()=>console.log(`Server started on PORT:${port}`));
