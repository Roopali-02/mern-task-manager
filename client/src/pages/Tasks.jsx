import {useState,useEffect} from 'react'
import {
	Button,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
	Pagination
} from "@mui/material";
import API from "../api/axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Tasks = () => {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("pending");

	const [editMode, setEditMode] = useState(false);
	const [currentTaskId, setCurrentTaskId] = useState(null);

	const [tasks, setTasks] = useState([]);
	const [page, setPage] = useState(1); 
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);

	const role = localStorage.getItem("role");

	const fetchTasks = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const res = await API.get(`/tasks?page=${page}&limit=6`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setTasks(res.data.tasks);  
			setTotalPages(res.data.totalPages);
		} catch (err) {
			console.log("Error fetching tasks:", err);
		}finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, [page]);

	const handleCreateTask = async () => {
		try {
			const token = localStorage.getItem("token");
			await API.post(
				"/tasks",
				{ title, description,status },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setOpen(false);
			setTitle("");
			setDescription("");
			setStatus("pending");
			fetchTasks();
		} catch (error) {
			console.log("Error creating task:", error);
		}
};

const handleDelete = async (id) => {
	try {
		const token = localStorage.getItem("token");
		await API.delete(`/tasks/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		fetchTasks(); 
	} catch (error) {
		console.log("Error deleting task:", error);
	}
};

const handleEdit = (task) => {
	setEditMode(true);
	setCurrentTaskId(task._id);
	setTitle(task.title || '');
	setDescription(task.description || '');
	setStatus(task.status || "pending");
	setOpen(true);
};


const handleUpdateTask = async () => {
	try {
		if (!currentTaskId) return;
		const token = localStorage.getItem("token");
		await API.put(
			`/tasks/${currentTaskId}`,
			{ title, description,status },
			{ headers: { Authorization: `Bearer ${token}` } }
		);
		setOpen(false);
		setEditMode(false);
		setCurrentTaskId(null);
		setTitle("");
		setDescription("");
		 setStatus("pending");
		fetchTasks();
	} catch (error) {
		console.log("Error updating task:", error);
	}
};

	return (
		<div className="p-5">
			<div className="flex justify-between items-center mb-8">
			<p className="text-2xl font-bold font-serif dark:text-amber-50">My Tasks</p>
			<Button 
				variant="contained" 
				onClick={() => { setEditMode(false); setCurrentTaskId(null); setTitle(""); setDescription(""); setStatus("pending"); setOpen(true); }} 
				 sx={{
						backgroundColor: "#4CA1AF",
						"&:hover": { backgroundColor: "#5a5a5a" },

						".dark &": {
							backgroundColor: "#355b63",
							"&:hover": { backgroundColor: "#0e7b75" }
						}
					}}
			>
				+ Add Task
			</Button>
			</div>
			{
				loading ? (
				<p className='text-center text-4xl text-teal-700 font-serif'>Loading...</p>
			 ) :
				tasks.length === 0 ? (
				<p className='text-center font-mono text-4xl text-[#4CA1AF] font-medium'>No tasks found</p>
			 ) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{tasks.map((task) => (
						<div
							key={task._id}
							className="relative p-5 rounded-xl bg-white/60 backdrop-blur-sm 
									shadow-[0_4px_12px_rgba(0,0,0,0.15)] 
									hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] 
									transition-all duration-200
									dark:bg-gray-800
									"
						>
						
							<div className="absolute top-3 right-3 flex gap-2">
								<EditIcon
									onClick={() => handleEdit(task)}
									className="text-blue-400 hover:text-blue-300 cursor-pointer transition"
									fontSize="small"
								/>
								{role === "admin" && (
	 							<DeleteIcon
									onClick={() => handleDelete(task._id)}
									className="text-red-400 hover:text-red-300 cursor-pointer transition"
									fontSize="small"
								/>
								)}
							</div>
							<h2 className="text-lg font-semibold pr-10 text-[#4CA1AF] font-mono">{task.title}</h2>
							<p className=" mt-1 line-clamp-3 text-gray-800 font-serif text-sm dark:text-white">
								{task.description || "—"}
							</p>
							<div className="text-base mt-3 text-gray-800">
								<span className="font-medium font-sans dark:text-white">Status : </span>{" "}
								<Chip
									color={task.status === "completed" ?'success':'error'}
									label={task.status === "completed" ?'completed':'pending'}
									size="small" 
								/>
							</div>
							<p className="text-sm text-[#734b6d] font-medium mt-2 dark:text-[#E9E4F0]">
								<span className='text-gray-800 text-base dark:text-white'>Created :</span> {new Date(task.createdAt).toLocaleString()}
							</p>
						</div>
						))}
					</div>
					<div className="flex justify-end mt-6 w-full pagination-wrapper">
						<Pagination
							count={totalPages}
							page={page}
							onChange={(e, value) => setPage(value)}
							color="primary"
						/>
					</div>
				</>
			)}
			<Dialog 
					open={open} 
					onClose={() => setOpen(false)} 
					fullWidth 
					maxWidth="sm"
					SlotProps={{
				sx: {
					bgcolor: "white",
					color: "black",

					".dark &": {
						bgcolor: "#1F2937", 
						color: "#e5e5e5",   
					},
				},
			}}
			>
				<DialogTitle  
					sx={{
						fontFamily: 'sans-serif',
						fontWeight: 600,
						color:'#1976D2',
						fontSize:'26px',
						".dark &": {
						color: "#67e8f9", 
					},
					}}
					>
					{editMode ? "Edit Task" : "Add New Task"}
				</DialogTitle>
				<DialogContent 
					sx={{ 
						display: "flex", 
						flexDirection: "column", 
						gap: 2, 
						mt: 1,
					 overflow: "visible",   
					".dark & .MuiInputBase-root": {
					backgroundColor: "#374151",
				  color: "#e5e5e5",
					},
				".dark & label": {
					color: "#9ca3af",
				},
				}}>
				<TextField
					label="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					fullWidth
				/>
				<TextField
					label="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					fullWidth
					multiline
					rows={3}
				/>
				<TextField
					select
					label="Status"
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					fullWidth
					slotProps={{ select: { native: true } }}
					>
						<option value="pending" className='dark:text-gray-500'>Pending</option>
						<option value="completed" className='dark:text-gray-500'>Completed</option>
					</TextField>
				</DialogContent>

				<DialogActions
					sx={{ mb: 3 }}
				>
					<Button 
						onClick={() => { setOpen(false); setEditMode(false); setCurrentTaskId(null); }}
						sx={{backgroundColor:'#333',color:'#fff',
						".dark &": {
					backgroundColor: "#0d9488",
					"&:hover": { backgroundColor: "#0f766e" },
				},
						
						}}
						>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={editMode ? handleUpdateTask : handleCreateTask}
						sx={{
				".dark &": {
					backgroundColor: "#4CA1AF",
					"&:hover": { backgroundColor: "#3b8d9b" },
				},
			}}
					>
					{editMode ? "Update" : "Create"}
					</Button>
				</DialogActions>
		</Dialog>
		</div>
	)
}

export default Tasks