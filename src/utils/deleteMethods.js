import axios from "axios";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");

const deleteMarriageDetails = async(id) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/marriages/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if(response.status === 200)
        {
            toast.success(response.data.message, {
				position: "top-center",
				theme: "colored",
			});
        }
        else{
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Failed to delete.";
        toast.error(errorMessage, {
            position: "top-center",
            theme: "colored",
        });
    }
}

const deleteTempleDetails = async(id) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/temple/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if(response.status === 200)
        {
            toast.success(response.data.message, {
				position: "top-center",
				theme: "colored",
			});
        }
        else{
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Failed to delete";
        toast.error(errorMessage, {
            position: "top-center",
            theme: "colored",
        });
    }
}

const deleteFestivalDetails = async(id) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/festivals/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if(response.status === 200)
        {
            toast.success(response.data.message, {
				position: "top-center",
				theme: "colored",
			});
        }
        else{
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Failed to delete";
        toast.error(errorMessage, {
            position: "top-center",
            theme: "colored",
        });
    }
}

const deleteEventDetails = async(id) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/events/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if(response.status === 200)
        {
            toast.success(response.data.message, {
				position: "top-center",
				theme: "colored",
			});
        }
        else{
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Failed to delete";
        toast.error(errorMessage, {
            position: "top-center",
            theme: "colored",
        });
    }
}

const deleteBirthDatDetails = async(id) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/birthdays/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if(response.status === 200)
        {
            toast.success(response.data.message, {
				position: "top-center",
				theme: "colored",
			});
        }
        else{
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Failed to delete";
        toast.error(errorMessage, {
            position: "top-center",
            theme: "colored",
        });
    }
}


export  { deleteMarriageDetails, deleteTempleDetails, deleteFestivalDetails, deleteEventDetails, deleteBirthDatDetails };