import axios from 'axios'


const  SignedUp = async(data , navigate)=>{
   
try {
    await axios.post('/register' , data );
    alert("You are Registered , You can Login Now");
    navigate();

} catch (error) {
    const message = error?.response?.data?.message || "Registration failed";
    alert(message);
    console.log(error);
}



}

export default SignedUp
