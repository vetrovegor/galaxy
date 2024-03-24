export const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}