import axios from "axios";

const Logged = async (data, navigate , logininfo) => {

  try {
    await axios.post("/login", data).then((res) => {


      const main = res.data;



      if (res.data.valid == "success") {
        let token = main.access;
        localStorage.setItem("accessToken" , token)
        logininfo(main) ;
        navigate();
      } else {
        alert("Wrong Password or Email");
      }
    });
  } catch (error) {
    const message = error?.response?.data?.message || "Login failed";
    alert(message);
    console.log(error);
  }
};

export default Logged;
