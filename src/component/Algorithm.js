import React,{ useState, useReducer, useEffect, useRef, useCallback } from 'react'
import Bar from './Bar'
import Header from "./Header";
//import {bubbleSort, insertionSort} from "../algorithms";

function compare(a/*: number*/, b/*: number*/)/*: ['compare', number, number]*/ {
    console.log('compare called')
    return ['compare', a, b];
}
function swap(a/*: number*/, b/*: number*/)/*: ['swap', number, number]*/ {
    return ['swap', a, b];
}

function moveForward(a/*: number*/, b/*: number*/)/*: ['swap', number, number]*/ {
    return ['overwrite', a, b];
}

function set(a, num){
    return ['set', a, num];
}
function setMarker(a){
    return ['setMarker', a];
}
function compareToVal(a,num, numIdx){
    return ['compareVal', a, num, numIdx];
}


function useSortingVisualizer(baseArray, algorithm){
    const [displayedArray, setArray] = useState([]);
    const [done, setDone] = useState(true);
    const [barEffects, setBarEffects] = useState({})
    const stepRef = useRef(() => {});
    useEffect(() => {
        console.log('usesorting visualizer useEffect, I think this is called only once when the component first renders')
        let workingArray = baseArray;
        setArray(workingArray);
        setBarEffects({});
        setDone(false);
        console.log('here is the algorithm' , algorithm)

        const generator = algorithm(0, baseArray.length, workingArray);
        let nextValue = 0;
        function doStep() {
            const action = generator.next(nextValue);
            console.log(action)
            if (action.done) {
                setDone(true);
            } else if (action.value[0] === 'compare') {
                const a = workingArray[action.value[1]];
                const b = workingArray[action.value[2]];
                if(a > b) {
                    nextValue = 1;
                } else if (a < b) {
                    nextValue = -1;
                } else {
                    nextValue = 0;
                }
                setBarEffects({
                    [action.value[1]]: 'red',
                    [action.value[2]]: 'red',
                })
            } else if (action.value[0] === 'swap') {
                workingArray = [...workingArray]
                const tmp = workingArray[action.value[1]];
                workingArray[action.value[1]] = workingArray[action.value[2]];
                workingArray[action.value[2]] = tmp;
                setArray(workingArray);
                setBarEffects({
                    [action.value[1]]: 'green',
                    [action.value[2]]: 'green',
                })
            } else if(action.value[0] === 'overwrite') {
                workingArray = [...workingArray]
                workingArray[action.value[2]] = workingArray[action.value[1]];
                setArray(workingArray);
                setBarEffects({
                    [action.value[1]]: 'green',
                    [action.value[2]]: 'green',
                })
            }
            else if(action.value[0] === 'set') {
                    workingArray = [...workingArray]
                    workingArray[action.value[1]] = action.value[2];
                    setArray(workingArray);
                    setBarEffects({
                        [action.value[1]]: 'blue',
                        [action.value[2]]: 'blue',
                    })
            }
            else if(action.value[0] === 'setMarker') {
                workingArray = [...workingArray]
                nextValue = workingArray[action.value[1]]
                setArray(workingArray);
                setBarEffects({
                    [action.value[1]]: 'blue',

                })
            }
            else if(action.value[0] === 'compareVal') {
                //crucial difference is b isnt taken from index here
                //also had to use a fourth argument which is the index that the temp value was originally from
                const a = workingArray[action.value[1]];
                const b = action.value[2];
                if(a > b) {
                    nextValue = 1;
                } else if (a < b) {
                    nextValue = -1;
                } else {
                    nextValue = 0;
                }
                setBarEffects({
                    [action.value[1]]: 'red',
                    [action.value[3]]: 'red',
                })
            }
            else {
                throw new Error('What? ' + JSON.stringify(action.value));
            }
        }
        stepRef.current = doStep;
    }, [baseArray, algorithm])

    const step = useCallback(() => {
        stepRef.current();
    }, [stepRef]);
    return {
        displayedArray,
        done,
        step,
        barEffects,
    }
}


function* bubbleSort(from, to) {
    let swapped;
    do {
        swapped = false;
        to -= 1; // decrement by 1 EACH loop, as we know the last element will be in place
        for (let j = from; j < to; j++) {
            if ((yield compare(j, j + 1)) > 0) {
                yield swap(j, j + 1);
                swapped = true;
            }
        }
    } while(swapped);
}

function* insertionSort(from, to, arr){

    let marker;//this is for the element that is first in the unsorted list

    for(let i =1;i<to;i++)
    {
        let temp = yield setMarker(i)
        let j = i - 1
        while(j >= 0 && (yield compareToVal(j,temp, i)) > 0){
            console.log('j was more than I so mvoe j forward')
            yield moveForward(j, j+1 )
            j = j - 1
        }
        yield set(j+1, temp)
    }

}

function *merge(left, right) {
    let arr = []
    // Break out of loop if any one of the array gets empty
    while (left.length && right.length) {
        // Pick the smaller among the smallest element of left and right sub arrays
        if ((yield compare(left[0], right[0])) > 0) {
            arr.push(left.shift())
        } else {
            arr.push(right.shift())
        }
    }

    // Concatenating the leftover elements
    // (in case we didn't go through the entire left or right array)
    return [ ...arr, ...left, ...right ]
}

function mergeSort(array) {
    const half = array.length / 2

    // Base case or terminating case
    if(array.length < 2){
        return array
    }

    const left = array.splice(0, half)
    return merge(mergeSort(left),mergeSort(array))
}

function makeArray(length,minVal, maxVal) {
    const array = [];
    for(let i = 0; i < length; i++) {
        array.push(Math.floor(Math.random() * (maxVal - minVal + 1) + minVal  ))
    }
    return array;
}

function Algorithm(props){
    let min = 3

    let max = 1000
    let arrLength = 300
    console.log(bubbleSort)
    const [arr, setArr] = useState(makeArray(arrLength, min, max))
    const algorithm = useRef( bubbleSort);


    const {
        displayedArray,
        done,
        step,
        barEffects,
    } = useSortingVisualizer(arr, algorithm.current);

    const [playing, setPlay] = useState(false);
    useEffect(() => {
        if(!done && playing) {
            let taskId = window.setInterval(() => {
                step();
            }, 1)
            return () => window.clearInterval(taskId);
        }
    }, [done, step, playing, algorithm])




    let bars = displayedArray.map((num,idx) => {
        //not the best way to set the bar height but dividing by 10 here is just so the largest number(1000) fits as 100% of the parent container
        let barHeight = num/10+'%'

        return (
                <div key={idx} className='array-bar' style={{backgroundColor: barEffects[idx] ,height: barHeight, bottom: '0', marginRight: '1px'}}>

                </div>
            )

    })







    return (
        <>
            <nav style={{margin: '0 auto', width: '100%', justifyContent: 'center'}}className="navbar navbar-light bg-light navbar-expand-sm">

                    <button onClick={(e) => algorithm.current = insertionSort} className="btn btn-outline-success m-1" type="button">insertion sort</button>
                    <button onClick={(e) => algorithm.current =bubbleSort} className="btn btn-outline-success" type="button">bubble sort</button>

            </nav>
            <div className='array-container'>

                {bars}

            </div>
            <div className='align-items-center justify-content-center flex' style={{display: 'flex'}}>
                <button className="btn btn-outline-primary mx-4 my-2" onClick={() => setArr(makeArray(100, 2, 1000))}>Randomize Array</button>
                <button className="btn btn-outline-primary mx-4 my-2" onClick={step}>Single Step</button>

                <button className="btn btn-outline-primary mx-4 my-2" onClick={() => setPlay(playing => !playing)}>{playing ? 'Pause autoplay' : 'Autoplay'}</button>
            </div>
        </>
    )
}
export default Algorithm



