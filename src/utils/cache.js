export const clearLocalStorage = () => {
    localStorage.removeItem('selectedPost')
    localStorage.removeItem('userId')
    localStorage.removeItem("fullName");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userLocation");
    //localStorage.removeItem("isReturningUser");
    localStorage.removeItem("role");
    localStorage.removeItem("filter");

}
export const clearUserPreferences = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userCreds");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem('selectedPost')
    localStorage.removeItem("userLocation");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");
    localStorage.removeItem("filter");
    // localStorage.removeItem("isReturningUser");
    
}