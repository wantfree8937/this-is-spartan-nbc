export const getGameClassStats = async () => {
    const [rows] = await pools.GAME_DB.query(GAME_QUERIES.FIND_ALL_CLASS_STATS);
    const camelCasedRows = rows.map(toCamelCase);
    const jsonString = JSON.stringify(camelCasedRows);
    return jsonString;
};