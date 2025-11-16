import { useState,useEffect } from "react";
import { TextField, Button, Card, CardContent, Divider,InputAdornment,IconButton } from "@mui/material";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {Visibility,VisibilityOff} from '@mui/icons-material';


const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error,setError] = useState(null);
	const navigate = useNavigate();

	useEffect(()=>{
		if(error){
			setTimeout(()=>{
				setError('');
			},2000)
		}
	},[error])

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleLogin = async(e) => {
		e.preventDefault();
		try {
		const res = await API.post("/auth/login", {
			email,
			password,
		});
		localStorage.setItem("token", res.data.token);
		localStorage.setItem("role", res.data.user.role);
		navigate("/dashboard");
	} catch (error) {
		setError(error.response?.data?.message || "Login failed");
	}
	};


	return (
		 <div className="flex items-center justify-center h-screen bg-gray-100">
			<Card className="w-[380px] shadow-xl">
				<CardContent>
					<div className="text-center font-bold login-bg py-12 text-white text-4xl">
						Login
					</div>

					<form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
						<TextField
							label="Email"
							type="email"
							fullWidth
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							size="small"
						/>

						<TextField
							label="Password"
							type={showPassword ? "text" : "password"}
							fullWidth
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							size="small"
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={handleClickShowPassword} edge="end">
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									},
								}}
						/>

						<Button type="submit" variant="contained" fullWidth className="login-bg">
							Login
						</Button>
						{error&&<p className="text-red-600 text-center">{error}</p>}
						 <Divider>OR if account doesn't exist</Divider>
						 <Button variant="contained" fullWidth className="lightblue-bg" onClick={()=>navigate('/')}>
							signup
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default Login