
// const fs = require('fs');

// const enumError = {
//     ONLY_NUMBER: 'accept number only',
//     BEGIN_NUMBER: 'number begin with 27 in south africa',
//     COUNT_NUMBER: 'the numbers in south africa is 11'
// }

// //27 south africa
// //87
// const isValid = (n) => {
//     if (n.match(/[^0-9\+]/i)) return false
//     if (!n.match(/^27\d*/i)) return false;
//     if (n.length != 11) return false;
//     return true;
// }

// const reasonError = (n) => {
//     if (n.match(/[^0-9\+]/i)) return enumError.ONLY_NUMBER;
//     if (!n.match(/^27\d*/i)) return enumError.BEGIN_NUMBER;
//     if (n.length != 11) return enumError.COUNT_NUMBER;
//     return n;
// }


// const formatNumber = (n) => {
//     const format = n.match(/^(\d{2})(\d{2})(\d{3})(\d{4})$/i);
//     return `${format[1]} ${format[2]} ${format[3]} ${format[4]}`;
// }

// const getNumbers = (numbers) => {
//     return numbers.reduce((acc, phone) => {

//         if (isValid(phone)) {
//             const formatedPhone = formatNumber(phone);
//             acc.corrected.push({ phone: formatedPhone, modified: false });
//         } else {
//             const reason = reasonError(phone);
//             acc.incorrected.push({ phone, reason });
//         }

//         return acc;
//     }, { corrected: [], incorrected: [] })
// }

// function readFile(file) {

//     fs.readFile(file, 'utf8', async (err, data) => {
//         if (err) return console.log('error loading file');
//         const lines = data.split(/\r?\n/).reduce((acc, cur, idx) => {
//             if (idx > 0) acc.push(cur.split(',')[1]);
//             return acc;
//         }, [])

//         const ck = await getNumbers(lines);

//     });

//     return true;
// }


// readFile('./phones.csv');