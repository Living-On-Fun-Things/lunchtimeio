import { useState, useEffect } from "react"
import chatImage from './assets/videoChat.svg'
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import countapi from 'countapi-js';

const request = require('request');
const numberToWords = require('number-to-words');
const fetch = require("node-fetch");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  timeOfDayText: {
    fontSize: '2vw'
  },
  toolBarCustom: {
    color: '#282c34',
    backgroundColor: '#282c34',
  },
  morningButton: {
    color: '#282c34',
    backgroundColor: '#ffffa1',
    padding: '10%',
    margin: "10%"
  },
  afternoonButton: {
    color: '#282c34',
    backgroundColor: '#ffd0a1',
    padding: '10%',
    margin: "10%"
  },
  eveningButton: {
    color: '#282c34',
    backgroundColor: '#a1d0ff',
    padding: '10%',
    margin: "10%"
  },
  lateButton: {
    color: '#282c34',
    backgroundColor: '#a1a1ff',
    padding: '10%',
    margin: "10%"
  },
}));

//API links
const API_TIMESLOT_INTEREST = ''
const API_UPDATE_COUNTER = ''
const API_GET_ZOOMLINK = ''


function App() {

  const classes = useStyles();
  const [stageTwoVisible, setstageTwoVisible] = useState(false)
  const [stageThreeVisible, setstageThreeVisible] = useState(false)
  const [stageFourVisible, setstageFourVisible] = useState(false)

  //State variables for the requests
  const [pptWanted, setpptWanted] = useState(0)
  const [timeWanted, setTimeWanted] = useState(0)
  const [dayTimeSelect, setDayTimeSelect] = useState(0)

  //State variable for zoom link
  const [zoomID, setZoomID] = useState('Just give us a second...')

  //State variable for interest in the public community call
  const [interest, setInterest] = useState(null | Array)

  const timeSelect = (x) => {
    console.log('Selected time: ' + x);
    scroll.scrollToBottom();
    setTimeWanted(x);
    setstageFourVisible(true);
  }

  const timeOfDaySelect = (x) => {
    console.log('Selected moment of day: ' + x);
    scroll.scrollToBottom();
    setDayTimeSelect(x);
    setstageThreeVisible(true);
  }

  const pptSelected = (x) => {
    console.log('Selected ppt: ' + x)
    setpptWanted(x);
    setstageFourVisible(true);

  }

  const startOnboarding = () => {
    setstageTwoVisible(true);
    scroll.scrollToBottom();
  }

  const interestWordsmith = (x) => {
    if (x == 0) {
      return "No one has booked"
    }

    if (x == 1) {
      return "1 person has booked"
    }

    if (x > 1) {
      return x + " people have booked"
    }
  }


  useEffect(() => {

    const fetchData = async () => {
      if (stageThreeVisible) {

        console.log('Fetching data...')

        fetch(API_TIMESLOT_INTEREST, {
          method: 'GET',
        }).then((response) => {
          return response.json();
        }).then((data) => {
          setInterest(data);
        });

        console.log('Stopped fetching data...')
      }
    }

    fetchData();

  }, [stageThreeVisible]);

  useEffect(() => {

    console.log(interest)

  }, [interest]);

  useEffect(() => {

    const fetchData = async () => {
      if (stageThreeVisible) {

        console.log('Fetching data...')

        const payload = {
          time: timeWanted,
          ppt: pptWanted
        };

        fetch(API_UPDATE_COUNTER, {
          method: 'POST',
          body: JSON.stringify(payload)
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log('Marked interest');
        });

        fetch(API_GET_ZOOMLINK, {
          method: 'POST',
          body: JSON.stringify(payload)
        }).then((response) => {
          console.log(response)
          return response.json();
        }).then((data) => {
          console.log(data);
          setZoomID(data.response)
        });

        console.log('Stopped fetching data...')
      }
    }

    fetchData();

  }, [stageFourVisible]);


  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar className={classes.toolBarCustom}>
          <Button variant="outlined" size="large" color="secondary" onClick={() => { startOnboarding() }}>Join</Button>
        </Toolbar>
      </AppBar>

      <div className="App-header">

        <Grid container>
          <Grid item xs={6}>
            <img src={chatImage} alt="logo" />
          </Grid>
          <Grid item xs={6}>

            <div>
              <h1>
                Welcome to Lunchtime!
              </h1>
              <h2>
                Meeting other people is tough during COVID-19.
              </h2>
              <p>

                Select a time and turn up. No sign up, just have fun.
                Oh, you are going to need a Zoom account for this.

                Meet others just like you.
              </p>
            </div>
            <Button variant="outlined" size="large" color="secondary" onClick={() => { startOnboarding() }}>Join</Button>

          </Grid>
        </Grid>
      </div>

      {stageTwoVisible && <div className="App-header">

        <h2>
          Pick a time in the day which works best for you (currently only in GMT)
        </h2>

        <Grid container xs={6}>
          <Grid item xs={6}>
            <div className={classes.morningButton} onClick={() => { timeOfDaySelect(1) }}>
              <Button color="inherit">
                <div>
                  <h2 className={classes.timeOfDayText}>Morning</h2>

                </div>
              </Button>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.afternoonButton} onClick={() => { timeOfDaySelect(2) }}>
              <Button color="inherit">
                <div>
                  <h2 className={classes.timeOfDayText}>Afternoon</h2>

                </div>
              </Button>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.eveningButton} onClick={() => { timeOfDaySelect(3) }}>
              <Button color="inherit">
                <div>
                  <h2 className={classes.timeOfDayText}>Evening</h2>

                </div>
              </Button>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.lateButton} onClick={() => { timeOfDaySelect(0) }}>
              <Button color="inherit">
                <div>
                  <h2 className={classes.timeOfDayText}>Late</h2>

                </div>
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
      }



      {stageThreeVisible && <div className="App-header">

        <h2>
          What time works best for you?
        </h2>

        <Grid container xs={6}>
          <Grid item xs={6}>
            <Button color="inherit" onClick={() => { timeSelect(dayTimeSelect * 6) }}>
              <div>
                <h2>
                  {dayTimeSelect * 6}:00 {(dayTimeSelect * 6) < 12 ? "AM" : "PM"}
                </h2>
                <p> {interest ? interestWordsmith(interest['response'][dayTimeSelect * 6]) : "Getting interest..."} </p>
              </div>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button color="inherit" onClick={() => { timeSelect((dayTimeSelect * 6) + 1) }}>
              <div>
                <h2>
                  {(dayTimeSelect * 6) + 1}:00 {((dayTimeSelect * 6) + 1) < 12 ? "AM" : "PM"}
                </h2>
                <p> {interest ? interestWordsmith(interest['response'][(dayTimeSelect * 6) + 1]) : "Getting interest..."} </p>
              </div>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button color="inherit" onClick={() => { timeSelect((dayTimeSelect * 6) + 2) }}>
              <div>
                <h2>
                  {(dayTimeSelect * 6) + 2}:00 {((dayTimeSelect * 6) + 2) < 12 ? "AM" : "PM"}
                </h2>
                <p> {interest ? interestWordsmith(interest['response'][(dayTimeSelect * 6) + 2]) : "Getting interest..."} </p>
              </div>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button color="inherit" onClick={() => { timeSelect((dayTimeSelect * 6) + 3) }}>
              <div>
                <h2>
                  {(dayTimeSelect * 6) + 3}:00 {((dayTimeSelect * 6) + 3) < 12 ? "AM" : "PM"}
                </h2>
                <p> {interest ? interestWordsmith(interest['response'][(dayTimeSelect * 6) + 3]) : "Getting interest..."} </p>
              </div>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button color="inherit" onClick={() => { timeSelect((dayTimeSelect * 6) + 4) }}>
              <div>
                <h2>
                  {(dayTimeSelect * 6) + 4}:00 {((dayTimeSelect * 6) + 4) < 12 ? "AM" : "PM"}
                </h2>
                <p> {interest ? interestWordsmith(interest['response'][(dayTimeSelect * 6) + 4]) : "Getting interest..."} </p>
              </div>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button color="inherit" onClick={() => { timeSelect((dayTimeSelect * 6) + 5) }}>
              <div>
                <h2>
                  {(dayTimeSelect * 6) + 5}:00 {((dayTimeSelect * 6) + 5) < 12 ? "AM" : "PM"}
                </h2>
                <p> {interest ? interestWordsmith(interest['response'][(dayTimeSelect * 6) + 5]) : "Getting interest..."} </p>
              </div>
            </Button>
          </Grid>
        </Grid>
      </div>
      }


      {stageFourVisible && <div className="App-header">

        <h2>
          {(zoomID != "WAIT") ? <div>  <h1> Here is your Zoom link </h1> <p> You need a Zoom account to access this </p> <a href={zoomID}>{zoomID}</a> </div> :
            <div> <h3> Please wait till your time comes </h3> <h3> Feel free to refresh the page when the time comes </h3> </div>}
        </h2>
      </div>
      }
    </div>
  );
}

export default App;
