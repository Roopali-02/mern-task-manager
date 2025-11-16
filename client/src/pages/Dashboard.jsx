import React, { useEffect, useState } from "react"
import Tasks from './Tasks'
import { AppBar, Toolbar, IconButton } from "@mui/material";
import {LightMode,DarkMode} from "@mui/icons-material";



const Dashboard = () => {
 const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "dark") {
			document.documentElement.classList.add("dark");
			setDarkMode(true);
		} else {
			document.documentElement.classList.remove("dark");
			setDarkMode(false);
		}
	}, []);

	const toggleTheme = () => {
		const newMode = !darkMode;
		setDarkMode(newMode);

		if (newMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	return (
		 <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			<AppBar position="static">
				<Toolbar className="flex justify-between bg-[#4CA1AF] dark:bg-[#355b63]">
					<p className="font-serif text-xl font-medium text-white">
						Task Manager
					</p>
  				<div className="flex items-center gap-4">
    
					{/* Theme Toggle */}
					<IconButton onClick={toggleTheme} color="inherit">
						{darkMode ? (
							<LightMode className="text-yellow-300" />
						) : (
							<DarkMode className="text-white" />
						)}
					</IconButton>

					{/* Logout */}
					<IconButton 
						color="inherit"
						onClick={() => {
							localStorage.removeItem("token");
							localStorage.removeItem("role");
							window.location.href = "/";
						}}
					>
						<p className="text-white font-semibold text-base">Logout</p>
					</IconButton>
  </div>

</Toolbar>
			</AppBar>

			<Tasks />
			
		</div>
	)
}

export default Dashboard