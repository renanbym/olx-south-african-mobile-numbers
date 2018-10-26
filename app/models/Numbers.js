const { enumError } = require('./enums');


const isValid = (n) => {
    const str = n.toString();

    if (str.match(/[^0-9\s\+]/i)) return false;
    if (!str.match(/^27\d*/i)) return false;
    if (str.replace(/[^0-9]/gi, '').length != 11) return false;
    return true;
}

const reasonError = (n) => {
    const str = n.toString();

    if (str.match(/[^0-9\s\+]/i)) return enumError.ONLY_NUMBER;
    if (!str.match(/^27\d*/i)) return enumError.BEGIN_NUMBER;
    if (str.replace(/[^0-9]/gi, '').length != 11) return enumError.COUNT_NUMBER;

    
    return str;
}


const formatNumber = (n) => {
    const str = n.replace(/[^0-9]/gi, '');
    const format = str.match(/^(\d{2})(\d{2})(\d{3})(\d{4})$/i);
    return `${format[1]} ${format[2]} ${format[3]} ${format[4]}`;
}

const getNumbers = (numbers) => {
    if (!numbers) return false;
    return numbers.reduce((acc, phone) => {

        if (isValid(phone)) {
            const formatedPhone = formatNumber(phone);
            acc.corrected.push({ phone: formatedPhone, modified: false });
        } else {
            const reason = reasonError(phone);
            acc.incorrected.push({ phone, reason });
        }

        return acc;
    }, { corrected: [], incorrected: [] })
}

module.exports = { getNumbers };