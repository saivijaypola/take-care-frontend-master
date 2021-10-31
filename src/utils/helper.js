export const generateDigitalId = () => {

    var digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var otpLength = 4;

    var otp = '';

    for (let i = 1; i <= otpLength; i++) {

        var index = Math.floor(Math.random() * (digits.length));

        otp = otp + digits[index];

    }

    return otp;

}

export const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }