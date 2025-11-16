import { useState,useEffect } from "react";
import { TextField, Button, Card, CardContent, Divider,InputAdornment ,IconButton  } from "@mui/material";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {Visibility,VisibilityOff} from '@mui/icons-material';


const Signup = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("user");
	const [showPassword, setShowPassword] = useState(false);
	const [message,setMessage] = useState(null);
	const navigate = useNavigate();

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	useEffect(()=>{
	if(message&&!message.includes('successful')){
		setTimeout(() => {
			setMessage(null);
		}, 2000);
	}
	},[message])

	const handleSignup =async (e) => {
		e.preventDefault();
	 if (!name || !email || !password) {
		setMessage("All fields are required.");
		return;
	}
	if (password.length < 6) {
		setMessage("Password must be at least 6 characters long");
		return;
	}
		try {
		await API.post("/auth/signup", {
			name,
			email,
			password,
			role
		});
		setMessage('Signup successful! you will be now redirected to login page.');
		setTimeout(() => {
		setMessage(null);
		navigate("/login");
		}, 3000);
	} catch (error) {
		setMessage(error.response?.data?.message || "Signup failed");
	}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<Card className="w-[380px] shadow-xl">
				<CardContent>
					<div className="text-center font-bold signup-bg py-12 text-white text-4xl">
						Signup
					</div>
					<form onSubmit={handleSignup} className="flex flex-col gap-4 mt-4">
						<TextField
							label="Name"
							fullWidth
							value={name}
							onChange={(e) => setName(e.target.value)}
							size="small"
						/>
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
						<TextField
							select
							label="Role"
							fullWidth
							size="small"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							slotProps={{ native: true }}
            >
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</TextField>
						<Button type="submit" variant="contained" className="signup-bg" fullWidth>
							Signup
						</Button>
						{message&&
						<p className={`text-center ${message.includes('successful')?'text-green-600':'text-red-600'}`}>{message}</p>}
						<Divider>OR if account exists</Divider>
						 <Button variant="contained" className="lightblue-bg" fullWidth onClick={()=>navigate('/login')}>
							Login
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default Signup