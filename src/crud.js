import axios from 'axios';

const getPUUID = async (ign, tag) => {
  const url = `http://localhost:3000/api/puuid/${ign}/${tag}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting PUUID:', error);
  }
};

const getMatchIds = async (puuid) => {
  const url = `http://localhost:3000/api/match-ids/${puuid}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting match IDs:', error);
  }
};

const getMatchData = async (matchId) => {
  const url = `http://localhost:3000/api/match-data/${matchId}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting match data:', error);
  }
};

const getPlayerData = async (ign, tag, index) => {
  try {
    const puuid = await getPUUID(ign, tag);
    console.log('PUUID:', puuid);
    
    const matchIds = await getMatchIds(puuid);
    console.log('Match IDs:', matchIds);
    
    const matchId = matchIds[index];
    const matchData = await getMatchData(matchId);
    console.log('Match Data:', matchData);

    const participants = matchData.metadata.participants;
    const playerIndex = participants.indexOf(puuid);
    
    const playerData = matchData.info.participants[playerIndex];
    console.log('Summoner Name:', playerData.summonerName);
    
    const champ = playerData.championName;
    const kills = playerData.kills;
    const deaths = playerData.deaths;
    const assists = playerData.assists;
    const win = playerData.win;

    console.log('Champ:', champ, 'Kills:', kills, 'Deaths:', deaths, 'Assists:', assists, 'Win:', win);
    
    return {
      summonerName: playerData.summonerName,
      championName: champ,
      kills: kills,
      deaths: deaths,
      assists: assists,
      win: win
    };
  } catch (error) {
    console.error('Error getting player data:', error);
  }
};

export default {
  getPUUID,
  getMatchIds,
  getMatchData,
  getPlayerData
};
