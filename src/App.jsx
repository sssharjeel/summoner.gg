import { useState } from "react";
import crud from "./crud";
import "./App.css";

const App = () => {
  const [tagline, setTagline] = useState('');
  const [gameName, setGameName] = useState('');
  const [matchHistory, setMatchHistory] = useState([])

  const handleTagLine = (event) => {
    setTagline(event.target.value);
  };

  const handleGameName = (event) => {
    setGameName(event.target.value);
  };

  
  const doOneSearch = (event, index) => {
    event.preventDefault();
    crud.getPlayerData(gameName, tagline, index)
        .then(playerData => {
            const imgURL = `https://ddragon.leagueoflegends.com/cdn/14.13.1/img/champion/${playerData.championName}.png`;
            const champion = playerData.championName;
            const kda = `${playerData.kills}/${playerData.deaths}/${playerData.assists}`;
            const result = playerData.win ? 'W' : 'L';

            const matchObject = {
                url: imgURL,
                name: champion,
                kda: kda,
                res: result
            };

            setMatchHistory(prevMatchHistory => [...prevMatchHistory, matchObject]);

            console.log('Player Data:', playerData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

const startSearch = (event) => {

  setMatchHistory([]);

  for (let i = 0; i < 5; i++) {
    doOneSearch(event, i);
}


}


  const TableRow = ({srcURL, cname, k_d_a, res}) => {
    return (
        <tr>
            <th scope="row"> <img src={srcURL}></img></th>
            <td>{cname}</td>
            <td>{k_d_a}</td>
            <td>{res}</td>
        </tr>
    )
}

const TableContent = ({matchHistory}) => {
    return (matchHistory.map((m) => <TableRow srcURL={m.url} cname={m.name} k_d_a={m.kda} res={m.res} ></TableRow>))
}


const Content = () => {
        return (
            <table>
                <thead>
                    <tr>
                        <th scope="col">Icon</th>
                        <th scope="col">Name</th>
                        <th scope="col">KDA</th>
                        <th scope="col">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <TableContent matchHistory={matchHistory}> </TableContent>
                </tbody>
                </table>
           )
}



  return (
    <div>
      <p>welcome summoner</p>
      <form onSubmit={startSearch}>
        <div>
          <label>name</label>
          <input name="gameName" value={gameName} onChange={handleGameName} />
          <br /><br />
          <label>tagline</label>
          <input name="tagline" value={tagline} onChange={handleTagLine} />
          <br /><br />
          <button type="submit">search</button>
        </div>
        <br></br>
        <Content></Content>
      </form>
    </div>
  );
};

export default App;
