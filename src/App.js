import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import resume from './imgs/resume.png';
import linkedin from './imgs/linkedin.png';
import github from './imgs/github.png';
import logo from './imgs/spotLogo.png';
import err404 from './imgs/404.png';
import listen from './imgs/listen.png';



const CLIENT_ID = ''; // Your client id
const CLIENT_SECRET = ''; // Your client secret

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    };

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(response => response.json())
      .then(data => setAccessToken(data.access_token));
  }, []);

  // Search
  async function search() {
      if (searchInput.trim() === '') {
        // Show default image if nothing is entered
        setSearchInput('default');
    }
    else{
      console.log("searching for " + searchInput);
      var searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      };

      var artistID = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, searchParameters)
        .then(response => response.json())
        .then(data => data.artists.items[0].id);

      console.log('Artist id is ' + artistID);

      await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=48`, searchParameters)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setAlbums(data.items);
        });
    }
  }

  return (
    <div className="App" style={{ backgroundColor: '#191414', minHeight: '100vh', padding: '20px' }}>
      
      <Container className="main-container text-center" style={{ marginBottom: '20px' }}>
        <Row className="align-items-center">
          <h1 style={{ 
            color: '#FFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
            fontSize: '35px',
            fontWeight: 'bold',
            marginBottom: '10px',
            marginTop: '10px',
            padding:"auto",
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            letterSpacing: '1px' }}>
            <a href="https://spotify-album-finder.netlify.app/" target="_self">
            <img src={logo} style={{ width: '80px', height: '80px', marginBottom: '10px',marginRight:"20px" }} alt='logo' />
            </a>
            Spotify Album Finder
          </h1>
          <div className="d-flex justify-content-center">
            <FormControl 
              placeholder='Search Artists'
              
              type="input"
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  search();
                }
              }}
              onChange={event => setSearchInput(event.target.value)}
              style={{ backgroundColor: '#ffffff', borderRadius: '5px', height: "100", width: '400px',marginRight:"20px"}}
            />
            <Button onClick={search} variant="success" className='justify-content-center'>
              Search</Button>
          </div>
          <div>
          {searchInput === 'default' && (
            <img className='align-items-center' style={{width: '500px', height: '500px', marginBottom: '10px',marginTop: '30px'}}src={err404} alt="error" />
          )}
          </div>
        </Row>
      </Container>
      <Container className='justify-content-center'>
        <Row className='mx-2 row row-cols-4'>
          {albums.map((album, i) => (
            <Card key={i} className="mb-4" style={{ width: '18rem', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#282828', margin: '10px' }}>
              <div className="image-container">
              <a href={album.uri} target="_blank" rel="noopener noreferrer">
                <Card.Img
                  variant="top"
                  src={album.images[0].url}
                  className="card-img"
                  style={{ borderRadius: '10px 10px 0 0', objectFit: 'cover', height: '250px', marginBottom: '5px', marginTop: '8px' }}
                />
              </a>
              </div>
              <Card.Body className="card-body" style={{ textAlign: 'left',position: 'auto' }}>
                <Card.Title className="card-title" style={{ color: '#ffffff' }}>{album.name}</Card.Title>
                <Card.Text className="card-text" style={{ color: '#ffffff',margin: '1px 0'}}>Artist: {album.artists[0].name} </Card.Text>
                <Card.Text className="card-text" style={{ color: '#ffffff',margin: '1px 0' }}>Tracks: {album.total_tracks} </Card.Text>
                <Card.Text className="card-text" style={{ color: '#ffffff',margin: '1px 0' }}>Released: {album.release_date}</Card.Text>
              </Card.Body>
              <a className = "justify-content-center" style={{marginLeft: 'auto',marginRight: 'auto',marginTop: '-10px', marginBottom:'10px' }} href={album.uri} target="_blank" rel="noopener noreferrer">
                  <img style={{ width: 200, height: 75}} src={listen} alt="listen" />
                </a>
            </Card>
          ))}
        </Row>
      </Container>

      <footer style={{ position: 'auto', left: 0, bottom: 0, width: '100%', backgroundColor: 'transparent', padding: '20px', color: 'white', textAlign: 'center' }}>
        <Container>
          <text style={{ fontSize: '20px' }}>© 2023 Jihadul Islam. All Rights Reserved</text>
          <div className="footer-images" style={{margin:'10px'}}>
          <a href="https://www.linkedin.com/in/jihadul/" target="_blank" rel="noopener noreferrer">
          <img style={{ width: 50, height: 50, marginRight:'10px' }} src={linkedin} alt="linked" />
          </a>
          <a href="https://jihxdul.netlify.app/" target="_blank" rel="noopener noreferrer">
          <img style={{ width: 50, height: 50,marginLeft:'10px', marginRight:'10px' }} src={resume} alt="Portfolio" />
          </a>
          <a href="https://github.com/Jihxdul" target="_blank" rel="noopener noreferrer">
          <img style={{ width: 50, height: 50,marginLeft:'10px'}} src={github} alt="" />
          </a>
         
        </div>
          
        </Container>
      </footer>  
      
    </div>

  );
}

export default App;

