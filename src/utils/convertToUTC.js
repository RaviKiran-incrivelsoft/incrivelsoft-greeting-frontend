
const convertToUTC = (localTime) => {
    const localDate = new Date(localTime); // Parse input as local time
    return localDate.toISOString(); // Automatically converts to UTC
};


export default convertToUTC;