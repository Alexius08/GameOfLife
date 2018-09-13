import React, { Component } from 'react';
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.state={
     width:20, height:20, vWrap:false, hWrap:false, matrix:[],
     genCount:0, isRunning: false
    }
  }
  componentDidMount(){
    let x = this.state.height;
    let y = this.state.width;

    let newmatrix = [];

    for (let i = 0; i < x; i++){
      newmatrix.push([]);
      for (let j = 0; j < y; j++){
        newmatrix[i].push((Math.floor((Math.random() * 2)) ==1) ? true: false);
      }
    }
    this.setState({matrix: newmatrix})
  }
  toggleCell(x,y){
    let newmatrix = this.state.matrix;
    newmatrix[x][y] = !newmatrix[x][y];
    this.setState({matrix: newmatrix});
  }
  clearGrid(){
    const st = this.state;
    let newmatrix = st.matrix;
    for (let i = 0; i < st.height; i++){
      newmatrix[i].fill(false);
    }
    this.setState({matrix: newmatrix, genCount:0})
  }
  getNewMatrix(){
    const st = this.state;

    let newmatrix = JSON.parse(JSON.stringify(st.matrix));
    for (let i = 0; i < st.height; i++){
      for (let j = 0; j < st.width; j++){
        let liveneighbors = this.getNeighbors(i,j,st.matrix)
          .map(({x,y}) => st.matrix[x][y])
          .filter((tile) => tile == true)
          .length;
        if (st.matrix[i][j]==false){
          if(liveneighbors==3) newmatrix[i][j]=true;
          }
        else{
          newmatrix[i][j] = [2,3].includes(liveneighbors);
        }
      }
    }
    this.setState({matrix:newmatrix,genCount:st.genCount+1})
  }

  getNeighbors(x,y,matrix){
    let neighborCoords = [];
    for (let i = x-1; i < x+2; i++){
      for (let j = y-1; j < y+2; j++){
        if(!(i==x&&j==y)) neighborCoords.push({x:i,y:j});
      }
    }
    let filtered = neighborCoords.filter(({x,y}) =>
      [-1, matrix[0].length].includes(y) || [-1, matrix.length].includes(x))
      .map((i) => Object.assign({}, i));
    filtered.forEach((tile)=>{
      if (this.state.hWrap){
        if (tile.y == -1) tile.y = matrix[0].length -1;
        else if (tile.y == matrix[0].length) tile.y = 0;
      }
      if (this.state.vWrap){
        if (tile.x == -1) tile.x = matrix.length -1;
        else if (tile.x == matrix.length) tile.y = 0;                        
      }
    });
    neighborCoords.concat(filtered);
    return neighborCoords.filter(({x,y}) =>
      ![-1, matrix[0].length].includes(y) &&
      ![-1, matrix.length].includes(x));
  }
 
  render(){
  const st = this.state;
  return(<div>
    <table id="matrix">
     {st.matrix.map((row,i)=>
        <tr className="cell">
         {row.map((column,j)=>
            <td className={(st.matrix[i][j] ? "live" : "dead") +" cell"}
              onClick={()=>this.toggleCell(i,j)}>
            </td>)}
        </tr>)
        }
    </table>
    <Panel clear={()=>this.clearGrid()}
      refresh={()=>this.getNewMatrix()}
      genCount={st.genCount}/>
    </div>)
  }
}

class Panel extends Component{
  render(){
    const pr = this.props;
    return (<div>
      Generations: <span id="genCount">{pr.genCount}</span>
      <button id="toggleRun">Pause</button>
      <button onClick={pr.refresh}>Step</button>
      <button onClick={pr.clear}>Clear</button>
    </div>)
  }
}


export default App;