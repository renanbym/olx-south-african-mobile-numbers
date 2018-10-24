const checkNumbers = async () => {

    try {
        const response = await fetch(`/api/v1/`);
        const json = await response.json();
        return json;
      } catch (error) {
        console.log(error);
      }

}

const checkNumber = async () => {

  try {
      const response = await fetch(`/api/v1/`);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }

}

const numbersService = { checkNumbers, checkNumber };
export default numbersService;
