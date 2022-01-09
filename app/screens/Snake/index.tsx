import React, {useState} from "react";
import * as loginActions from "app/store/actions/loginActions";
import NavigationService from "app/navigation/NavigationService";
import {useDispatch, useSelector} from "react-redux";
import styles from "app/screens/Login/styles";


import styled from 'styled-components/native';

import {Dimensions, Platform, View, ImageBackground, Image} from 'react-native';
import {ILoginState} from "app/models/reducers/login";
let dimensions = Dimensions.get('window');
console.log(dimensions);

var ROWS_COUNT = 12;
var COLS_COUNT = 12;


const StyledGrid = styled.View`
  margin-top: 20px;
  borderTopWidth: 1px;
  borderLeftWidth: 1px;
  align-self: center;
`;


var StyledRow = styled.View`
    flex-direction: row;
    justify-content: center;  
  
`;
var StyledCell = styled.View`
  borderRightWidth: 1px;
  borderBottomWidth: 1px;
`;

var StyledStartCell = styled.View`
  borderRightWidth: 1px;
  borderBottomWidth: 1px;
  padding: 5px;
  max-width: 100%;
`;
var StyledGoalCell = styled.View`
  borderRightWidth: 1px;
  borderBottomWidth: 1px;
  padding: 10px;
  max-width: 100%;
`;
var StyledText = styled.Text`
  font-size: 8px
`;

function startCell(props: any) {
    return (
        <StyledStartCell key={`${props.rowIndex}_${props.cellIndex}`} style={{width: props.width, height: props.height
        }}><Image source={require("../../assets/cartoon-man.png")} style={{width: '100%', height: '100%', resizeMode: 'contain'}}></Image></StyledStartCell>
    )
}
function goalCell(props: any) {
   return (
       <StyledGoalCell key={`${props.rowIndex}_${props.cellIndex}`} style={{width: props.width, height: props.height
       }}><Image source={require("../../assets/coin.png")} style={{width: '100%', height: '100%', resizeMode: 'contain'}}></Image></StyledGoalCell>
   );
}


function Grid(props: any){
    if(props.contentHeight > 0 && props.contentWidth > 0) {
        // keep
    } else {
        return;
    }
    console.log(props.grid.length, props.grid[0].length)

    return <StyledGrid>
        {props.grid.map((row: any, rowIndex: any) => {
            return (
                <StyledRow key={rowIndex} flexDirection="row">
                    {props.grid[rowIndex].map((cell: any, cellIndex: number) => {
                        const cellProps = {
                            width: Math.trunc(props.contentWidth / props.colsCount),
                            height: Math.trunc(props.contentHeight / props.rowsCount),
                            rowIndex,
                            cellIndex
                        };

                        if(cell && cell['type'] === 'startCell') {
                            return startCell(cellProps);
                        }
                        if(cell && cell['type'] === 'goalCell') {
                            return goalCell(cellProps);
                        }

                        return (
                            <StyledCell key={`${rowIndex}_${cellIndex}`} style={{width: cellProps.width, height: cellProps.height
                            }}><StyledText></StyledText></StyledCell>
                        )
                    })}
                </StyledRow>
            )


        })
        }</StyledGrid>
}

const Node = function (this:any, parent: any, startY: number, startX: number): any {
    this.parent = parent;
    this.y = startY;
    this.x = startX;
};

const BellmanFord = function (this: any) {
    let grid: any = [];

    let verticles: any = {};
    let distances: any = {};

    let openList: any = {};
    let visitedList: any = {};

    this.setGrid = function (_grid: any) {
        grid = _grid;
    };

    this.addNeighbour = function (node: any, nodeY: any, nodeX: any, neighbours: any) {
        if(nodeY >= 0 && nodeY < grid.length) {
            // keep
        } else {
            return;
        }
        if(nodeX >= 0 && nodeX < grid[0].length) {
            // keep
        } else {
            return;
        }

        const newNode = new (Node as any)(node, nodeY, nodeX);
        neighbours.push(newNode);

        return newNode;
    };
    this.getNeighbours = function (node: any, nodeY: any, nodeX: any) {
        let neighbours: any = [];
        this.addNeighbour(node, nodeY+1, nodeX, neighbours);
        this.addNeighbour(node, nodeY+1, nodeX-1, neighbours);

        this.addNeighbour(node, nodeY, nodeX-1, neighbours);
        this.addNeighbour(node, nodeY-1, nodeX-1, neighbours);

        this.addNeighbour(node, nodeY-1, nodeX, neighbours);
        this.addNeighbour(node, nodeY-1, nodeX+1, neighbours);

        this.addNeighbour(node, nodeY, nodeX+1, neighbours);
        this.addNeighbour(node, nodeY+1, nodeX+1, neighbours);

        neighbours.map((neighbour: any) => {
            if(typeof openList[`${neighbour.y}_${neighbour.x}`] === 'undefined') {
                openList[`${neighbour.y}_${neighbour.x}`] = neighbour;
            }
        });

        neighbours = neighbours.filter((neighbour: any) => {
            if(typeof visitedList[`${neighbour.y}_${neighbour.x}`] === 'undefined') {
                return true;
            }
            return false;
        });


        delete openList[`${node.y}_${node.x}`];
        visitedList[`${node.y}_${node.x}`] = node;

        return neighbours;
    };
    this.getNextNodeFromOpenList = () => {
        return openList[Object.keys(openList)[0]];
    };

    this.findPath = (startY: number, startX: number, endY: number, endX: number, cb: any) => {
        for(let i = 0; i < grid.length; i++) {
            for(let j = 0; j < grid[i].length; j++) {
                verticles[`${i}_${j}`] = null;
            }
        }
        const startingNode = new (Node as any)(null, startY, startX, 0);
        verticles[`${startY}_${startX}`] = startingNode;
        distances[`${startingNode.y}_${startingNode.x}`] = 0;

        openList[`${startingNode.y}_${startingNode.x}`] = startingNode;
        visitedList[`${startingNode.y}_${startingNode.x}`] = startingNode;


        for(let i = 0; i < Object.keys(verticles).length + 100 + 100+100; i++) {
            const searchNode = this.getNextNodeFromOpenList();
            const neighbours = this.getNeighbours(searchNode, searchNode.y, searchNode.x);

            for(let i = 0; i < neighbours.length; i++) {
                const newNode = neighbours[i];

                if(typeof visitedList[`${newNode.y}_${newNode.x}`] === "undefined") {
                    // keep
                } else {
                    continue;
                }

                if(verticles[`${newNode.y}_${newNode.x}`] === null) {
                    verticles[`${newNode.y}_${newNode.x}`] = newNode;
                }

                const isDiagonal = (searchNode.y === newNode.y+1 && searchNode.x === newNode.x-1)
                    || (searchNode.y === newNode.y-1 && searchNode.x === newNode.x-1)
                    || (searchNode.y === newNode.y-1 && searchNode.x === newNode.x+1)
                    || (searchNode.y === newNode.y+1 && searchNode.x === newNode.x+1);

                const distanceFromStart = distances[`${searchNode.y}_${searchNode.x}`] + (isDiagonal ? 14 : 10);

                if(typeof distances[`${newNode.y}_${newNode.x}`] === 'undefined') {
                    distances[`${newNode.y}_${newNode.x}`] = distanceFromStart;
                }
                if(distanceFromStart < distances[`${newNode.y}_${newNode.x}`]) {
                    verticles[`${newNode.y}_${newNode.x}`].parent = searchNode;
                    distances[`${newNode.y}_${newNode.x}`] = distanceFromStart;
                }
            }
        }



        console.log(distances[`${endY}_${endX}`]);
        console.log(distances);
        if(distances[`${endY}_${endX}`]) {
            let path = [];
            let node = verticles[`${endY}_${endX}`];
            path.push(node);

            while(node.parent !== null) {
                path.push(node.parent);
                node = node.parent;
            }
            path = path.reverse();

            return cb(path);
        }
        return cb(null);
    };
};


export function putCoordsAndPath(startY: number, startX: number, endY: number, endX: number, path: any, promise: any) {
    return {
        type: "putCoordsAndPath",
        startY,
        startX,
        endY,
        endX,
        path,
        promise
    };
}


const Snake: React.FC = () => {
    const dispatch = useDispatch();

    var [contentHeight, setContentHeight] = useState(0);
    var [contentWidth, setContentWidth] = useState(0);

    const startY = useSelector((state: any) => state.snakeReducer.startY);
    const startX = useSelector((state: any) => state.snakeReducer.startX);
    const endY = useSelector((state: any) => state.snakeReducer.endY);
    const endX = useSelector((state: any) => state.snakeReducer.endX);

    const path = useSelector((state: any) => state.snakeReducer.path);

    const dfd = useSelector((state: any) => state.snakeReducer.promise);


    let rowsCount: any, colsCount: any;
    contentHeight -= 50;
    contentWidth -= 50;

    if(contentHeight > contentWidth) {
        // vertical orientation
        rowsCount = ROWS_COUNT;
        colsCount = Math.trunc(contentWidth / Math.trunc(contentHeight/rowsCount));
    } else {
        colsCount = COLS_COUNT;
        rowsCount = Math.trunc(contentHeight / Math.trunc(contentWidth/colsCount));
    }

    const setDimensions = (event: any) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        setContentHeight(height);
        setContentWidth(width);
    };


    const _grid: any = [];

    for(var i = 0; i < rowsCount; i++) {
        let row: any = [];
        for(var j = 0; j < colsCount; j++) {
            const cell = null;

            row.push(cell);
        }
        _grid.push(row);

    }

    React.useEffect(() => {
        if(startY === null && startX === null && endY === null && endX === null) {
            // keep
        } else {
            return;
        }

        dfd.then(() => {
            dispatch(putCoordsAndPath(1,5,8,5, null, Promise.resolve()));
        });
    });

    const generateRandomInteger = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max-min+1) + min);
    };

    const generateGoalCoords = (): any => {
        let rowIndex, colIndex;

        const MAX_ATTEMPTS = 1000;
        let attempt = 0;
        while(attempt < MAX_ATTEMPTS) {
            rowIndex = generateRandomInteger(0, rowsCount-1);
            colIndex = generateRandomInteger(0, colsCount-1);

            if(_grid[rowIndex][colIndex] === null) {
                return {y: rowIndex, x: colIndex};
            }
            attempt++;
        }
        return null;
    };



    if(startY !== null && startX !== null) {
        _grid[startY as any][startX as any] = {"type": "startCell"};
    }

    if(endY !== null && endX !== null) {
        _grid[endY as any][endX as any] = {"type": "goalCell"};
    }


    React.useEffect(() => {
        if((!path || path.length === 0) && startY !== null && startX !== null && endY !== null && endX !== null) {
            const bellmanFord = new (BellmanFord as any)();
            bellmanFord.setGrid(_grid);
            bellmanFord.findPath(startY, startX, endY, endX, (path: any) => {

                dfd.then(() => {
                    dispatch(putCoordsAndPath(startY, startX, endY, endX, path, Promise.resolve()));
                })
            });
        }
    }, [path, startY, startX, endY, endX]);

    React.useEffect(() => {
        if(path && path.length) {

            const currentPath = JSON.parse(JSON.stringify(path));
            let turn: any;
            if(currentPath.length) {
                turn = currentPath.shift();
            }
            if(currentPath.length && turn.y === startY && turn.x === startX) {
                turn = currentPath.shift();
            }

            const promise = new Promise((resolve, reject) => {
                if(turn.y === endY && turn.x === endX) {
                    const goalCoords = generateGoalCoords();

                    dfd.then(() => {
                        dispatch(putCoordsAndPath(turn.y, turn.x, goalCoords.y, goalCoords.x, currentPath, promise));
                    })
                } else {
                    dfd.then(() => {
                        dispatch(putCoordsAndPath(turn.y, turn.x, endY, endX, currentPath, promise));
                    });
                }

                setTimeout(() => {
                    resolve();
                }, 100)
            });
        }
    }, [path, startY, startX, endY, endX]);


    const gridProps = {
        rowsCount,
        colsCount,
        contentHeight,
        contentWidth,
        grid: _grid
    };


    return (
        <View style={styles.container} onLayout={setDimensions}>
            <ImageBackground source={require("../../assets/bg.jpg")} resizeMode="cover" style={{width: '100%', height: '100%'}}>
                { Grid(gridProps) }
            </ImageBackground>

        </View>
    );
};

export default Snake;