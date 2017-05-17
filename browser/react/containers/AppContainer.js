import React, { Component } from 'react';
import axios from 'axios';

import initialState from '../initialState';
import AUDIO from '../audio';

import Albums from '../components/Albums.js';
import Album from '../components/Album';
import Artists from '../components/Artists';
import Artist from '../components/Artist';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';

import { convertAlbum, convertAlbums, skip } from '../utils';

export default class AppContainer extends Component {

  constructor (props) {
    super(props);
    this.state = initialState;

    this.toggle = this.toggle.bind(this);
    this.toggleOne = this.toggleOne.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.selectAlbum = this.selectAlbum.bind(this);
    this.deselectAlbum = this.deselectAlbum.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
    this.deselectArtist = this.deselectArtist.bind(this);
  }

  componentDidMount () {
    axios.get('/api/albums/')
      .then(res => res.data)
      .then(album => this.onLoad(convertAlbums(album, null)));
    axios.get('/api/artists/')
      .then(res => res.data)
      .then(artists => this.onLoad(null, artists));
    AUDIO.addEventListener('ended', () =>
      this.next());
    AUDIO.addEventListener('timeupdate', () =>
      this.setProgress(AUDIO.currentTime / AUDIO.duration));
  }

  onLoad (albums, artists) {
    if(albums) {
      this.setState({
        albums: albums
      });
    }
    if(artists){
      this.setState({
        artists: artists
      });
    }
  }

  play () {
    AUDIO.play();
    this.setState({ isPlaying: true });
  }

  pause () {
    AUDIO.pause();
    this.setState({ isPlaying: false });
  }

  load (currentSong, currentSongList) {
    AUDIO.src = currentSong.audioUrl;
    AUDIO.load();
    this.setState({
      currentSong: currentSong,
      currentSongList: currentSongList
    });
  }

  startSong (song, list) {
    this.pause();
    this.load(song, list);
    this.play();
  }

  toggleOne (selectedSong, selectedSongList) {
    if (selectedSong.id !== this.state.currentSong.id)
      this.startSong(selectedSong, selectedSongList);
    else this.toggle();
  }

  toggle () {
    if (this.state.isPlaying) this.pause();
    else this.play();
  }

  next () {
    this.startSong(...skip(1, this.state));
  }

  prev () {
    this.startSong(...skip(-1, this.state));
  }

  setProgress (progress) {
    this.setState({ progress: progress });
  }

  selectAlbum (albumId) {
    axios.get(`/api/albums/${albumId}`)
      .then(res => res.data)
      .then(album =>{
        return (

          this.setState({
            selectedAlbum: convertAlbum(album)
          })
        )
      });
  }

  selectArtist (artistId) {
    axios.get(`/api/artists/${artistId}/`)
      .then(res => res.data)
      .then(artist => {
        return(
          this.setState({
            selectedArtist: artist
          })
        )

      })
      .then(()=>{
        return axios.get(`/api/artists/${artistId}/albums`)
      })
      .then(res=>res.data)
      .then(albums=>{
          // console.log(albums);
          this.state.selectedArtist.albums=albums
          return this.state.selectedArtist.albums
      })
      .then(()=>{
        return axios.get(`/api/artists/${artistId}/songs`)
      })
      .then(res=>res.data)
      .then(songs=>{
          // console.log(songs);
          this.state.selectedArtist.songs=songs
          return this.state.selectedArtist.songs
      })
  }

  // selectedArtistAlbums(artistId){
  //   axios.get(`/api/artists/${artistId}/albums`)
  //     .then(res=>res.data)
  //     .then(artist=>{
  //       this.setState({
  //         selectedArtist:artist
  //       })
  //       return
  //     })
  // }


  deselectAlbum () {
    this.setState({ selectedAlbum: {}});
  }

  deselectArtist () {
    this.setState({ selectedArtist: {}});
  }

  render () {
    return (
      <div id="main" className="container-fluid">
        <div className="col-xs-2">
          <Sidebar deselectAlbum={this.deselectAlbum} />
        </div>
        <div className="col-xs-10">
        {
          this.props.children ?
            React.cloneElement(this.props.children, {
              album: this.state.selectedAlbum,
              artist: this.state.selectedArtist,
              currentSong: this.state.currentSong,
              isPlaying: this.state.isPlaying,
              toggleOne: this.toggleOne,
              albums: this.state.albums,
              selectAlbum: this.selectAlbum,
              selectArtist: this.selectArtist,
              artists: this.state.artists
            })
            : null
        }
        </div>
        <Player
          currentSong={this.state.currentSong}
          currentSongList={this.state.currentSongList}
          isPlaying={this.state.isPlaying}
          progress={this.state.progress}
          next={this.next}
          prev={this.prev}
          toggle={this.toggle}
        />
      </div>
    );
  }
}
