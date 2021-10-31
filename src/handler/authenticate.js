export const setUser = (idToken, refreshToken, email) => {
    var userCreds = {
        idToken: idToken,
        refreshToken: refreshToken,
        email: email
    }
    localStorage.setItem('userCreds', JSON.stringify(userCreds))
}
export const getUser = () => JSON.parse(localStorage.getItem('userCreds'))