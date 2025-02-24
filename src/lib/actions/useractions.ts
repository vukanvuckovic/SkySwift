// export const logOut = async () => {
//   try {
//     const response = await fetch("http://localhost:3000/api/auth/logout", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       console.log(response.statusText);
//       return;
//     }

//     localStorage.removeItem("user");

//     return { status: true };
//   } catch (error) {
//     console.error(error);
//   }
// };
