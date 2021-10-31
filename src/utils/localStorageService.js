
import * as firebase from "firebase";
const LocalStorageService = (function () {
  var _service;
  function _getService() {
    if (!_service) {
      _service = this;
      return _service
    }
    return _service
  }
  function _setToken(tokenObj) {
    localStorage.setItem('x-access-token', tokenObj.access_token);
    localStorage.setItem('refresh_token', tokenObj.refresh_token);

  }
  async function _getAccessToken() {
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
          
         return await user.getIdToken()
      } else {
        return null
      }
    })
    return localStorage.getItem('x-access-token');
  }
  function _getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
  function _clearToken() {
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('refresh_token');
  }
  return {
    getService: _getService,
    setToken: _setToken,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken
  }
})();
export default LocalStorageService;
