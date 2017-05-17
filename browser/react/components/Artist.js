import React from 'react';
import {Link} from 'react-router';
import Albums from './Albums';

class Artist extends React.Component {
  constructor(props) {
    super(props);
    this.artist = props.artist;
    this.selectArtist = props.selectArtist;
    this.albums = props.albums;
  }

  componentDidMount () {
    const artistId = this.props.routeParams.artistId;
    const selectArtist = this.props.selectArtist;

    selectArtist(artistId);
  }

  render () {
    console.log(this.props.albums.findbyId(3));
    return(
      <div>

        <h3>ARTIST NAME</h3>

        {

          // this.props.artist.albums? console.log(this.props.artist.albums):console.log('No albums :(')









        }
        <h4>ALBUMS</h4>

        <h4>SONGS</h4>
      </div>
    )
  }
}

export default Artist;
