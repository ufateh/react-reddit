import _ from 'lodash';
import React from 'react';
import Wallpapers from './wallpapers';
import SearchBar from './search_bar';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.url = 'https://www.reddit.com/r/';
    this.sorts = ['hot','new','top','controversial','rising'];
  }
    
  state = {
    currentSubreddit: 'reactjs',
    sort: 'new',
    files: [],
    after: null,
    before: null,
    page: 1
  };

  componentDidMount() {
    this.changeSubreddit(this.state.currentSubreddit);
  }

  nextPage = () => {
    fetch(this.url + this.state.currentSubreddit + "/" + this.state.sort + ".json?count=" + (this.state.page * 25) + "&after=" + this.state.after)
      .then(res => res.json())
      .then((data) => {
        this.setState(() => ({
          files: data.data.children,
          after: data.data.after,
          before: data.data.before,
          page: this.state.page + 1
        }));
        window.scrollTo(0, 0);
      })
      .catch(console.log)
  }

  prevPage = () => {
    fetch(this.url + this.state.currentSubreddit + "/" + this.state.sort + ".json?count=" + (((this.state.page - 1) * 25) - 1) + "&before=" + this.state.before)
      .then(res => res.json())
      .then((data) => {
        window.scrollTo(0, 0);
        let newState = {
          files: data.data.children,
          after: data.data.after,
          before: data.data.before
        }
        if (this.state.page > 1) {
          newState.page = this.state.page - 1
        }
        this.setState(newState)
      })
      .catch(console.log)
  }

  changeSubreddit(sub) {
    /* 
     * Empty the files so we will show 'Loading...'
     * Reset page to 1
     */
    this.setState({
      files: [],
      currentSubreddit: sub,
      page: 1
    });
    fetch(this.url + sub + "/" + this.state.sort + '.json')
      .then(res => res.json())
      .then((data) => {
        this.setState({
          files: data.data.children,
          after: data.data.after,
          before: data.data.before
        });
        window.scrollTo(0, 0);
      })
      .catch(console.log)
  }

  changeSort(sort) {
    /* 
     * Empty the files so we will show 'Loading...'
     * Reset page to 1
     */
    this.setState({
      files: [],
      sort: sort,
      page: 1
    })
    fetch(this.url + this.state.currentSubreddit + "/" + sort + '.json')
      .then(res => res.json())
      .then((data) => {
        this.setState({
          files: data.data.children,
          after: data.data.after,
          before: data.data.before
        });
        window.scrollTo(0, 0);
      })
      .catch(console.log)
  }

  searchSubreddit(subreddit) {
    if (subreddit.length !== 0) {
      this.changeSubreddit(subreddit);
    }
  }

  render () {
    const searchSubreddit = _.debounce((term) => {this.searchSubreddit(term)}, 600);
    let contentJSX;
    if (this.state.files.length > 0) {
      let pagingJSX;
      const buttonNext = <button className="btn btn-primary" type="submit" onClick={this.nextPage}>Next</button>;
      const buttonPrev = <button className="btn btn-secondary" type="submit" onClick={this.prevPage}>Previous</button>;
      if (this.state.after === null && this.state.before !== null) {
          // last page
          pagingJSX = <div>{buttonPrev}</div>;
      } else if (this.state.before === null && this.state.after !== null) {
          // first page
          pagingJSX = <div>{buttonNext}</div>;
      } else if (this.state.before !== null && this.state.after !== null) {
          // in between pages
          pagingJSX = <div>{buttonPrev} <span className="p-3 text-black-50">Page {this.state.page}</span> {buttonNext}</div>;
      } else {
        pagingJSX = <div>No Posts found.</div>;
      }
      contentJSX = <div className="m-2"><Wallpapers files={this.state.files}/><br/><div className="center-block m-2">{pagingJSX}</div></div>;
    } else {
      contentJSX = <div className="p-2"><center>Loading...</center></div>;
    }

    let currentSubreddit = "r/" + this.state.currentSubreddit;

    return (
      <div className="container">
        <br/>
        <div>
          <div className="dropdown m-2" style={{display: "inline"}}>
            <button className="btn btn-outline-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {currentSubreddit} &nbsp;
            </button>
          </div>
          <div className="dropdown m-2" style={{display: "inline"}}>
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.state.sort} &nbsp;
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {this.sorts.map((sort, index) => (
                <a className="dropdown-item" key={index} href="#subChange" onClick={() => this.changeSort(sort)}>{sort}</a>
              ))}
            </div>
          </div>
          <div className="m-3"></div>
          <SearchBar onSearchTermChange={term => searchSubreddit(term)}/>
        </div>
        <br/>
        {contentJSX}
        <br/>
        <footer><center><p>Taken from github</p></center></footer>
      </div>
    );
  }

}

export default App;
