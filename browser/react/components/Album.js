import React from 'react';
import Songs from '../components/Songs';

class Album extends React.Component {
  constructor(props) {
    super(props);
    this.album = props.album;
    this.currentSong = props.currentSong;
    this.isPlaying = props.isPlaying;
    this.toggleOne = props.toggleOne;
  }

  componentDidMount () {
    const albumId = this.props.routeParams.albumId;
    const selectAlbum = this.props.selectAlbum;

    selectAlbum(albumId);
  }

  render () {
    return(
      <div className="album">
        <div>
          <h3>{ this.props.album.name }</h3>
          <img src={ this.props.album.imageUrl } className="img-thumbnail" />
        </div>
        <Songs
          songs={this.props.album.songs}
          currentSong={this.currentSong}
          isPlaying={this.isPlaying}
          toggleOne={this.toggleOne} />
      </div>
    )
  }
}

export default Album;
